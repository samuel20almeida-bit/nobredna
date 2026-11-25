import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function storeConfig() {
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
  if (!membership.data) return { state: "denied" } as const;
  return { state: "admin", client, user } as const;
}
