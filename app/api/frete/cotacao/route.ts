import { NextResponse } from "next/server";
import { isValidCEP, quoteShipping } from "@/lib/shipping";
import { validateCommercialCart } from "@/lib/store-commerce";
import { liveStoreEnabled } from "@/lib/store-public";
import { allowStoreRequest } from "@/lib/store-rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if(!liveStoreEnabled())return NextResponse.json({erro:"A compra online ainda não está disponível."},{status:503});
  let body: { cep?: unknown; itens?: unknown };
  try {
    body = await request.json();
    if(!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid_body");
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const cep = typeof body.cep === "string" ? body.cep.replace(/\D/g, "") : "";
  if (!isValidCEP(cep)) {
    return NextResponse.json(
      { erro: "Informe um CEP com 8 dígitos." },
      { status: 422 },
    );
  }

  try {
    if(!(await allowStoreRequest(request,"quote")))return NextResponse.json({erro:"Muitas consultas. Aguarde alguns minutos e tente novamente."},{status:429});
    const cart=await validateCommercialCart(body.itens);
    if(!cart)return NextResponse.json({erro:"Revise o estoque e os itens da sacola."},{status:422});
    const quote = await quoteShipping(cart.shipping, cep);
    if (quote.simulated || quote.options.length === 0) {
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
