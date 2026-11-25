/** Pure, testable guard: a preview or a developer machine can never charge. */
export function dedicatedProductionDatabase(env: NodeJS.ProcessEnv): boolean {
  // This project was provisioned exclusively for NobreDNA. Refuse another
  // agency/client database even if its secrets are configured by mistake.
  return env.VERCEL_ENV === "production" &&
    (env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/,"") === "https://rxhmkyrputgzusbobegt.supabase.co";
}

export function configuredProductionStore(env: NodeJS.ProcessEnv): boolean {
  if (!dedicatedProductionDatabase(env) || env.ENABLE_LIVE_CHECKOUT !== "true" ||
      env.MERCADOPAGO_MODE !== "production" ||
      env.MELHOR_ENVIO_BASE_URL !== "https://melhorenvio.com.br") return false;
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SECRET_KEY", "MERCADOPAGO_ACCESS_TOKEN", "MERCADOPAGO_WEBHOOK_SECRET",
    "MELHOR_ENVIO_TOKEN", "MELHOR_ENVIO_USER_AGENT", "STORE_RATE_LIMIT_SECRET",
    "RESEND_API_KEY", "STORE_EMAIL_FROM"];
  if (!required.every(key => Boolean(env[key]?.trim())) || !/^\d{8}$/.test(env.ORIGEM_CEP ?? "")) return false;
  try {
    const url = new URL(env.NEXT_PUBLIC_SITE_URL ?? "");
    return url.protocol === "https:" && !url.username && !url.password &&
      url.pathname === "/" && !url.search && !url.hash;
  } catch { return false; }
}

export function productionOrderProcessing(env: NodeJS.ProcessEnv): boolean {
  // Existing paid orders may still need notification/reconciliation if new sales have been paused.
  return dedicatedProductionDatabase(env) && env.MERCADOPAGO_MODE === "production";
}

export function verifiedPaymentUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      ["www.mercadopago.com.br", "mercadopago.com.br"].includes(url.hostname)
      ? url.href : null;
  } catch { return null; }
}

export const orderReferencePattern = /^NDNA-[0-9A-F]{32}$/;
export const checkoutKeyPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const brazilStates = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));

export function parseBuyer(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  const data: Record<string, string> = {};
  const required = ["nome", "email", "telefone", "cep", "logradouro", "numero", "bairro", "cidade", "uf"];
  for (const key of [...required, "complemento"]) {
    data[key] = typeof obj[key] === "string" ? obj[key].trim() : "";
    if (data[key].length > 160) return null;
  }
  if (required.some(key => !data[key])) return null;
  data.cep = data.cep.replace(/\D/g, "");
  data.telefone = data.telefone.replace(/\D/g, "");
  data.uf = data.uf.toUpperCase();
  data.email = data.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      !/^\d{8}$/.test(data.cep) || !/^\d{10,11}$/.test(data.telefone) ||
      !brazilStates.has(data.uf)) return null;
  return data;
}

export function confirmedTotal(subtotal: number, shipping: number, displayed: unknown): boolean {
  return Number.isSafeInteger(subtotal) && subtotal > 0 && Number.isSafeInteger(shipping) &&
    shipping >= 0 && Number.isSafeInteger(subtotal + shipping) && displayed === subtotal + shipping;
}

/** Parse the authoritative provider response, never client-returned status. */
export function paymentSnapshot(value: unknown, id: string) {
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  if (String(p.id) !== id || p.live_mode !== true || typeof p.external_reference !== "string" ||
      !orderReferencePattern.test(p.external_reference) || typeof p.status !== "string" ||
      typeof p.date_last_updated !== "string" || !Number.isFinite(Date.parse(p.date_last_updated)) ||
      typeof p.currency_id !== "string" || typeof p.transaction_amount !== "number") return null;
  const amount = Math.round(p.transaction_amount * 100);
  const refunded = Math.round(Number(p.transaction_amount_refunded ?? 0) * 100);
  if (!Number.isSafeInteger(amount) || amount < 0 || !Number.isSafeInteger(refunded) || refunded < 0) return null;
  return { reference: p.external_reference, id, status: p.status, amount, refunded,
    currency: p.currency_id, event: `${id}:${p.status}:${p.date_last_updated}` };
}

type PreferenceInput = {
  siteUrl: string; reference: string; expiresAt: string; buyerName: string; buyerEmail: string;
  items: { product_id: string; title: string; quantity: number; unit_price_cents: number }[];
  shipping: { carrier: string; service: string; priceCents: number };
};

export function buildPaymentPreference(input: PreferenceInput, now: Date = new Date()) {
  const base = input.siteUrl.replace(/\/$/, "");
  const back = `${base}/checkout/retorno?pedido=${encodeURIComponent(input.reference)}`;
  return {
    items: [
      ...input.items.map(item=>({id:item.product_id,title:item.title,category_id:"books",quantity:item.quantity,currency_id:"BRL",unit_price:item.unit_price_cents/100})),
      ...(input.shipping.priceCents>0?[{id:"shipping",title:`Frete — ${input.shipping.carrier} ${input.shipping.service}`,quantity:1,currency_id:"BRL",unit_price:input.shipping.priceCents/100}]:[])
    ],
    payer:{name:input.buyerName,email:input.buyerEmail},
    external_reference:input.reference,back_urls:{success:back,pending:back,failure:back},auto_return:"approved",
    notification_url:`${base}/api/checkout/webhook?source_news=webhooks`,expires:true,
    expiration_date_from:now.toISOString(),expiration_date_to:new Date(input.expiresAt).toISOString(),
    statement_descriptor:"NOBREDNA"
  };
}

/** The fetch argument is injectable only in tests; production always uses the official API. */
export async function createPaymentPreference(input: PreferenceInput, token: string, orderId: string, client: typeof fetch = fetch) {
  const response=await client("https://api.mercadopago.com/checkout/preferences",{
    method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","X-Idempotency-Key":orderId},
    body:JSON.stringify(buildPaymentPreference(input)),signal:AbortSignal.timeout(12000),cache:"no-store"
  });
  if(!response.ok)throw new Error("preference_not_created");
  const data=await response.json(),url=verifiedPaymentUrl(data.init_point);
  if(typeof data.id!=="string"||!data.id||!url)throw new Error("invalid_preference_response");
  return {id:data.id as string,url};
}
