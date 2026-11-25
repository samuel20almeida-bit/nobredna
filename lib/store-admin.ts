import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { dedicatedProductionDatabase } from "./store-guard";

export function storeConfig() {
  // A preview never uses a live database, even if Vercel inherits credentials.
  if (!dedicatedProductionDatabase(process.env)) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export async function storeClient() {
  const config = storeConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Middleware refreshes cookies for Server Components. */ }
      },
    },
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" },
  });
}

export async function getStoreAccess() {
  const client = await storeClient();
  if (!client) return { state: "unconfigured" } as const;
  const { data: { user }, error } = await client.auth.getUser();
  if (!user || error) return { state: "signed-out" } as const;
  const membership = await client.from("store_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (membership.error) return { state: "unavailable" } as const;
  if (!membership.data) {
    // Database policy verifies the preauthorized email and email-OTP session.
    const claimed = await client.from("store_admins").insert({user_id:user.id}).select("user_id").maybeSingle();
    if(claimed.error||!claimed.data)return {state:"denied"} as const;
  }
  return { state: "admin", client, user } as const;
}
