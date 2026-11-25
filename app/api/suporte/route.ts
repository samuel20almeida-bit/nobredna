import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {dedicatedProductionDatabase} from "@/lib/store-guard";
import {normalizeWhatsApp} from "@/lib/editorial-workspace";

export const dynamic="force-dynamic";
export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key||!dedicatedProductionDatabase(process.env))return NextResponse.json({whatsapp:null},{headers:{"Cache-Control":"no-store"}});
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.from("editorial_support_settings").select("editorial_whatsapp").eq("singleton",true).maybeSingle();
 return NextResponse.json({whatsapp:!error&&data?.editorial_whatsapp?normalizeWhatsApp(data.editorial_whatsapp):null},{headers:{"Cache-Control":error?"no-store":"public, max-age=30, s-maxage=60"}});
}
