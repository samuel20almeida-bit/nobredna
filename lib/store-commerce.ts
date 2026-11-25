import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { NormalizedCart } from "@/lib/shipping";
import { dedicatedProductionDatabase } from "./store-guard";

// O cliente privilegiado fica exclusivamente no servidor. Nenhuma de suas
// chamadas é exposta por rotas públicas enquanto as integrações não estiverem prontas.
export function commerceClient() {
  if (!dedicatedProductionDatabase(process.env)) throw new Error("Banco comercial indisponível neste ambiente.");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Loja ainda não configurada.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function releaseExpiredReservations(): Promise<{ released: number; awaiting_reconciliation: number }> {
  const result = await commerceClient().rpc("store_sweep_expired_reservations", { p_limit: 50 });
  if (result.error || !result.data) throw new Error("Não foi possível verificar as reservas.");
  return result.data as { released: number; awaiting_reconciliation: number };
}

type CommercialProduct = {
  id: string; slug: string; title: string; author: string; price_cents: number; stock: number;
  weight_g: number; width_mm: number; height_mm: number; length_mm: number;
};

export type ValidatedCart = {
  items: { product_id: string; quantity: number; unit_price_cents: number; title: string }[];
  shipping: NormalizedCart;
};

export async function validateCommercialCart(raw: unknown): Promise<ValidatedCart | null> {
  if (!Array.isArray(raw) || !raw.length || raw.length > 30) return null;
  const quantities = new Map<string, number>();
  for (const input of raw) {
    if (!input || typeof input !== "object") return null;
    const { slug, qty } = input as Record<string, unknown>;
    if (typeof slug !== "string" || slug.length > 120 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
      || typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > 12) return null;
    const merged = (quantities.get(slug) ?? 0) + qty;
    if (merged > 12) return null;
    quantities.set(slug, merged);
  }
  const units = [...quantities.values()].reduce((sum, qty) => sum + qty, 0);
  if (units > 30) return null;
  const result = await commerceClient().from("store_products")
    .select("id,slug,title,author,price_cents,stock,weight_g,width_mm,height_mm,length_mm")
    .eq("status", "active").eq("published", true).in("slug", [...quantities.keys()]);
  if (result.error) throw new Error("Não foi possível consultar o catálogo.");
  const products = (result.data ?? []) as CommercialProduct[];
  if (products.length !== quantities.size) return null;
  const items: ValidatedCart["items"] = [];
  const shipping: NormalizedCart = { products: [], units, totalCents: 0, totalWeightKg: 0 };
  for (const book of products) {
    const quantity = quantities.get(book.slug)!;
    if (book.stock < quantity || !book.price_cents || !book.weight_g || !book.width_mm || !book.height_mm || !book.length_mm) return null;
    items.push({ product_id: book.id, quantity, unit_price_cents: book.price_cents, title: book.title });
    shipping.products.push({ id: book.slug, quantity, width: book.width_mm / 10, height: book.height_mm / 10,
      length: book.length_mm / 10, weight: book.weight_g / 1000, insurance_value: book.price_cents / 100 });
    shipping.totalCents += book.price_cents * quantity;
    shipping.totalWeightKg += book.weight_g / 1000 * quantity;
  }
  return { items, shipping };
}

export type OrderReservation = { id: string; reference: string; subtotal_cents: number; shipping_cents: number;
  total_cents: number; reservation_status: "reserved" | "payment_started" | "committed" | "released"; expires_at: string };

/** Chamado somente depois de uma cotação real e no mesmo fluxo de criação do pagamento. */
export async function reserveOrder(input: { checkoutKey: string; buyerName: string; buyerEmail: string;
  address: Record<string, string>; shippingService: string; shippingCents: number; cart: ValidatedCart }): Promise<OrderReservation> {
  const result = await commerceClient().rpc("store_reserve_order", {
    p_checkout_key: input.checkoutKey, p_customer_name: input.buyerName,
    p_customer_email: input.buyerEmail, p_shipping_address: input.address,
    p_shipping_service: input.shippingService, p_shipping_cents: input.shippingCents, p_items: input.cart.items,
  });
  if (result.error || !result.data) throw new Error("Não foi possível reservar o pedido. Confira preço e estoque.");
  return result.data as OrderReservation;
}

export async function beginPayment(orderId: string): Promise<boolean> {
  const result = await commerceClient().rpc("store_begin_payment", { p_order_id: orderId });
  if (result.error) throw new Error("Não foi possível iniciar o pagamento.");
  return result.data === true;
}

export async function releaseUnsubmittedOrder(orderId: string): Promise<boolean> {
  const result = await commerceClient().rpc("store_release_unsubmitted_order", { p_order_id: orderId });
  if (result.error) throw new Error("Não foi possível cancelar a reserva.");
  return result.data === true;
}
