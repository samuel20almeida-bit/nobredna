import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { dedicatedProductionDatabase } from "@/lib/store-guard";

export async function middleware(request: NextRequest) {
  const started=performance.now();
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (dedicatedProductionDatabase(process.env) && url && key) {
    const client = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
      cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" },
    });
    // Refresh cookies and verify the JWT using Supabase SSR's recommended
    // claims verification; asymmetric keys avoid a second Auth HTTP roundtrip.
    // The page/action still performs fresh getUser + membership verification.
    await client.auth.getClaims();
    console.info("[admin-perf] middleware_ms="+Math.round(performance.now()-started));
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
