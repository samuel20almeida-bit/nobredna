import { test } from "node:test";
import assert from "node:assert/strict";
import { configuredProductionStore, productionOrderProcessing, parseBuyer, confirmedTotal, verifiedPaymentUrl, paymentSnapshot, checkoutKeyPattern, buildPaymentPreference, createPaymentPreference } from "../lib/store-guard.ts";

const config = {
  VERCEL_ENV:"production",ENABLE_LIVE_CHECKOUT:"true",MERCADOPAGO_MODE:"production",
  MELHOR_ENVIO_BASE_URL:"https://melhorenvio.com.br",ORIGEM_CEP:"80010001",NEXT_PUBLIC_SITE_URL:"https://nobredna.example",
  NEXT_PUBLIC_SUPABASE_URL:"https://rxhmkyrputgzusbobegt.supabase.co",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"fixture",
  SUPABASE_SECRET_KEY:"fixture",MERCADOPAGO_ACCESS_TOKEN:"fixture",MERCADOPAGO_WEBHOOK_SECRET:"fixture",
  MELHOR_ENVIO_TOKEN:"fixture",MELHOR_ENVIO_USER_AGENT:"Fixture test",STORE_RATE_LIMIT_SECRET:"fixture",
  RESEND_API_KEY:"fixture",STORE_EMAIL_FROM:"teste@example.invalid"
};
test("live checkout is closed by default and always closed in preview",()=>{
  assert.equal(configuredProductionStore({}),false);
  assert.equal(configuredProductionStore({...config,ENABLE_LIVE_CHECKOUT:"false"}),false);
  assert.equal(configuredProductionStore({...config,VERCEL_ENV:"preview"}),false);
  assert.equal(configuredProductionStore({...config,VERCEL_ENV:undefined}),false);
  assert.equal(configuredProductionStore({...config,NEXT_PUBLIC_SUPABASE_URL:"https://other-client.supabase.co"}),false);
  assert.equal(configuredProductionStore({...config,MERCADOPAGO_MODE:"sandbox"}),false);
  assert.equal(configuredProductionStore({...config,MELHOR_ENVIO_BASE_URL:"https://sandbox.melhorenvio.com.br"}),false);
  assert.equal(configuredProductionStore({...config,ORIGEM_CEP:""}),false);
  assert.equal(configuredProductionStore({...config,RESEND_API_KEY:""}),false);
  assert.equal(configuredProductionStore({...config,NEXT_PUBLIC_SITE_URL:"http://localhost:3000"}),false);
  assert.equal(configuredProductionStore(config),true);
  assert.equal(productionOrderProcessing({...config,VERCEL_ENV:"preview"}),false);
});
test("buyer input is normalized and rejects missing or invalid address data",()=>{
  const buyer={nome:" Pessoa Teste ",email:"TESTE@EXAMPLE.INVALID",telefone:"(41) 99999-9999",cep:"80010-001",logradouro:"Rua teste",numero:"20",bairro:"Centro",cidade:"Curitiba",uf:"pr"};
  assert.equal(parseBuyer(buyer)?.email,"teste@example.invalid");
  assert.equal(parseBuyer(buyer)?.cep,"80010001");
  assert.equal(parseBuyer(buyer)?.uf,"PR");
  assert.equal(parseBuyer({...buyer,uf:"XX"}),null);
  assert.equal(parseBuyer({...buyer,telefone:"123"}),null);
  assert.equal(parseBuyer({...buyer,numero:""}),null);
});
test("total must exactly match authoritative subtotal plus shipping",()=>{
  assert.equal(confirmedTotal(4990,1300,6290),true);
  assert.equal(confirmedTotal(4990,1300,1),false);
  assert.equal(confirmedTotal(4990,-1,4989),false);
  assert.equal(confirmedTotal(4990.5,1300,6290.5),false);
  assert.equal(checkoutKeyPattern.test(crypto.randomUUID()),true);
});
test("payment links only use the approved HTTPS payment domain",()=>{
  assert.equal(verifiedPaymentUrl("https://www.mercadopago.com.br/checkout?pref_id=fixture"),"https://www.mercadopago.com.br/checkout?pref_id=fixture");
  assert.equal(verifiedPaymentUrl("http://www.mercadopago.com.br/checkout"),null);
  assert.equal(verifiedPaymentUrl("https://mercadopago.com.br.example.invalid/checkout"),null);
  assert.equal(verifiedPaymentUrl("https://user:pass@mercadopago.com.br/checkout"),null);
});
test("mock payment snapshot only accepts authoritative matching live payment data",()=>{
  const payment={id:123,live_mode:true,external_reference:"NDNA-"+"A".repeat(32),status:"approved",date_last_updated:"2026-11-25T00:00:00Z",transaction_amount:62.90,transaction_amount_refunded:0,currency_id:"BRL"};
  const snapshot=paymentSnapshot(payment,"123");
  assert.equal(snapshot?.amount,6290);
  assert.equal(snapshot?.event,"123:approved:2026-11-25T00:00:00Z");
  assert.equal(paymentSnapshot({...payment,live_mode:false},"123"),null);
  assert.equal(paymentSnapshot({...payment,external_reference:"fake"},"123"),null);
  assert.equal(paymentSnapshot({...payment,transaction_amount:-1},"123"),null);
  assert.equal(paymentSnapshot(payment,"456"),null);
});
test("mock provider receives server-priced items, shipping, same order reference and idempotency",async()=>{
  const request={siteUrl:"https://nobredna.example",reference:"NDNA-"+"A".repeat(32),
    expiresAt:"2027-01-01T00:30:00Z",buyerName:"Fixture",buyerEmail:"fixture@example.invalid",
    items:[{product_id:"fixture-book",title:"Livro",quantity:2,unit_price_cents:4990}],
    shipping:{carrier:"Teste",service:"Econômico",priceCents:1500}};
  const preference=buildPaymentPreference(request,new Date("2027-01-01T00:00:00Z"));
  assert.equal(preference.items.reduce((sum,item)=>sum+item.quantity*item.unit_price,0).toFixed(2),"114.80");
  assert.equal(preference.back_urls.success,preference.back_urls.failure);
  assert.equal(preference.external_reference,request.reference);
  let calls=0;
  const mock=async(url,options)=>{
    calls++;
    assert.equal(url,"https://api.mercadopago.com/checkout/preferences");
    assert.equal(options.headers["X-Idempotency-Key"],"fixture-order");
    assert.equal(JSON.parse(options.body).external_reference,request.reference);
    return Response.json({id:"fixture-preference",init_point:"https://www.mercadopago.com.br/checkout?pref_id=fixture"});
  };
  assert.equal((await createPaymentPreference(request,"fixture-token","fixture-order",mock)).id,"fixture-preference");
  assert.equal(calls,1);
  await assert.rejects(createPaymentPreference(request,"fixture-token","fixture-order",async()=>new Response("",{status:502})),/preference_not_created/);
  await assert.rejects(createPaymentPreference(request,"fixture-token","fixture-order",async()=>Response.json({id:"fixture",init_point:"https://example.invalid"})),/invalid_preference_response/);
});
