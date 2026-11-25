import {NextResponse} from "next/server";
import {WebhookSignatureValidator} from "mercadopago";
import {commerceClient} from "@/lib/store-commerce";
import {sendOrderNotifications} from "@/lib/store-notifications";
import {after} from "next/server";
import { paymentSnapshot, productionOrderProcessing } from "@/lib/store-guard";

export const runtime="nodejs";
export async function POST(request:Request){
 const secret=process.env.MERCADOPAGO_WEBHOOK_SECRET,token=process.env.MERCADOPAGO_ACCESS_TOKEN;
 if(!productionOrderProcessing(process.env)||!secret||!token||!process.env.SUPABASE_SECRET_KEY)return NextResponse.json({ok:false},{status:503});
 const url=new URL(request.url),paymentId=url.searchParams.get("data.id"),topic=url.searchParams.get("type");
 if(topic!=="payment"||!paymentId||!/^[0-9]{1,24}$/.test(paymentId))return NextResponse.json({ok:false},{status:400});
 try{WebhookSignatureValidator.validate({xSignature:request.headers.get("x-signature")??"",xRequestId:request.headers.get("x-request-id")??"",dataId:paymentId,secret})}catch{return NextResponse.json({ok:false},{status:401})}
 try{
  const response=await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error("payment_lookup_failed");
  const p=paymentSnapshot(await response.json(),paymentId);
  if(!p)return NextResponse.json({ok:true});
  const result=await commerceClient().rpc("store_reconcile_payment",{p_reference:p.reference,p_event_id:p.event,p_payment_id:paymentId,p_status:p.status,p_amount_cents:p.amount,p_currency:p.currency,p_refunded_cents:p.refunded});
  if(result.error)throw Error("reconciliation_failed");
  if(result.data==="paid"||result.data==="duplicate")after(()=>sendOrderNotifications(p.reference).catch(()=>{}));
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({ok:false},{status:502})}
}
