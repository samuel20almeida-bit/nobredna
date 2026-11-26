import { NextResponse } from "next/server";
import * as mutations from "@/lib/admin-mutations";
import { isAdminOperation, sameOriginAdminRequest, validAdminDestination, type AdminOperation } from "@/lib/admin-form-contract";

export const dynamic = "force-dynamic";
const headers = {"Cache-Control": "private, no-store"};
const handlers: Record<AdminOperation, (form: FormData) => Promise<unknown>> = {
  signIn: mutations.signIn,
  requestEmailAccess: mutations.requestEmailAccess,
  verifyEmailAccess: mutations.verifyEmailAccess,
  signOut: mutations.signOut,
  updateEditorialLead: mutations.updateEditorialLead,
  updatePostSale: mutations.updatePostSale,
  updateSupportNumber: mutations.updateSupportNumber,
  retryEditorialEmails: mutations.retryEditorialEmails,
  updateAdminPassword: mutations.updateAdminPassword,
  saveProduct: mutations.saveProduct,
  updateFulfillment: mutations.updateFulfillment,
  retryNotifications: mutations.retryNotifications,
  reviewExpiredReservations: mutations.reviewExpiredReservations,
};

export async function POST(request: Request) {
  const started = performance.now();
  const json = request.headers.get("accept")?.includes("application/json");
  const error = (status: number) => NextResponse.json({ok: false}, {status, headers});
  // Unlike Server Actions, a custom Route Handler must check its own origin.
  if (!sameOriginAdminRequest(request.headers.get("origin"), request.url, request.headers.get("host"), request.headers.get("x-forwarded-proto"))) return error(403);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data") && !contentType.startsWith("application/x-www-form-urlencoded")) return error(415);
  const length = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isFinite(length) || length > 128 * 1024) return error(413);
  let form: FormData;
  try { form = await request.formData(); } catch { return error(400); }
  const operation = form.get("_operation");
  if (!isAdminOperation(operation)) return error(400);
  try {
    await handlers[operation](form);
    return error(500); // every operation must report its outcome explicitly
  } catch (exception) {
    if (exception instanceof mutations.AdminMutationOutcome && validAdminDestination(exception.location)) {
      console.info("[admin-mutation] operation="+operation+" elapsed_ms="+Math.round(performance.now()-started));
      if (json) return NextResponse.json({ok: true, location: exception.location}, {headers});
      return new NextResponse(null, {status: 303, headers: {...headers, Location: exception.location}});
    }
    console.error("[admin-mutation] operation="+operation+" unexpected_error");
    return error(500);
  }
}
