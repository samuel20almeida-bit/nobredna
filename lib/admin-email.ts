/** Exact allowlist for initiating authentication. The database still enforces
 * verified email, verified session and admin membership independently. */
export function isAllowedAdminEmail(email:string, env:NodeJS.ProcessEnv):boolean {
  const normalized=email.trim().toLowerCase();
  if(!normalized)return false;
  const addresses=[env.NOBREDNA_ADMIN_EMAIL??"",env.NOBREDNA_ADMIN_EMAILS??""]
    .flatMap(value=>value.split(",")).map(value=>value.trim().toLowerCase()).filter(Boolean);
  return addresses.includes(normalized);
}
