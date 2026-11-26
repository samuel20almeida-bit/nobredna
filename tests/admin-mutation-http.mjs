// Local preview only: sends no requests to the production admin database.
import assert from "node:assert/strict";
const base=process.env.BASE_URL??"http://127.0.0.1:3017";
assert.ok(["127.0.0.1","localhost"].includes(new URL(base).hostname));
const url=base+"/admin/mutation";
const form=new FormData();form.set("_operation","updatePostSale");
const response=await fetch(url,{method:"POST",body:form,headers:{Origin:base,Accept:"application/json"}});
assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true,location:"/admin?mensagem=denied"});
assert.match(response.headers.get("cache-control")??"",/no-store/);
const native=await fetch(url,{method:"POST",body:new URLSearchParams({_operation:"updatePostSale"}),headers:{Origin:base},redirect:"manual"});
assert.equal(native.status,303);assert.equal(native.headers.get("location"),"/admin?mensagem=denied");
for(const origin of ["https://other.test",null]){
 const blocked=await fetch(url,{method:"POST",body:form,headers:origin?{Origin:origin}:{}});
 assert.equal(blocked.status,403);
}
const unknown=await fetch(url,{method:"POST",body:new URLSearchParams({_operation:"constructor"}),headers:{Origin:base}});
assert.equal(unknown.status,400);
console.log("PASS admin mutation JSON, native 303, private cache, origin protection and operation allowlist; no production data touched");
