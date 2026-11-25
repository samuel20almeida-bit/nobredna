import assert from "node:assert/strict";
const base=process.env.BASE_URL??"http://127.0.0.1:3017";
const pages=[
  ["/livros","consulte seus exemplares"],
  ["/checkout","solicitação de compra"],
  ["/checkout/demonstracao","Simular finalização"],
  ["/checkout/retorno?status=aprovado&pedido=NDNA-"+"A".repeat(32),"Aguardando confirmação."],
  ["/admin","Configuração em andamento"]
];
for (const [path,expected] of pages) {
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  assert.ok((await response.text()).includes(expected),path+" should render expected status");
  console.log("PASS",path);
}
for (const path of ["/api/checkout/preferencia","/api/frete/cotacao","/api/checkout/webhook","/api/contato"]) {
  const response=await fetch(base+path,{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
  assert.equal(response.status,503,path+" must stay closed in a preview");
  console.log("PASS",path,"blocked (503)");
}
