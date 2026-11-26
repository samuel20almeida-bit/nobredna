import {test} from "node:test";
import assert from "node:assert/strict";
import {adminOperations,isAdminOperation,validAdminDestination,sameOriginAdminRequest} from "../lib/admin-form-contract.ts";

test("Only enumerated administrative operations can be called",()=>{
 for(const op of adminOperations)assert.equal(isAdminOperation(op),true);
 for(const op of [null,"", "constructor", "__proto__", "deleteCustomer", {}])assert.equal(isAdminOperation(op),false);
});
test("Mutation destinations cannot leave the private admin page",()=>{
 for(const location of ["/admin","/admin?aba=pos-venda&ficha=test&mensagem=post-sale-saved"])assert.ok(validAdminDestination(location));
 for(const location of ["//other.test/admin","https://other.test/admin","/administrative","/admin/mutation","/admin?x=\r\nLocation: https://other.test",null])assert.equal(validAdminDestination(location),false);
});
test("Administrative mutations require the same browser origin",()=>{
 const url="https://nobredna.vercel.app/admin/mutation";
 assert.ok(sameOriginAdminRequest("https://nobredna.vercel.app",url));
 for(const origin of [null,"null","https://other.test","http://nobredna.vercel.app","https://nobredna.vercel.app.other.test"])assert.equal(sameOriginAdminRequest(origin,url),false);
 assert.ok(sameOriginAdminRequest("http://127.0.0.1:3017","http://localhost:3017/admin/mutation","127.0.0.1:3017"));
 assert.ok(sameOriginAdminRequest("https://nobredna.vercel.app","http://localhost/admin/mutation","nobredna.vercel.app","https"));
 assert.equal(sameOriginAdminRequest("https://other.test","http://localhost/admin/mutation","nobredna.vercel.app","https"),false);
});
