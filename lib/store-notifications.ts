import "server-only";
import {commerceClient} from "@/lib/store-commerce";
import {formatBRL} from "@/lib/format";
import { productionOrderProcessing } from "@/lib/store-guard";

// Outbox durável: a confirmação ocorre no banco antes de qualquer e-mail.
export async function sendOrderNotifications(reference:string){
 const key=process.env.RESEND_API_KEY,from=process.env.STORE_EMAIL_FROM;
 if(!productionOrderProcessing(process.env)||!key||!from||!process.env.SUPABASE_SECRET_KEY)return;
 const db=commerceClient();
 const {data:order,error}=await db.from("store_orders").select("id,reference,customer_name,customer_email,subtotal_cents,shipping_cents,total_cents,shipping_service,tracking_code,payment_status,payment_review,fulfillment_status,store_order_items(title_snapshot,quantity,unit_price_cents)").eq("reference",reference).maybeSingle();
 if(error||!order)return;
 const {data:jobs}=await db.from("store_notifications").select("id,kind,status,attempts,first_attempt_at,updated_at").eq("order_id",order.id).in("status",["pending","failed","sending"]).order("created_at");
 for(const job of jobs??[]){
  if(job.attempts>=5||job.first_attempt_at&&Date.now()-Date.parse(job.first_attempt_at)>22*3600*1000)continue;
  if(job.status==="sending"&&Date.now()-Date.parse(job.updated_at)<5*60*1000)continue;
  if(order.payment_status!=="paid"||order.payment_review||job.kind==="shipped"&&!["shipped","delivered"].includes(order.fulfillment_status))continue;
  const now=new Date().toISOString();
  const claim=await db.from("store_notifications").update({status:"sending",attempts:job.attempts+1,first_attempt_at:job.first_attempt_at??now,updated_at:now}).eq("id",job.id).eq("status",job.status).eq("updated_at",job.updated_at).select("id").maybeSingle();
  if(claim.error||!claim.data)continue;
  const paid=job.kind==="payment_confirmed";
  const lines=(order.store_order_items??[]).map(i=>`${i.quantity} × ${i.title_snapshot} — ${formatBRL(i.unit_price_cents*i.quantity)}`).join("\n");
  const text=paid?`Olá, ${order.customer_name}!\n\nA Casa recebeu a confirmação do pagamento do seu pedido ${order.reference}.\n\n${lines}\n\nSubtotal: ${formatBRL(order.subtotal_cents)}\nFrete (${order.shipping_service}): ${formatBRL(order.shipping_cents)}\nTotal: ${formatBRL(order.total_cents)}\n\nO pedido está em preparação. Enviaremos o código de rastreamento assim que ele for despachado.\n\nNobreDNA · Casa de Legados`:`Olá, ${order.customer_name}!\n\nSeu pedido ${order.reference} foi enviado.\nTransportadora/serviço: ${order.shipping_service}\nCódigo de rastreamento: ${order.tracking_code}\n\nConsulte o código junto à transportadora.\n\nNobreDNA · Casa de Legados`;
  try{
   const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json","Idempotency-Key":`nobredna-${job.id}`},body:JSON.stringify({from,to:[order.customer_email],subject:`${paid?"Compra confirmada":"Pedido enviado"} · NobreDNA · ${order.reference.slice(-8)}`,text,...(process.env.STORE_EMAIL_REPLY_TO?{reply_to:process.env.STORE_EMAIL_REPLY_TO}:{})}),signal:AbortSignal.timeout(7000)});
   if(!result.ok)throw Error("mail_not_accepted");const data=await result.json();if(typeof data.id!=="string")throw Error("invalid_mail_response");
   await db.from("store_notifications").update({status:"sent",provider_id:data.id,updated_at:new Date().toISOString()}).eq("id",job.id);
  }catch{await db.from("store_notifications").update({status:"failed",updated_at:new Date().toISOString()}).eq("id",job.id)}
 }
}
