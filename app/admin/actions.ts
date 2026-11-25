"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStoreAccess, storeClient } from "@/lib/store-admin";
import { sendOrderNotifications } from "@/lib/store-notifications";
import { releaseExpiredReservations } from "@/lib/store-commerce";
import { leadStatuses, type LeadStatus } from "@/lib/editorial-leads";

function back(message: string): never { redirect(`/admin?mensagem=${encodeURIComponent(message)}`); }

export async function signIn(form: FormData) {
  const client = await storeClient();
  if (!client) back("not-configured");
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 1024) back("login-error");
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) back("login-error");
  redirect("/admin");
}

export async function requestEmailAccess(form:FormData){
  const client=await storeClient();
  if(!client)back("not-configured");
  const email=String(form.get("email")??"").trim().toLowerCase();
  if(!process.env.NOBREDNA_ADMIN_EMAIL||email!==process.env.NOBREDNA_ADMIN_EMAIL.trim().toLowerCase())back("email-access-error");
  const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:"https://nobredna.vercel.app/auth/callback"}});
  if(error)back("email-access-error");
  back("email-sent");
}

export async function verifyEmailAccess(form:FormData){
  const client=await storeClient();
  if(!client)back("not-configured");
  const email=String(form.get("email")??"").trim().toLowerCase(),token=String(form.get("token")??"").trim();
  if(email!==process.env.NOBREDNA_ADMIN_EMAIL?.trim().toLowerCase()||!/^\d{6}$/.test(token))back("email-access-error");
  const {error}=await client.auth.verifyOtp({email,token,type:"email"});
  if(error)back("email-access-error");
  redirect("/admin");
}

export async function updateEditorialLead(form:FormData){
  const access=await getStoreAccess();
  if(access.state!=="admin")back("denied");
  const id=field(form,"id",36),status=field(form,"status",20);
  if(!/^[0-9a-f-]{36}$/i.test(id)||!leadStatuses.includes(status as LeadStatus))back("lead-error");
  const result=await access.client.from("editorial_leads").update({status,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();
  if(result.error||!result.data)back("lead-error");
  revalidatePath("/admin");redirect("/admin?mensagem=lead-saved#captacoes");
}

export async function signOut() {
  const client = await storeClient();
  if (client) await client.auth.signOut({ scope: "local" });
  redirect("/admin");
}

function field(form: FormData, name: string, max = 200) {
  const value = form.get(name);
  return typeof value === "string" && value.trim().length <= max ? value.trim() : "";
}

function integer(form: FormData, name: string, minimum: number, maximum: number, scale = 1) {
  const value = field(form, name, 20);
  if (!value) return null;
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) back("invalid-product");
  const number = Math.round(Number(value.replace(",", ".")) * scale);
  if (number < minimum || number > maximum || (scale === 1 && !/^\d+$/.test(value))) back("invalid-product");
  return number;
}

export async function saveProduct(form: FormData) {
  const access = await getStoreAccess();
  if (access.state !== "admin") back("denied");
  const id = field(form, "id", 36);
  const version = field(form, "version", 80);
  const title = field(form, "title");
  const author = field(form, "author");
  const slug = field(form, "slug", 120);
  const status = field(form, "status", 20);
  const description = field(form, "description", 10000);
  const cover_url = field(form, "cover_url", 2000) || null;
  if (!title || !author || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !["draft", "active", "archived"].includes(status)) back("invalid-product");
  if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) back("invalid-product");
  if (id && (!version || !Number.isFinite(Date.parse(version)))) back("stale-product");
  if (cover_url && !(/^https:\/\//i.test(cover_url) || /^\/(?!\/)[a-z0-9/_\-.]+$/i.test(cover_url))) back("invalid-product");
  const product = {
    title, author, slug, status, description, cover_url, published: status === "active" && form.get("published") === "on",
    isbn: field(form, "isbn", 30) || null,
    price_cents: integer(form, "price", 1, 10000000, 100),
    stock: integer(form, "stock", 0, 1000000) ?? 0,
    weight_g: integer(form, "weight_g", 1, 100000),
    width_mm: integer(form, "width_mm", 1, 2000),
    height_mm: integer(form, "height_mm", 1, 2000),
    length_mm: integer(form, "length_mm", 1, 2000),
    updated_at: new Date().toISOString(),
  };
  if (status === "active" && (!description || !cover_url || !product.price_cents || !product.weight_g || !product.width_mm || !product.height_mm || !product.length_mm)) back("incomplete-product");
  const result = id
    ? await access.client.from("store_products").update(product).eq("id", id).eq("updated_at", version).select("id").maybeSingle()
    : await access.client.from("store_products").insert(product).select("id").single();
  if (result.error || !result.data) back(result.error?.code === "23505" ? "duplicate-product" : !result.error && id ? "stale-product" : "save-error");
  revalidatePath("/admin");
  revalidatePath("/livros");
  back("saved");
}

export async function updateFulfillment(form:FormData){
 const access=await getStoreAccess();if(access.state!=="admin")back("denied");
 const reference=field(form,"reference",40),tracking=field(form,"tracking",80),status=field(form,"fulfillment",24);
 if(!/^NDNA-[0-9A-F]{32}$/.test(reference)||!["shipped","delivered"].includes(status)||status==="shipped"&&!/^[A-Za-z0-9_-]{4,80}$/.test(tracking))back("invalid-shipping");
 const update=status==="shipped"?{fulfillment_status:status,tracking_code:tracking,updated_at:new Date().toISOString()}:{fulfillment_status:status,updated_at:new Date().toISOString()};
 const result=await access.client.from("store_orders").update(update).eq("reference",reference).eq("payment_status","paid").eq("payment_review",false).eq("fulfillment_status",status==="shipped"?"preparing":"shipped").select("reference").maybeSingle();
 if(result.error||!result.data)back("shipping-error");
 if(status==="shipped")await sendOrderNotifications(reference).catch(()=>{});
 revalidatePath("/admin");back("shipping-saved");
}

export async function retryNotifications(form:FormData){
 const access=await getStoreAccess();if(access.state!=="admin")back("denied");
 const ref=field(form,"reference",40);if(!/^NDNA-[0-9A-F]{32}$/.test(ref))back("shipping-error");
 const order=await access.client.from("store_orders").select("reference").eq("reference",ref).maybeSingle();if(!order.data)back("shipping-error");
 await sendOrderNotifications(ref).catch(()=>{});revalidatePath("/admin");back("notification-attempt");
}

export async function reviewExpiredReservations() {
  const access = await getStoreAccess();
  if (access.state !== "admin") back("denied");
  let result: Awaited<ReturnType<typeof releaseExpiredReservations>>;
  try { result = await releaseExpiredReservations(); } catch { back("maintenance-error"); }
  revalidatePath("/admin");
  redirect(`/admin?mensagem=maintenance-saved&liberadas=${result!.released}&revisao=${result!.awaiting_reconciliation}`);
}
