import type { LeadStatus } from "./editorial-leads.ts";

export const openLeadStatuses=["new","contacted","proposal_sent","negotiating"] as const;
export const leadNextAction:Record<LeadStatus,string>={
 new:"Faça o primeiro contato e entenda o que a pessoa precisa.",
 contacted:"Combine o próximo passo e agende um retorno, se necessário.",
 proposal_sent:"Confira se a pessoa recebeu a proposta e marque um retorno.",
 negotiating:"Alinhe os detalhes pendentes antes de concluir.",
 closed:"O atendimento foi concluído.",
 lost:"Atendimento encerrado sem avanço; reabra se necessário.",
};
export function saoPauloToday(now=new Date()){
 const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
 const read=(key:string)=>parts.find(p=>p.type===key)?.value;
 return `${read("year")}-${read("month")}-${read("day")}`;
}
export function validFollowUp(value:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||value.slice(0,4)<"2000"||value.slice(0,4)>"2099")return false;
 const date=new Date(value+"T00:00:00Z");
 return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function followUpLabel(value:string|null,today=saoPauloToday()){
 if(!value)return "Sem retorno marcado";
 if(value<today)return "Retorno atrasado";
 if(value===today)return "Retorno hoje";
 return "Retorno em "+value.split("-").reverse().join("/");
}
export const leadIdPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function normalizeWhatsApp(raw:string){
 if(!/^[\d\s()+.-]*$/.test(raw))return null;
 const digits=raw.replace(/\D/g,"");
 const normalized=digits.length===10||digits.length===11?"55"+digits:digits;
 return /^55[1-9][0-9]{9,10}$/.test(normalized)?normalized:null;
}
export function whatsappUrl(number:string|null,message:string){
 return number&&/^55[1-9][0-9]{9,10}$/.test(number)?"https://wa.me/"+number+"?text="+encodeURIComponent(message):null;
}
