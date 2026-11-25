import { NextResponse } from "next/server";
import { storeClient } from "@/lib/store-admin";

export const dynamic="force-dynamic";
export async function GET(request:Request){
  const url=new URL(request.url),code=url.searchParams.get("code"),tokenHash=url.searchParams.get("token_hash");
  const client=await storeClient();
  if(client){
    const result=code?await client.auth.exchangeCodeForSession(code):tokenHash?await client.auth.verifyOtp({token_hash:tokenHash,type:"email"}):null;
    if(result&&!result.error)return NextResponse.redirect(new URL("/admin",url.origin));
  }
  return NextResponse.redirect(new URL("/admin?mensagem=email-access-error",url.origin));
}
