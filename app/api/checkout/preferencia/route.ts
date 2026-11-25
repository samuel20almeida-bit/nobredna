import {NextResponse} from "next/server";
import {liveStoreEnabled} from "@/lib/store-public";
import {beginPayment,commerceClient,reserveOrder,validateCommercialCart,type OrderReservation} from "@/lib/store-commerce";
import {quoteShipping} from "@/lib/shipping";
import {allowStoreRequest} from "@/lib/store-rate-limit";
import { checkoutKeyPattern, confirmedTotal, parseBuyer, verifiedPaymentUrl, createPaymentPreference } from "@/lib/store-guard";

export const runtime="nodejs";
const reply=(erro:string,status:number)=>NextResponse.json({erro},{status});
export async function POST(request:Request){
 if(!liveStoreEnabled())return reply("A loja está em demonstração. Nenhuma cobrança pode ser realizada.",503);
 let body:Record<string,unknown>;try{body=await request.json();if(!body||typeof body!=="object"||Array.isArray(body))return reply("Requisição inválida.",400)}catch{return reply("Requisição inválida.",400)}
 const buyer=parseBuyer(body.comprador);
 if(!buyer||typeof body.checkoutKey!=="string"||!checkoutKeyPattern.test(body.checkoutKey)||typeof body.freteId!=="string"||body.freteId.length>80||!Number.isSafeInteger(body.totalCents))return reply("Confira os dados de entrega e o total do pedido.",422);
 let reservation:OrderReservation|undefined;
 try{
  if(!(await allowStoreRequest(request,"checkout")))return reply("Muitas tentativas de compra. Aguarde alguns minutos e tente novamente.",429);
  const cart=await validateCommercialCart(body.itens);if(!cart)return reply("Revise os itens e o estoque da sacola.",409);
  const quote=await quoteShipping(cart.shipping,buyer.cep);
  const shipping=quote.options.find(o=>o.id===body.freteId);
  if(quote.simulated||!shipping)return reply("A opção de entrega não está disponível. Calcule o frete novamente.",409);
  if(!confirmedTotal(cart.shipping.totalCents,shipping.priceCents,body.totalCents))return reply("Os valores mudaram. Atualize a sacola e recalcule o frete.",409);
  const {nome,email,...address}=buyer;
  reservation=await reserveOrder({checkoutKey:body.checkoutKey,buyerName:nome,buyerEmail:email,address,shippingService:`${shipping.carrier} · ${shipping.service}`,shippingCents:shipping.priceCents,cart});
  if(reservation.reservation_status!=="reserved"){
    // Recover the same checkout URL only for the exact canonical attempt.
    // store_reserve_order already checked that the buyer, cart and price match.
    const existing=await commerceClient().from("store_orders").select("checkout_url,payment_status,payment_review").eq("id",reservation.id).maybeSingle();
    const known=verifiedPaymentUrl(existing.data?.checkout_url);
    if(!existing.error&&known&&existing.data?.payment_status==="pending"&&!existing.data.payment_review)
      return NextResponse.json({referencia:reservation.reference,checkoutUrl:known,subtotalCents:reservation.subtotal_cents,freteCents:reservation.shipping_cents,totalCents:reservation.total_cents});
    return reply("Já existe uma tentativa para este pedido. Confira o pagamento antes de iniciar outra.",409);
  }
  if(!confirmedTotal(reservation.subtotal_cents,reservation.shipping_cents,body.totalCents))throw Error("reservation_total_changed");
  if(!(await beginPayment(reservation.id)))return reply("O pedido já está em processamento ou expirou.",409);
  const {id,url}=await createPaymentPreference({siteUrl:process.env.NEXT_PUBLIC_SITE_URL!,reference:reservation.reference,expiresAt:reservation.expires_at,buyerName:nome,buyerEmail:email,items:cart.items,shipping},process.env.MERCADOPAGO_ACCESS_TOKEN!,reservation.id);
  const saved=await commerceClient().from("store_orders").update({payment_preference_id:id,checkout_url:url,updated_at:new Date().toISOString()}).eq("id",reservation.id).eq("reservation_status","payment_started").select("id").single();
  if(saved.error||!saved.data)throw Error("preference_not_saved");
  return NextResponse.json({referencia:reservation.reference,checkoutUrl:url,subtotalCents:reservation.subtotal_cents,freteCents:reservation.shipping_cents,totalCents:reservation.total_cents});
 }catch{
  // Falha externa depois da transição: não liberar estoque enquanto o
  // provedor puder aceitar um pagamento. A equipe deverá conciliar.
  if(reservation)try{await commerceClient().from("store_orders").update({payment_review:true}).eq("id",reservation.id).eq("reservation_status","payment_started")}catch{}
  return reply(reservation?"O pedido precisa ser verificado. Não tente pagar novamente antes de falar com a Casa.":"Não foi possível finalizar o pedido. Revise o frete e a disponibilidade.",502);
 }
}
