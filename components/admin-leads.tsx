import type { SupabaseClient } from "@supabase/supabase-js";
import { leadSourceLabels, leadSources, leadStatusLabels, leadStatuses, type LeadSource, type LeadStatus } from "@/lib/editorial-leads";
import { updateEditorialLead } from "@/app/admin/actions";

type Lead={id:string;protocol:string;source:LeadSource;customer_name:string;email:string|null;phone:string|null;status:LeadStatus;created_at:string;details:{respostas?:{pergunta:string;resposta:string}[];itens?:{titulo:string;quantidade:number}[];cep?:string|null}};
const card="rounded-2xl border border-khaki-ink/20 bg-almond-lift p-5";
export async function AdminLeads({client,source,status}:{client:SupabaseClient;source?:string;status?:string}){
  const filteredSource=leadSources.includes(source as LeadSource)?source:null;
  const filteredStatus=leadStatuses.includes(status as LeadStatus)?status:null;
  let query=client.from("editorial_leads").select("id,protocol,source,customer_name,email,phone,details,status,created_at",{count:"exact"}).order("created_at",{ascending:false}).limit(100);
  if(filteredSource)query=query.eq("source",filteredSource);
  if(filteredStatus)query=query.eq("status",filteredStatus);
  const [result,all,newLeads]=await Promise.all([query,client.from("editorial_leads").select("id",{count:"exact",head:true}),client.from("editorial_leads").select("id",{count:"exact",head:true}).eq("status","new")]);
  const leads=(result.data??[]) as Lead[];
  return <section id="captacoes" className="mt-10 scroll-mt-28">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="label">CRM editorial</p><h2 className="mt-2 text-3xl text-vinho">Solicitações recebidas</h2><p className="mt-2 text-sm text-ink/70">Triagens, coautorias e consultas registradas diretamente pelo site.</p></div><a href="/admin#captacoes" className="rounded-full border border-vinho/35 px-5 py-3 text-sm text-vinho">Atualizar registros</a></div>
    <div className="mt-5 grid grid-cols-2 gap-3"><div className={card}><p className="text-sm text-ink/65">Total de solicitações</p><p className="mt-2 text-3xl text-vinho">{all.error?"—":all.count??0}</p></div><div className={card}><p className="text-sm text-ink/65">Novas</p><p className="mt-2 text-3xl text-vinho">{newLeads.error?"—":newLeads.count??0}</p></div></div>
    <form action="/admin#captacoes" method="get" className="mt-5 flex flex-wrap items-end gap-3">
      <label className="text-sm">Origem<select name="origem" defaultValue={filteredSource??""} className="mt-1 block min-h-11 rounded-lg border border-ink/20 bg-white px-3"><option value="">Todas</option>{leadSources.map(s=><option key={s} value={s}>{leadSourceLabels[s]}</option>)}</select></label>
      <label className="text-sm">Situação<select name="status" defaultValue={filteredStatus??""} className="mt-1 block min-h-11 rounded-lg border border-ink/20 bg-white px-3"><option value="">Todas</option>{leadStatuses.map(s=><option key={s} value={s}>{leadStatusLabels[s]}</option>)}</select></label>
      <button className="min-h-11 rounded-lg bg-vinho px-5 text-sm text-white">Filtrar</button>
      {(filteredSource||filteredStatus)&&<a href="/admin#captacoes" className="min-h-11 px-2 py-3 text-sm text-vinho underline">Limpar filtros</a>}
    </form>
    {result.error?<p role="alert" className="mt-5 text-sm text-vinho">Não foi possível carregar as solicitações.</p>:leads.length===0?<div className={card+" mt-5"}><p className="font-medium">Nenhuma solicitação encontrada.</p><p className="mt-2 text-sm text-ink/65">Preencha a triagem ou a consulta de livros no site; o registro aparecerá aqui após atualizar.</p></div>:<div className="mt-5 grid gap-3">
      {leads.map(lead=><article key={lead.id} className={card}><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs uppercase tracking-wider text-khaki-ink">{leadSourceLabels[lead.source]}</p><h3 className="mt-1 text-2xl text-vinho">{lead.customer_name}</h3><p className="mt-1 text-xs text-ink/65">{new Date(lead.created_at).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}</p></div><span className="rounded-full bg-vinho/10 px-3 py-2 text-sm font-medium text-vinho">{leadStatusLabels[lead.status]}</span></div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">{lead.email&&<p className="break-all"><strong>E-mail: </strong>{lead.email}</p>}{lead.phone&&<p><strong>Telefone: </strong>{lead.phone}</p>}</div>
      <details className="mt-4 rounded-xl border border-ink/10 bg-almond p-4"><summary className="cursor-pointer font-medium text-vinho">Ver detalhes da solicitação</summary><p className="mt-3 text-xs break-all text-ink/65">Protocolo: {lead.protocol}</p>{lead.details.respostas?.map((answer,index)=><div className="mt-3" key={index}><p className="text-xs text-ink/65">{answer.pergunta}</p><p className="mt-1 text-sm font-medium">{answer.resposta}</p></div>)}{lead.details.itens&&<ul className="mt-3 grid gap-2 text-sm">{lead.details.itens.map((item,index)=><li key={index}>{item.quantidade} × {item.titulo}</li>)}</ul>}{lead.details.cep&&<p className="mt-3 text-sm">CEP: {lead.details.cep}</p>}</details>
      <form action={updateEditorialLead} className="mt-4 flex flex-wrap items-center gap-3"><input type="hidden" name="id" value={lead.id}/><label className="sr-only" htmlFor={"stage-"+lead.id}>Situação da solicitação</label><select id={"stage-"+lead.id} name="status" defaultValue={lead.status} className="min-h-11 rounded-lg border border-ink/20 bg-white px-3 text-sm">{leadStatuses.map(s=><option key={s} value={s}>{leadStatusLabels[s]}</option>)}</select><button className="min-h-11 rounded-lg border border-vinho/30 px-4 text-sm text-vinho">Salvar situação</button></form></article>)}
      {(result.count??0)>100&&<p className="text-sm text-ink/65">Exibindo as 100 solicitações mais recentes. Use os filtros para refinar.</p>}
    </div>}
  </section>
}
