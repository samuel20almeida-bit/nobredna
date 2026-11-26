import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {createHmac} from "node:crypto";
import {isIP} from "node:net";
import {dedicatedProductionDatabase} from "@/lib/store-guard";
import {supportProtocol,validateSupportRequest} from "@/lib/post-sale";

export const runtime="nodejs";
const reply=(body:object,status:number)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request){
  const {NEXT_PUBLIC_SUPABASE_URL:url,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:key,NOBREDNA_CAPTURE_TOKEN:secret}=process.env;
  if(!dedicatedProductionDatabase(process.env)||!url||!key||!secret)return reply({erro:"O atendimento online está temporariamente indisponível. Use os contatos oficiais informados na página."},503);
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin&&origin!==process.env.NEXT_PUBLIC_SITE_URL)return reply({erro:"Origem não autorizada."},403);
  let parsed:unknown;
  try{
    const body=await request.text();
    if(Buffer.byteLength(body)>12000)throw Error();
    parsed=JSON.parse(body);
  }catch{return reply({erro:"Solicitação inválida."},400)}
  const data=validateSupportRequest(parsed);
  if(!data)return reply({erro:"Confira os dados e tente novamente."},422);
  const forwarded=request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()??"";
  const rateKey=createHmac("sha256",secret).update(isIP(forwarded)?forwarded:"unidentified").digest("hex");
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{"x-nobredna-capture":secret,"x-nobredna-rate-key":rateKey}}});
  const {error}=await client.from("store_support_requests").insert(data);
  if(error&&error.code!=="23505")return error.message.includes("capture_rate_limited")?reply({erro:"Muitas solicitações. Aguarde alguns minutos ou fale com a editora."},429):reply({erro:"Não foi possível registrar sua solicitação. Tente novamente ou fale com a editora."},503);
  return reply({ok:true,protocolo:supportProtocol(data.id)},201);
}
