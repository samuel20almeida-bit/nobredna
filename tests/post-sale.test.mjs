import {test} from "node:test";
import assert from "node:assert/strict";
import {validateSupportRequest,supportProtocol,supportDeadlineLabel} from "../lib/post-sale.ts";

const id="f4c77eb0-b65d-4baf-9fce-6a4b10ca6ba9";
const sample={requestId:id,category:"withdrawal",nome:" Cliente Teste ",email:"TESTE@EXAMPLE.INVALID",telefone:"",pedido:"",livro:"",descricao:"",consentimento:true,website:""};
test("A withdrawal request does not require a reason, book title or order number",()=>{
 const actual=validateSupportRequest(sample);
 assert.ok(actual);assert.equal(actual.customer_name,"Cliente Teste");assert.equal(actual.email,"teste@example.invalid");assert.equal(actual.description,"");assert.equal(actual.order_reference,"");
 assert.equal(supportProtocol(id),"ND-S-F4C77EB0B65D4BAF9FCE6A4B10CA6BA9");
});
test("Public requests never set internal state or payment information",()=>{
 const actual=validateSupportRequest({...sample,status:"resolved",first_response_at:"2026-11-01",payment_status:"refunded",internal_notes:"private"});
 assert.ok(actual);assert.equal(Object.hasOwn(actual,"status"),false);assert.equal(Object.hasOwn(actual,"payment_status"),false);assert.equal(Object.hasOwn(actual,"internal_notes"),false);
});
test("Invalid inputs and spam are rejected",()=>{
 for(const change of [{email:"wrong"},{category:"refund_now"},{consentimento:false},{website:"spam"},{nome:"a"},{requestId:"x"},{descricao:"a".repeat(2001)},{telefone:"(41) 9"},{telefone:"abc"}])assert.equal(validateSupportRequest({...sample,...change}),null);
 assert.equal(validateSupportRequest({...sample,telefone:"(41) 99999-9999"}).phone,"41999999999");
});
test("The first-response clock distinguishes pending, due, overdue and late replies",()=>{
 const deadline="2026-12-01T15:00:00.000Z";
 assert.equal(supportDeadlineLabel(deadline,null,Date.parse("2026-11-27T15:00:00Z")),"Aguardando primeira resposta");
 assert.equal(supportDeadlineLabel(deadline,null,Date.parse("2026-11-30T16:00:00Z")),"Responder em até 24h");
 assert.equal(supportDeadlineLabel(deadline,null,Date.parse(deadline)),"Resposta atrasada");
 assert.equal(supportDeadlineLabel(deadline,"2026-11-30T15:00:00Z"),"Resposta registrada");
 assert.equal(supportDeadlineLabel(deadline,"2026-12-02T15:00:00Z"),"Resposta após o prazo");
});
