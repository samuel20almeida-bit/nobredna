import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { StoreBook } from "./store-types";
import { configuredProductionStore } from "./store-guard";

export function liveStoreEnabled() {
  return configuredProductionStore(process.env);
}

export async function publicCatalog(): Promise<StoreBook[]> {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) throw new Error("Catálogo não configurado");
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:"no-store"})}});
  const {data,error}=await db.from("store_products").select("slug,title,author,description,isbn,cover_url,price_cents,stock").eq("published",true).eq("status","active").order("title").limit(100);
  if(error)throw new Error("Não foi possível consultar a livraria");
  return (data??[]).map(b=>({...b,stock:Math.min(b.stock,12)})) as StoreBook[];
}
