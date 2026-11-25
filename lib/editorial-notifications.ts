import "server-only";
import {commerceClient} from "./store-commerce";
import {dedicatedProductionDatabase} from "./store-guard";
import {editorialEmailMessage,editorialEmailRetry} from "./editorial-email";
import type {LeadSource} from "./editorial-leads";

export function editorialEmailConfigured(){
 return dedicatedProductionDatabase(process.env)&&Boolean(process.env.SUPABASE_SECRET_KEY&&process.env.RESEND_API_KEY&&process.env.STORE_EMAIL_FROM);
}
export function editorialAdminAlertConfigured(){
 return editorialEmailConfigured()&&Boolean(process.env.NOBREDNA_NOTIFICATION_TO);
}

export async function sendEditorialNotifications(leadId:string){
 if(!editorialEmailConfigured())return;
 const db=commerceClient();
 const [leadResult,jobResult]=await Promise.all([
  db.from("editorial_leads").select("id,protocol,source,customer_name,email").eq("id",leadId).maybeSingle(),
  db.from("editorial_notifications").select("id,kind,status,attempts,recipient,first_attempt_at,next_attempt_at,updated_at").eq("lead_id",leadId).in("status",["pending","failed","sending"]),
 ]);
 const lead=leadResult.data;
 if(leadResult.error||jobResult.error||!lead){console.warn("editorial_email_queue_unavailable");return}
 for(const job of jobResult.data??[]){
  const now=Date.now();
  if(Date.parse(job.next_attempt_at)>now||job.status==="sending"&&now-Date.parse(job.updated_at)<5*60*1000)continue;
  const recipient=job.recipient??(job.kind==="receipt"?lead.email:process.env.NOBREDNA_NOTIFICATION_TO);
  if(!recipient||!/^\S+@\S+\.\S+$/.test(recipient)||recipient.endsWith(".invalid"))continue;
  if(!editorialEmailRetry(job.attempts,job.first_attempt_at,now)){
   await db.from("editorial_notifications").update({status:"review",failure_code:"retry_window_expired",updated_at:new Date(now).toISOString()}).eq("id",job.id).eq("updated_at",job.updated_at);
   continue;
  }
  const stamp=new Date(now).toISOString();
  const claim=await db.from("editorial_notifications").update({status:"sending",attempts:job.attempts+1,recipient,first_attempt_at:job.first_attempt_at??stamp,updated_at:stamp,failure_code:null}).eq("id",job.id).eq("status",job.status).eq("updated_at",job.updated_at).select("id").maybeSingle();
  if(claim.error||!claim.data)continue;
  const message=editorialEmailMessage({protocol:lead.protocol,source:lead.source as LeadSource,kind:job.kind==="receipt"?"receipt":"admin_alert",name:lead.customer_name});
  let failure="network_error",retryable=true;
  try{
   const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json","Idempotency-Key":`nobredna-editorial-${job.id}`},body:JSON.stringify({from:process.env.STORE_EMAIL_FROM,to:[recipient],...message,...(process.env.STORE_EMAIL_REPLY_TO?{reply_to:process.env.STORE_EMAIL_REPLY_TO}:{})}),signal:AbortSignal.timeout(10000)});
   if(result.ok){
    const data=await result.json();
    if(typeof data.id==="string"){await db.from("editorial_notifications").update({status:"sent",provider_id:data.id,updated_at:new Date().toISOString()}).eq("id",job.id).eq("updated_at",stamp);continue}
    failure="invalid_provider_response";
   }else{failure="provider_"+result.status;retryable=result.status===429||result.status>=500}
  }catch{/* Network/timeout is an ambiguous send; same idempotency key on retry. */}
  const delay=Math.min(60*60*1000,60000*2**job.attempts);
  await db.from("editorial_notifications").update({status:retryable?"failed":"review",failure_code:failure,next_attempt_at:new Date(Date.now()+delay).toISOString(),updated_at:new Date().toISOString()}).eq("id",job.id).eq("updated_at",stamp);
 }
}
