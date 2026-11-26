import {test} from "node:test";
import assert from "node:assert/strict";
import {orderStage,canShipOrder,orderTimeline} from "../lib/commercial-dashboard.ts";

const pending={payment_status:"pending",fulfillment_status:"pending",payment_review:false};
const paid={payment_status:"paid",fulfillment_status:"preparing",payment_review:false};
test("Operational queue distinguishes payment and fulfillment",()=>{
 assert.equal(orderStage(pending),"pending");assert.equal(orderStage(paid),"preparing");
 assert.equal(orderStage({...paid,fulfillment_status:"shipped"}),"shipped");assert.equal(orderStage({...paid,fulfillment_status:"delivered"}),"delivered");
 assert.equal(orderStage({...paid,payment_review:true}),"review");assert.equal(orderStage({...paid,fulfillment_status:"pending"}),"review");
 for(const payment_status of ["failed","refunded","cancelled"])assert.equal(orderStage({...paid,payment_status,payment_review:true}),"closed");
});
test("Only verified paid orders in the valid fulfillment stages may advance",()=>{
 assert.equal(canShipOrder(pending),false);assert.equal(canShipOrder(paid),true);
 assert.equal(canShipOrder({...paid,fulfillment_status:"shipped"}),true);assert.equal(canShipOrder({...paid,fulfillment_status:"delivered"}),false);
 assert.equal(canShipOrder({...paid,payment_review:true}),false);assert.equal(canShipOrder({...paid,payment_status:"refunded"}),false);
});
test("History renders only actual recorded dates and sorts chronologically",()=>{
 const created_at="2026-11-25T15:00:00Z",paid_at="2026-11-25T17:00:00Z",shipped_at="2026-11-26T10:00:00Z";
 assert.deepEqual(orderTimeline({created_at}).map(x=>x.label),["Pedido registrado"]);
 assert.deepEqual(orderTimeline({created_at,paid_at,shipped_at,delivered_at:null}).map(x=>x.label),["Pedido registrado","Pagamento confirmado","Envio registrado"]);
});
