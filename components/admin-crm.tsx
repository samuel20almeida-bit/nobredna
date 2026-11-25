import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { leadSourceLabels, leadSources, leadStatusLabels, leadStatuses, type LeadSource, type LeadStatus } from "@/lib/editorial-leads";
import { updateEditorialLead,retryEditorialEmails } from "@/app/admin/actions";
import { AdminHeading,AdminIcon } from "./admin-shell";
import { AdminFilter,AdminSubmit } from "./admin-feedback";
import { editorialEmailConfigured,editorialAdminAlertConfigured } from "@/lib/editorial-notifications";

type Lead={id:string;protocol:string;source:LeadSource;customer_name:string;email:string|null;phone:string|null;status:LeadStatus;created_at:string;updated_at:string;internal_notes:string;details:{respostas?:{pergunta:string;resposta:string}[];itens?:{titulo:string;quantidade:number}[];cep?:string|null};editorial_notifications?:{kind:string;status:string;attempts:number;failure_code:string|null}[]};
const statusColors:Record<LeadStatus,string>={new:"bg-amber-100 text-amber-900",contacted:"bg-blue-100 text-blue-900",proposal_sent:"bg-violet-100 text-violet-900",negotiating:"bg-orange-100 text-orange-900",closed:"bg-emerald-100 text-emerald-900",lost:"bg-stone-200 text-stone-700"};
const date=(value:string)=>new Date(value).toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo"});
const pageSize=15;

export function LeadBadge({status}:{status:LeadStatus}){
 return <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium "+(statusColors[status]??"bg-stone-100 text-stone-700")}><span className="size-1.5 rounded-full bg-current"/>{leadStatusLabels[status]??status}</span>;
}

