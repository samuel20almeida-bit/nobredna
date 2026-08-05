import { NextResponse } from "next/server";
import { isValidCEP, normalizeCart, quoteShipping } from "@/lib/shipping";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { cep?: unknown; itens?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const cep = String(body.cep ?? "").replace(/\D/g, "");
  if (!isValidCEP(cep)) {
    return NextResponse.json(
      { erro: "Informe um CEP com 8 dígitos." },
      { status: 422 },
    );
  }

  const cart = normalizeCart(body.itens);
  if (!cart) {
    return NextResponse.json(
      { erro: "Não foi possível ler os itens da sacola." },
      { status: 422 },
    );
  }

  try {
    const quote = await quoteShipping(cart, cep);
    if (quote.options.length === 0) {
      return NextResponse.json(
        { erro: "Nenhuma transportadora atende este CEP no momento." },
        { status: 422 },
      );
    }
    return NextResponse.json(quote);
  } catch (error) {
    console.error("[frete] falha na cotação", error);
    return NextResponse.json(
      { erro: "Não foi possível calcular o frete agora. Tente novamente." },
      { status: 502 },
    );
  }
}
