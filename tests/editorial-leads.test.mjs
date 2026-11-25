import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEditorialLead, journeyQuestions, leadProtocol, leadStatuses, leadStatusLabels } from "../lib/editorial-leads.ts";
const base={requestId:"00000000-0000-4000-8000-000000000099",nome:"  Pessoa Teste  ",email:"TESTE@example.invalid",telefone:"",consentimento:true};
test("Editorial lead stores normalized contact and canonical answers",()=>{
  const lead=validateEditorialLead({...base,source:"editorial",respostas:journeyQuestions().map(q=>q.opcoes[0])});
  assert.equal(lead?.customer_name,"Pessoa Teste");
  assert.equal(lead?.email,"teste@example.invalid");
  assert.equal(lead?.details.respostas.length,3);
  assert.equal(leadProtocol(lead?.id),"ND-00000000000040008000000000000099");
});
test("Coauthorship has its own question and answers",()=>{
  const lead=validateEditorialLead({...base,source:"coautoria",respostas:journeyQuestions(true).map(q=>q.opcoes[0])});
  assert.equal(lead?.details.respostas[2].pergunta,"O que procura em uma coautoria?");
});
test("Book inquiry resolves actual catalog names and quantities",()=>{
  const lead=validateEditorialLead({...base,source:"livros",email:"",telefone:"(41) 99999-9999",cep:"80010-001",itens:[{slug:"ave-mulher",qty:2,title:"Ignore"}]});
  assert.equal(lead?.phone,"41999999999");
  assert.deepEqual(lead?.details,{itens:[{slug:"ave-mulher",titulo:"Ave Mulher",quantidade:2}],cep:"80010001"});
});
test("Missing consent/contact or invalid responses do not enter the database",()=>{
  const good={...base,source:"editorial",respostas:journeyQuestions().map(q=>q.opcoes[0])};
  assert.equal(validateEditorialLead({...good,consentimento:false}),null);
  assert.equal(validateEditorialLead({...good,email:"",telefone:""}),null);
  assert.equal(validateEditorialLead({...good,email:"not-an-email"}),null);
  assert.equal(validateEditorialLead({...good,respostas:["invalid","invalid","invalid"]}),null);
  assert.equal(validateEditorialLead({...good,source:"livros",itens:[{slug:"fake",qty:1}]}),null);
  assert.equal(validateEditorialLead({...good,source:"livros",itens:[{slug:"ave-mulher",qty:13}]}),null);
});
test("CRM supports existing records and all editorial pipeline stages",()=>{
  assert.deepEqual(leadStatuses,["new","contacted","proposal_sent","negotiating","closed","lost"]);
  assert.ok(leadStatuses.every(s=>typeof leadStatusLabels[s]==="string"));
});
