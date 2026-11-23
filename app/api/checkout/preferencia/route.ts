import { NextResponse } from "next/server";
import { getBook } from "@/lib/books";
import { isValidCEP, normalizeCart, quoteShipping } from "@/lib/shipping";

export const runtime = "nodejs";

type Comprador = {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const CAMPOS: (keyof Comprador)[] = [
  "nome",
  "sobrenome",
  "email",
  "cpf",
  "telefone",
  "cep",
  "logradouro",
  "numero",
  "bairro",
  "cidade",
  "uf",
];

function lerComprador(raw: unknown): Comprador | null {
  if (typeof raw !== "object" || raw === null) return null;
  const src = raw as Record<string, unknown>;
  const comprador = {} as Comprador;

  for (const campo of [...CAMPOS, "complemento" as const]) {
    const valor = src[campo];
    comprador[campo] = typeof valor === "string" ? valor.trim().slice(0, 160) : "";
  }

  if (CAMPOS.some((campo) => comprador[campo].length === 0)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(comprador.email)) return null;

  comprador.cpf = comprador.cpf.replace(/\D/g, "");
  comprador.cep = comprador.cep.replace(/\D/g, "");
  comprador.telefone = comprador.telefone.replace(/\D/g, "");
  comprador.uf = comprador.uf.toUpperCase().slice(0, 2);

  if (comprador.cpf.length !== 11) return null;
  if (!isValidCEP(comprador.cep)) return null;
  if (comprador.telefone.length < 10) return null;

  return comprador;
}

function referencia(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `NDNA-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  if (process.env.ENABLE_LIVE_CHECKOUT !== "true") {
    return NextResponse.json({ erro: "A loja está em demonstração. Nenhuma cobrança pode ser realizada." }, { status: 503 });
  }
  let body: { itens?: unknown; comprador?: unknown; freteId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const cart = normalizeCart(body.itens);
  if (!cart) {
    return NextResponse.json({ erro: "Sacola inválida." }, { status: 422 });
  }

  const comprador = lerComprador(body.comprador);
  if (!comprador) {
    return NextResponse.json(
      { erro: "Confira os dados de entrega e o CPF informado." },
      { status: 422 },
    );
  }

  const freteId = String(body.freteId ?? "");
  if (!freteId) {
    return NextResponse.json(
      { erro: "Escolha uma forma de envio." },
      { status: 422 },
    );
  }

  // O frete é recotado no servidor: o preço escolhido no navegador nunca é
  // aceito como verdade.
  let frete;
  try {
    const quote = await quoteShipping(cart, comprador.cep);
    frete = quote.options.find((option) => option.id === freteId);
  } catch (error) {
    console.error("[checkout] falha ao recotar frete", error);
    return NextResponse.json(
      { erro: "Não foi possível confirmar o frete. Refaça a cotação." },
      { status: 502 },
    );
  }

  if (!frete) {
    return NextResponse.json(
      { erro: "A opção de envio expirou. Calcule o frete novamente." },
      { status: 409 },
    );
  }

  const totalCents = cart.totalCents + frete.priceCents;
  const externalReference = referencia();

  const resumo = {
    referencia: externalReference,
    subtotalCents: cart.totalCents,
    freteCents: frete.priceCents,
    totalCents,
    frete,
  };

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    // Sem credencial não existe cobrança — o pedido é apenas montado e
    // devolvido, e a interface deixa isso explícito para o usuário.
    return NextResponse.json({ simulado: true, ...resumo });
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  ).replace(/\/$/, "");

  const preference = {
    items: cart.products.map((product) => {
      const book = getBook(product.id)!;
      return {
        id: book.slug,
        title: book.title,
        description:
          book.origem === "assessoria"
            ? `${book.author} · Coleção ${book.collection}`
            : `${book.author}${book.serie ? ` · Série ${book.serie}` : ""}`,
        category_id: "books",
        quantity: product.quantity,
        currency_id: "BRL",
        unit_price: Number((book.priceCents / 100).toFixed(2)),
      };
    }),
    payer: {
      name: comprador.nome,
      surname: comprador.sobrenome,
      email: comprador.email,
      identification: { type: "CPF", number: comprador.cpf },
      phone: {
        area_code: comprador.telefone.slice(0, 2),
        number: comprador.telefone.slice(2),
      },
      address: {
        zip_code: comprador.cep,
        street_name: comprador.logradouro,
        street_number: comprador.numero,
      },
    },
    shipments: {
      mode: "not_specified",
      cost: Number((frete.priceCents / 100).toFixed(2)),
      receiver_address: {
        zip_code: comprador.cep,
        street_name: comprador.logradouro,
        street_number: comprador.numero,
        city_name: comprador.cidade,
        state_name: comprador.uf,
      },
    },
    back_urls: {
      success: `${siteUrl}/checkout/retorno?status=aprovado&pedido=${externalReference}`,
      pending: `${siteUrl}/checkout/retorno?status=pendente&pedido=${externalReference}`,
      failure: `${siteUrl}/checkout/retorno?status=recusado&pedido=${externalReference}`,
    },
    auto_return: "approved",
    statement_descriptor: "NOBREDNA",
    external_reference: externalReference,
    metadata: {
      envio: `${frete.carrier} ${frete.service}`,
      prazo_dias: frete.days,
      destino: `${comprador.cidade}/${comprador.uf}`,
    },
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": externalReference,
      },
      body: JSON.stringify(preference),
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[checkout] Mercado Pago recusou a preferência", data);
      return NextResponse.json(
        { erro: "O pagamento não pôde ser aberto. Tente novamente." },
        { status: 502 },
      );
    }

    const checkoutUrl =
      process.env.NODE_ENV === "production" ? data.init_point : data.sandbox_init_point;

    return NextResponse.json({
      simulado: false,
      ...resumo,
      preferenceId: data.id,
      checkoutUrl: checkoutUrl ?? data.init_point,
    });
  } catch (error) {
    console.error("[checkout] falha ao criar preferência", error);
    return NextResponse.json(
      { erro: "O pagamento não pôde ser aberto. Tente novamente." },
      { status: 502 },
    );
  }
}
