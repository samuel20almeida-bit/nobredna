import { NextResponse,after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { dedicatedProductionDatabase } from "@/lib/store-guard";
import { validateEditorialLead, leadProtocol } from "@/lib/editorial-leads";
import { sendEditorialNotifications,editorialEmailConfigured } from "@/lib/editorial-notifications";

export const runtime="nodejs";
export async function POST(request:Request){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,secret=process.env.NOBREDNA_CAPTURE_TOKEN;
  if(!dedicatedProductionDatabase(process.env)||!url||!key||!secret)return NextResponse.json({erro:"A captação está em configuração. Tente novamente em breve."},{status:503});
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin&&origin!==process.env.NEXT_PUBLIC_SITE_URL)return NextResponse.json({erro:"Origem não autorizada."},{status:403});
  let raw:unknown;
  try{const body=await request.text();if(Buffer.byteLength(body)>12000)throw Error();raw=JSON.parse(body)}catch{return NextResponse.json({erro:"Solicitação inválida."},{status:400})}
  const lead=validateEditorialLead(raw);
  if(!lead)return NextResponse.json({erro:"Confira o nome, o contato e as informações do formulário."},{status:422});
  const forwarded=request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()??"";
  const rateKey=createHmac("sha256",secret).update(isIP(forwarded)?forwarded:"unidentified").digest("hex");
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{"x-nobredna-capture":secret,"x-nobredna-rate-key":rateKey}}});
  const result=await db.from("editorial_leads").insert(lead);
  if(result.error&&result.error.code!=="23505"){
    if(result.error.message.includes("capture_rate_limited"))return NextResponse.json({erro:"Muitas solicitações. Aguarde alguns minutos e tente novamente."},{status:429});
    return NextResponse.json({erro:"Não foi possível registrar a solicitação. Tente novamente."},{status:503});
  }
  if(!result.error&&editorialEmailConfigured())after(()=>sendEditorialNotifications(lead.id).catch(()=>console.warn("editorial_email_processing_failed")));
  return NextResponse.json({ok:true,protocolo:leadProtocol(lead.id)},{status:201,headers:{"Cache-Control":"no-store"}});
}
