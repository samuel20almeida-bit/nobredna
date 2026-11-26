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
  const started=performance.now();
  const client = await storeClient();
  if (!client) return { state: "unconfigured" } as const;
  // The raw session is read only to pass the token to the authoritative Auth
  // lookup. Never authorize using session.user or unverified claims. Explicit
  // getUser(token) avoids holding the session lock during the network request.
  const session=await client.auth.getSession();
  const token=session.data.session?.access_token;
  if(session.error||!token)return {state:"signed-out"} as const;
  const [identity,membership]=await Promise.all([
    client.auth.getUser(token),
    // RLS returns only the caller's own membership. Compare it to the freshly
    // verified server-side user before granting access.
    client.from("store_admins").select("user_id").maybeSingle(),
  ]);
  const {data:{user},error}=identity;
  if (!user || error) return { state: "signed-out" } as const;
  if (membership.error) return { state: "unavailable" } as const;
  if(membership.data&&membership.data.user_id!==user.id)return {state:"denied"} as const;
  if (!membership.data) {
    // Database policy verifies the preauthorized email and email-OTP session.
    const claimed = await client.from("store_admins").insert({user_id:user.id}).select("user_id").maybeSingle();
    if(claimed.error||!claimed.data)return {state:"denied"} as const;
  }
  console.info("[admin-perf] access_ms="+Math.round(performance.now()-started));
  return { state: "admin", client, user } as const;
}
