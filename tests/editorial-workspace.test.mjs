import {test} from "node:test";
import assert from "node:assert/strict";
import {followUpLabel,validFollowUp,saoPauloToday,normalizeWhatsApp,whatsappUrl,openLeadStatuses,leadAdminHref,purchaseStatusLabels} from "../lib/editorial-workspace.ts";
test("Date-based reminders respect the São Paulo day and distinguish overdue",()=>{
 assert.equal(saoPauloToday(new Date("2026-11-26T01:00:00Z")),"2026-11-25");
 assert.equal(followUpLabel("2026-11-24","2026-11-25"),"Retorno atrasado");
 assert.equal(followUpLabel("2026-11-25","2026-11-25"),"Retorno hoje");
 assert.equal(followUpLabel("2026-11-26","2026-11-25"),"Retorno em 26/11/2026");
 assert.equal(followUpLabel(null,"2026-11-25"),"Sem retorno marcado");
 assert.ok(!openLeadStatuses.includes("closed"));
 assert.ok(!openLeadStatuses.includes("lost"));
});
test("Only real calendar dates are accepted",()=>{
 assert.equal(validFollowUp("2024-02-29"),true);
 assert.equal(validFollowUp("2026-02-29"),false);
 assert.equal(validFollowUp("2026-13-01"),false);
 assert.equal(validFollowUp(""),false);
});
test("WhatsApp support only generates links to normalized Brazilian phone numbers",()=>{
 assert.equal(normalizeWhatsApp("+55 41 8833-5400"),"554188335400");
 assert.equal(normalizeWhatsApp("(41) 99999-0000"),"5541999990000");
 assert.equal(normalizeWhatsApp("+55 41 99999-0000"),"5541999990000");
 assert.equal(normalizeWhatsApp("https://example.test"),null);
 assert.equal(normalizeWhatsApp("123"),null);
 assert.equal(whatsappUrl(null,"Olá"),null);
 assert.equal(whatsappUrl("5541999990000","Olá, NobreDNA!"),"https://wa.me/5541999990000?text=Ol%C3%A1%2C%20NobreDNA!");
});
test("Book purchases use their own admin queue and do not imply payment",()=>{
 assert.equal(leadAdminHref("livros","id"),"/admin?aba=pedidos&modo=solicitacoes&ficha=id");
 assert.equal(leadAdminHref("editorial","id"),"/admin?aba=interessados&ficha=id");
 assert.equal(leadAdminHref("coautoria"),"/admin?aba=interessados");
 assert.equal(purchaseStatusLabels.proposal_sent,"Valores enviados");
 assert.equal(purchaseStatusLabels.closed,"Atendimento concluído");
});
