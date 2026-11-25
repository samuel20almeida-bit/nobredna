import {test} from "node:test";
import assert from "node:assert/strict";
import {editorialEmailMessage,editorialEmailRetry} from "../lib/editorial-email.ts";

test("Book consultation receipt explains next steps without promising payment or delivery",()=>{
 const input={kind:"receipt",source:"livros",name:"Teste",protocol:"ND-"+"A".repeat(32)};
 const result=editorialEmailMessage(input);
 assert.match(result.text,/Nenhum pagamento foi realizado/);
 assert.ok(result.text.includes(input.protocol));
});
test("Admin alert links to the private panel and omits personal lead details",()=>{
 const result=editorialEmailMessage({kind:"admin_alert",source:"coautoria",name:"Dado privado",protocol:"ND-"+"B".repeat(32)});
 assert.ok(!result.text.includes("Dado privado"));
 assert.match(result.text,/nobredna\.vercel\.app\/admin/);
});
test("Email retry stays within the provider idempotency window and attempt budget",()=>{
 const now=Date.now();
 assert.equal(editorialEmailRetry(0,null,now),true);
 assert.equal(editorialEmailRetry(2,new Date(now-3600000).toISOString(),now),true);
 assert.equal(editorialEmailRetry(5,null,now),false);
 assert.equal(editorialEmailRetry(2,new Date(now-23*3600000).toISOString(),now),false);
});
