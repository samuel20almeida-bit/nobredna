import { leadSourceLabels,type LeadSource } from "./editorial-leads.ts";
import {leadAdminHref} from "./editorial-workspace.ts";

export function editorialEmailMessage(input:{protocol:string;source:LeadSource;kind:"receipt"|"admin_alert";name:string}){
 const subject=input.kind==="receipt"?"Recebemos sua solicitação · NobreDNA":"Nova solicitação na NobreDNA";
 const next=input.source==="livros"?"A equipe confirmará a disponibilidade, o valor dos livros e o frete pelo contato informado. Nenhum pagamento foi realizado.":"A equipe editorial entrará em contato pelo canal informado para conversar sobre os próximos passos.";
 const text=input.kind==="receipt"
  ?`Olá, ${input.name}!\n\nRecebemos ${input.source==="livros"?"sua solicitação de compra":"sua solicitação de "+leadSourceLabels[input.source].toLowerCase()}.\n\nProtocolo: ${input.protocol}\n\n${next}\n\nGuarde este protocolo para acompanhar seu atendimento. Se não fez esta solicitação, desconsidere esta mensagem.\n\nNobreDNA · Casa de Legados`
  :`Uma nova solicitação foi registrada no site.\n\nOrigem: ${leadSourceLabels[input.source]}\nProtocolo: ${input.protocol}\n\nAcesse o painel privado para consultar os detalhes e iniciar o atendimento: https://nobredna.vercel.app${leadAdminHref(input.source)}\n\nNobreDNA · Casa de Legados`;
 return {subject,text};
}

export function editorialEmailRetry(attempts:number,firstAttempt:string|null,now:number){
 return attempts<5&&(!firstAttempt||now-Date.parse(firstAttempt)<22*60*60*1000);
}
