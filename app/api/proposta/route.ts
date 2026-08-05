import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function protocolo(): string {
  const ano = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MS-${ano}-${rand}`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const nome = String(body.nome ?? "").trim();
  const email = String(body.email ?? "").trim();
  const titulo = String(body.titulo ?? "").trim();
  const sinopse = String(body.sinopse ?? "").trim();

  if (!nome || !titulo) {
    return NextResponse.json(
      { erro: "Preencha o nome e o título provisório." },
      { status: 422 },
    );
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { erro: "Confira o endereço de e-mail." },
      { status: 422 },
    );
  }
  if (sinopse.length < 40 || sinopse.length > 800) {
    return NextResponse.json(
      { erro: "A sinopse precisa ter entre 40 e 800 caracteres." },
      { status: 422 },
    );
  }

  // Ponto de integração com o fluxo editorial (e-mail do conselho, CRM ou
  // planilha de leitura). Sem provedor configurado, fica registrado no log.
  const numero = protocolo();
  console.info("[proposta] nova submissão", { numero, titulo, email });

  return NextResponse.json({ ok: true, protocolo: numero });
}
