export const adminOperations = ["signIn", "requestEmailAccess", "verifyEmailAccess", "signOut", "updateEditorialLead", "updatePostSale", "updateSupportNumber", "retryEditorialEmails", "updateAdminPassword", "saveProduct", "updateFulfillment", "retryNotifications", "reviewExpiredReservations"] as const;
export type AdminOperation = typeof adminOperations[number];

export function isAdminOperation(value: unknown): value is AdminOperation {
  return typeof value === "string" && (adminOperations as readonly string[]).includes(value);
}

export function validAdminDestination(value: unknown): value is string {
  return typeof value === "string" && /^\/admin(?:\?[^\r\n#]*|)$/.test(value);
}

export function sameOriginAdminRequest(origin: string | null, requestUrl: string, host?: string | null, forwardedProto?: string | null): boolean {
  if (!origin) return false;
  try {
    const url = new URL(requestUrl);
    // Next may normalize the request URL to localhost behind a proxy. Host
    // is the browser-facing authority; never accept an arbitrary Origin.
    if (host) {
      if (!/^[a-z0-9.:[\]-]+$/i.test(host)) return false;
      const protocol = forwardedProto === "https" || forwardedProto === "http" ? forwardedProto : url.protocol.slice(0, -1);
      return origin === new URL(`${protocol}://${host}`).origin;
    }
    return origin === url.origin;
  } catch { return false; }
}
