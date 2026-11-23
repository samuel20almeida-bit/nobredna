import { NextResponse } from "next/server";

// A integração de captação será configurada após aprovação da editora.
export async function POST() {
  return NextResponse.json({ erro: "O contato está disponível pelo Instagram da Casa." }, { status: 503 });
}
