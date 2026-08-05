import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    return NextResponse.json(
      { erro: "Confira o endereço de e-mail." },
      { status: 422 },
    );
  }

  // Ponto de integração com o provedor de e-mail da casa (Resend, Mailchimp,
  // Brevo…). Enquanto não houver credencial configurada, a assinatura é apenas
  // registrada no log do servidor — nenhum dado sai daqui.
  console.info("[carta] nova assinatura", email.trim().toLowerCase());

  return NextResponse.json({ ok: true });
}