export async function AdminCrm({client,source,status,search,page,coauthor=false}:{client:SupabaseClient;source?:string;status?:string;search?:string;page?:string;coauthor?:boolean}){
 const tab=coauthor?"coautorias":"interessados";
 const filteredSource=coauthor?"coautoria":leadSources.includes(source as LeadSource)?source:"";
 const filteredStatus=leadStatuses.includes(status as LeadStatus)?status:"";
 const term=typeof search==="string"?search.trim().slice(0,80).replace(/[%_\\*]/g,""):"";
 const current=Math.min(10000,Math.max(1,Number.isInteger(Number(page))?Number(page):1));
 let query=client.from("editorial_leads").select("id,protocol,source,customer_name,email,phone,details,status,created_at,updated_at,internal_notes,editorial_notifications(kind,status,attempts,failure_code)",{count:"exact"}).order("created_at",{ascending:false}).order("id").range((current-1)*pageSize,current*pageSize-1);
 if(filteredSource)query=query.eq("source",filteredSource);
 if(filteredStatus)query=query.eq("status",filteredStatus);
 if(term)query=/^ND-[0-9A-F]+$/i.test(term)?query.ilike("protocol",term.toUpperCase()+"%"):query.ilike("customer_name","%"+term+"%");
 const result=await query;
 const leads=(result.data??[]) as Lead[];
 const total=result.count??0;
 const pages=Math.max(1,Math.ceil(total/pageSize));
 function href(next:number){
  const params=new URLSearchParams({aba:tab,pagina:String(next)});
  if(filteredSource&&!coauthor)params.set("origem",filteredSource);
  if(filteredStatus)params.set("status",filteredStatus);
  if(term)params.set("busca",term);
  return "/admin?"+params.toString();
 }
 return <section id="captacoes">
  <AdminHeading eyebrow="Relacionamento editorial" title={coauthor?"Coautorias":"Interessados"} description={coauthor?"Acompanhe as inscrições e o retorno a cada potencial coautora.":"Tudo que chega pelo site: contato, respostas e evolução do atendimento."}/>
  <div className="admin-card overflow-hidden">
   <AdminFilter>
    <input type="hidden" name="aba" value={tab}/>
    <label className="flex-1 text-xs font-semibold text-ink/70">Buscar interessado<div className="relative mt-1.5"><span className="pointer-events-none absolute left-3 top-3 text-ink/45"><AdminIcon kind="search" size={17}/></span><input type="search" name="busca" defaultValue={term} maxLength={80} placeholder="Nome ou protocolo" className="admin-input pl-10"/></div></label>
    {!coauthor&&<label className="text-xs font-semibold text-ink/70">Origem<select name="origem" defaultValue={filteredSource} className="admin-input mt-1.5"><option value="">Todas</option>{leadSources.map(s=><option key={s} value={s}>{leadSourceLabels[s]}</option>)}</select></label>}
    <label className="text-xs font-semibold text-ink/70">Situação<select name="status" defaultValue={filteredStatus} className="admin-input mt-1.5"><option value="">Todas</option>{leadStatuses.map(s=><option key={s} value={s}>{leadStatusLabels[s]}</option>)}</select></label>
    <Link href={"/admin?aba="+tab} className="flex min-h-11 items-center px-2 text-sm text-vinho">Limpar</Link>
   </AdminFilter>
   <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"><p role="status" className="text-sm font-medium text-ink/65">{result.error?"Registros indisponíveis":total+" "+(total===1?"solicitação":"solicitações")}</p><Link href={href(current)} className="text-sm font-medium text-vinho">Atualizar</Link></div>
   {result.error?<p role="alert" className="border-t border-ink/10 p-5 text-sm text-vinho">Não foi possível carregar as solicitações. Tente atualizar a página.</p>:leads.length===0?<div className="border-t border-ink/10 px-5 py-12 text-center"><div className="mx-auto grid size-12 place-items-center rounded-full bg-vinho/10 text-vinho"><AdminIcon kind="people" size={24}/></div><p className="mt-4 font-semibold">Nenhuma solicitação encontrada.</p><p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">As solicitações enviadas pelo site aparecem aqui. Experimente limpar os filtros.</p></div>:<>
   <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,.95fr)_100px_80px] gap-3 border-y border-ink/10 bg-almond px-5 py-3 text-xs font-semibold text-ink/55 xl:grid"><span>Interessado</span><span>Origem</span><span>Situação</span><span>Recebido em</span><span>Detalhes</span></div>
   <div className="divide-y divide-ink/10 border-t border-ink/10 xl:border-t-0">
    {leads.map(lead=><details key={lead.id} className="group">
     <summary className="grid cursor-pointer list-none gap-3 px-4 py-4 transition-colors hover:bg-almond/70 sm:px-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,.95fr)_100px_80px] xl:items-center [&::-webkit-details-marker]:hidden">
      <div className="flex min-w-0 items-center gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-vinho/10 text-sm font-semibold text-vinho">{lead.customer_name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="break-words text-sm font-semibold">{lead.customer_name}</p><p className="mt-1 truncate text-xs text-ink/55">{lead.email??lead.phone}</p></div></div>
      <span className="text-sm text-ink/70">{leadSourceLabels[lead.source]}</span><div><LeadBadge status={lead.status}/></div><span className="text-xs text-ink/60">{date(lead.created_at)}</span><span className="text-xs font-semibold text-vinho"><span className="group-open:hidden">Abrir +</span><span className="hidden group-open:inline">Fechar −</span></span>
     </summary>
     <div className="border-t border-ink/10 bg-almond/60 p-4 sm:p-6"><div className="grid gap-5 xl:grid-cols-2">
      <div><h3 className="font-sans text-sm font-semibold text-vinho">Solicitação recebida</h3><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-xs text-ink/55">Protocolo</dt><dd className="break-all">{lead.protocol}</dd></div>{lead.email&&<div><dt className="text-xs text-ink/55">E-mail</dt><dd className="break-all">{lead.email}</dd></div>}{lead.phone&&<div><dt className="text-xs text-ink/55">Telefone</dt><dd>{lead.phone}</dd></div>}{lead.details.respostas?.map((answer,i)=><div key={i}><dt className="text-xs text-ink/55">{answer.pergunta}</dt><dd className="mt-1 font-medium">{answer.resposta}</dd></div>)}{lead.details.itens?.length&&<div><dt className="text-xs text-ink/55">Livros solicitados</dt><dd>{lead.details.itens.map((item,i)=><p key={i}>{item.quantidade} × {item.titulo}</p>)}</dd></div>}{lead.details.cep&&<div><dt className="text-xs text-ink/55">CEP</dt><dd>{lead.details.cep}</dd></div>}</dl></div>
      <form action={updateEditorialLead} className="rounded-xl border border-ink/10 bg-white p-4 sm:p-5"><input type="hidden" name="id" value={lead.id}/><input type="hidden" name="version" value={lead.updated_at}/><input type="hidden" name="aba" value={tab}/><input type="hidden" name="origem" value={filteredSource??""}/><input type="hidden" name="filtro_status" value={filteredStatus??""}/><input type="hidden" name="busca" value={term}/><input type="hidden" name="pagina" value={current}/><h3 className="font-sans text-sm font-semibold text-vinho">Acompanhamento</h3><label className="mt-4 block text-xs font-semibold text-ink/70">Situação<select name="status" defaultValue={lead.status} className="admin-input mt-2">{leadStatuses.map(s=><option key={s} value={s}>{leadStatusLabels[s]}</option>)}</select></label><label className="mt-4 block text-xs font-semibold text-ink/70">Anotações internas<textarea name="notes" defaultValue={lead.internal_notes} maxLength={4000} rows={4} placeholder="Próxima ação, retorno, proposta ou observações…" className="admin-input mt-2 h-auto resize-y py-3"/></label><p className="mt-2 text-xs text-ink/55">Visíveis apenas à equipe autorizada. Última atualização: {date(lead.updated_at)}.</p><AdminSubmit className="admin-primary mt-4 w-full">Salvar acompanhamento</AdminSubmit></form>
     </div>
     <section className="mt-5 rounded-xl border border-ink/10 bg-white p-4"><h3 className="font-sans text-sm font-semibold text-vinho">E-mails da solicitação</h3>
      {lead.editorial_notifications?.length? <ul className="mt-3 space-y-2 text-sm">{lead.editorial_notifications.map(job=><li key={job.kind} className="flex flex-wrap justify-between gap-2 border-b border-ink/10 pb-2"><span>{job.kind==="receipt"?"Confirmação ao interessado":"Aviso à editora"}</span><span className="font-medium text-vinho">{job.status==="pending"&&(!editorialEmailConfigured()||job.kind==="admin_alert"&&!editorialAdminAlertConfigured())?"Aguardando configuração":({pending:"Na fila",sending:"Enviando",sent:"Aceito pelo provedor",failed:"Falha temporária",review:"Requer revisão"}[job.status]??job.status)}</span></li>)}</ul>:<p className="mt-2 text-xs text-ink/60">Não há e-mails enfileirados para este registro (registro anterior à integração ou teste).</p>}
      {editorialEmailConfigured()&&lead.editorial_notifications?.some(j=>["pending","failed","sending"].includes(j.status))&&<form action={retryEditorialEmails} className="mt-3"><input name="id" type="hidden" value={lead.id}/><input name="aba" type="hidden" value={tab}/><AdminSubmit className="admin-secondary" pendingText="Consultando fila…">Tentar envio pendente</AdminSubmit></form>}
     </section></div>
    </details>)}
   </div></>}
   {!result.error&&pages>1&&<div className="flex items-center justify-between gap-3 border-t border-ink/10 p-4 text-sm"><span className="text-ink/60">Página {current} de {pages}</span><div className="flex gap-2">{current>1&&<Link className="admin-secondary" href={href(current-1)}>Anterior</Link>}{current<pages&&<Link className="admin-secondary" href={href(current+1)}>Próxima</Link>}</div></div>}
  </div>
 </section>;
}
