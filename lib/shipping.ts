import { getBook } from "@/lib/books";
import { institucional } from "@/lib/institucional";

export type QuoteRequestLine = { slug: string; qty: number };

export type ShippingOption = {
  id: string;
  service: string;
  carrier: string;
  priceCents: number;
  /** prazo em dias úteis, já com o tempo de expedição da casa */
  days: number;
};

export type ShippingQuote = {
  options: ShippingOption[];
  /** true quando as opções vieram da tabela local, sem chamar o Melhor Envio */
  simulated: boolean;
  notice?: string;
};

/** Dias úteis que a casa leva para despachar. */
const HANDLING_DAYS = 2;

export type NormalizedCart = {
  products: {
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }[];
  totalCents: number;
  totalWeightKg: number;
  units: number;
};

/**
 * Reconstrói o carrinho a partir do catálogo do servidor.
 * O cliente só envia slug e quantidade — preço, peso e dimensões nunca chegam
 * do navegador.
 */
export function normalizeCart(lines: unknown): NormalizedCart | null {
  if (!Array.isArray(lines) || lines.length === 0) return null;

  const products: NormalizedCart["products"] = [];
  let totalCents = 0;
  let totalWeightKg = 0;
  let units = 0;

  for (const line of lines) {
    if (typeof line !== "object" || line === null) return null;
    const { slug, qty } = line as Partial<QuoteRequestLine>;
    if (typeof slug !== "string") return null;
    const book = getBook(slug);
    if (!book) return null;

    const quantity = Math.floor(Number(qty));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 12) return null;

    const { shipping } = book;
    products.push({
      id: book.slug,
      width: shipping.widthCm,
      height: shipping.heightCm,
      length: shipping.lengthCm,
      weight: shipping.weightKg,
      insurance_value: Number((book.priceCents / 100).toFixed(2)),
      quantity,
    });

    totalCents += book.priceCents * quantity;
    totalWeightKg += shipping.weightKg * quantity;
    units += quantity;
  }

  return { products, totalCents, totalWeightKg, units };
}

export function isValidCEP(cep: string): boolean {
  return /^\d{8}$/.test(cep);
}

/**
 * Tabela local usada só quando MELHOR_ENVIO_TOKEN não está configurado, para o
 * fluxo de checkout continuar navegável em desenvolvimento. Os valores são
 * estimativas — a resposta vem marcada como `simulated`.
 */
function simulate(cart: NormalizedCart, cep: string): ShippingQuote {
  const region = Number(cep[0]);
  /* Fator por faixa de CEP do destino, medido a partir de Curitiba — a casa
     despacha do Paraná, não do Sudeste. A tabela anterior dava fator 1 à
     faixa 0 (capital paulista) porque a origem de exemplo era São Paulo; com
     a mudança, ela cobrava o frete mais barato justamente para o destino mais
     distante e o mais caro para a cidade vizinha.

       0 SP capital  1 SP interior  2 RJ/ES  3 MG  4 BA/SE
       5 PE/PB/RN/AL 6 Norte/CE/PI  7 Centro-Oeste  8 PR/SC (origem)  9 RS */
  const distanceFactor = [1.25, 1.3, 1.35, 1.4, 1.6, 1.7, 1.85, 1.55, 1, 1.15][
    Number.isNaN(region) ? 5 : region
  ];
  const weightCents = Math.ceil(cart.totalWeightKg * 1400);
  const base = 1890 + weightCents;

  const options: ShippingOption[] = [
    {
      id: "sim-pac",
      service: "PAC",
      carrier: "Correios",
      priceCents: Math.round(base * distanceFactor),
      days: Math.round(5 * distanceFactor),
    },
    {
      id: "sim-sedex",
      service: "SEDEX",
      carrier: "Correios",
      priceCents: Math.round(base * distanceFactor * 1.75),
      days: Math.max(1, Math.round(2 * distanceFactor)),
    },
    {
      id: "sim-jadlog",
      service: ".Package",
      carrier: "Jadlog",
      priceCents: Math.round(base * distanceFactor * 1.32),
      days: Math.round(4 * distanceFactor),
    },
  ].map((o) => ({ ...o, days: o.days + HANDLING_DAYS }));

  return {
    options: options.sort((a, b) => a.priceCents - b.priceCents),
    simulated: true,
    notice:
      "Valores estimados: MELHOR_ENVIO_TOKEN não está configurado neste ambiente.",
  };
}

type MelhorEnvioService = {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
  company?: { name?: string };
  error?: string;
};

/** Cotação de frete no Melhor Envio (v2). */
export async function quoteShipping(
  cart: NormalizedCart,
  cep: string,
): Promise<ShippingQuote> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  // o padrão é o Centro de Curitiba, de onde a casa despacha
  const origin = (process.env.ORIGEM_CEP ?? "80010000").replace(/\D/g, "");

  if (!token) return simulate(cart, cep);

  const baseUrl = (
    process.env.MELHOR_ENVIO_BASE_URL ?? "https://sandbox.melhorenvio.com.br"
  ).replace(/\/$/, "");
  if (!["https://melhorenvio.com.br", "https://sandbox.melhorenvio.com.br"].includes(baseUrl) ||
      !isValidCEP(origin) || !isValidCEP(cep)) {
    throw new Error("Configuração de frete inválida");
  }

  const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent":
        process.env.MELHOR_ENVIO_USER_AGENT ??
        `NobreDNA Editorial (${institucional.email})`,
    },
    body: JSON.stringify({
      from: { postal_code: origin },
      to: { postal_code: cep },
      products: cart.products,
      options: {
        receipt: false,
        own_hand: false,
        insurance_value: Number((cart.totalCents / 100).toFixed(2)),
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`Melhor Envio respondeu ${response.status}`);
  }

  const data = (await response.json()) as MelhorEnvioService[];
  if (!Array.isArray(data)) {
    throw new Error("Resposta inesperada do Melhor Envio");
  }

  const options = data
    .filter((service) => !service.error && (service.custom_price ?? service.price))
    .map((service) => {
      const price = Number(service.custom_price ?? service.price);
      const days = service.custom_delivery_time ?? service.delivery_time ?? 0;
      return {
        id: String(service.id),
        service: service.name,
        carrier: service.company?.name ?? "Transportadora",
        priceCents: Math.round(price * 100),
        days: days + HANDLING_DAYS,
      };
    })
    .filter((option) => Number.isSafeInteger(option.priceCents) && option.priceCents > 0 &&
      Number.isInteger(option.days) && option.days > 0 && option.days <= 365 &&
      /^[0-9]+$/.test(option.id) && typeof option.service === "string" && option.service.length > 0)
    .sort((a, b) => a.priceCents - b.priceCents);

  return { options, simulated: false };
}
