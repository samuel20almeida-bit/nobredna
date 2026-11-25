import type {SupabaseClient} from "@supabase/supabase-js";
import Link from "next/link";
import {leadSources,leadSourceLabels,leadStatuses,leadStatusLabels,type LeadSource,type LeadStatus} from "@/lib/editorial-leads";
import {followUpLabel,openLeadStatuses,saoPauloToday} from "@/lib/editorial-workspace";
import {AdminHeading,AdminIcon} from "./admin-shell";
import {AdminRefresh} from "./admin-feedback";
import {LeadBadge} from "./admin-crm";

type InboxRow={id:string;customer_name:string;source:LeadSource;status:LeadStatus;created_at:string;follow_up_on:string|null;next_action:string};
const leadSelect="id,customer_name,source,status,created_at,follow_up_on,next_action";
const inboxHref="/admin?aba=interessados";
const date=(v:string)=>new Date(v).toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo"});
function InboxRows({rows,error,empty,reminders=false}:{rows:InboxRow[];error:boolean;empty:string;reminders?:boolean}){
 return error?<p role="alert" className="mt-4 text-sm text-vinho">Não foi possível carregar os registros.</p>:rows.length?<ul className="mt-4 divide-y divide-ink/10">{rows.map(item=><li key={item.id}><Link href={inboxHref+"&ficha="+item.id} className="flex min-h-16 flex-wrap items-center justify-between gap-2 py-3 hover:text-vinho"><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{item.customer_name}</p><p className="mt-1 text-xs text-ink/60">{leadSourceLabels[item.source]} · {reminders?followUpLabel(item.follow_up_on):date(item.created_at)}</p>{reminders&&item.next_action&&<p className="mt-2 line-clamp-2 text-xs text-ink/75">{item.next_action}</p>}</div><LeadBadge status={item.status}/><AdminIcon kind="arrow" size={15}/></Link></li>)}</ul>:<div className="mt-5 rounded-xl bg-almond p-4 text-sm text-ink/65">{empty}</div>;
}

export async function AdminOverview({client,notifications=false}:{client:SupabaseClient;notifications?:boolean}){
 const today=saoPauloToday();
 const [stats,recent,due]=await Promise.all([
   client.rpc("editorial_admin_overview"),
   client.from("editorial_leads").select(leadSelect).eq("status","new").order("created_at",{ascending:false}).limit(5),
   client.from("editorial_leads").select(leadSelect).in("status",[...openLeadStatuses]).lte("follow_up_on",today).order("follow_up_on",{ascending:true}).limit(5),
 ]);
 const data=stats.data??{},error=Boolean(stats.error||!stats.data);
 const value=(n:number|undefined)=>error?"—":n??0;
 const cards=[
   {label:"Novos contatos",amount:data.states?.new??0,caption:"Precisam do primeiro contato",icon:"people",href:inboxHref+"&status=new",tone:"bg-amber-100 text-amber-900"},
   {label:"Retornos vencidos ou de hoje",amount:data.due??0,caption:(data.overdue??0)+" atrasados",icon:"clock",href:inboxHref+"&foco=retornos",tone:"bg-orange-100 text-orange-900"},
   {label:"Propostas enviadas",amount:data.states?.proposal_sent??0,caption:"Aguardam acompanhamento",icon:"feather",href:inboxHref+"&status=proposal_sent",tone:"bg-violet-100 text-violet-900"},
   {label:"Pedidos para enviar",amount:data.readyToShip??0,caption:"Pagamentos confirmados",icon:"bag",href:"/admin?aba=pedidos&foco=envio",tone:"bg-blue-100 text-blue-900"},
   {label:"Estoque baixo",amount:data.lowStock??0,caption:"Livros ativos com até 3 unidades",icon:"book",href:"/admin?aba=livros&foco=estoque",tone:"bg-stone-200 text-stone-800"}
 ];
 return <>
  <AdminHeading eyebrow={notifications?"Central de notificações":"Seu escritório editorial"} title={notifications?"Notificações":"O que precisa de atenção hoje?"} description={notifications?"Pendências atuais da editora. Abra um aviso para resolver a tarefa; a lista reflete o status e as datas registradas.":"Veja o que chegou, quem precisa de retorno e o que está pronto para enviar."}/>
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-khaki-ink/15 bg-[#fffdf9] px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-khaki-ink">{today.split("-").reverse().join("/")}</p><p className="mt-1 text-sm font-medium">{error?"Não foi possível atualizar seus indicadores.": "Seu dia começa por aqui."}</p></div><AdminRefresh>Atualizar painel</AdminRefresh></div>
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-5">{cards.map(c=><Link key={c.label} href={c.href} className="admin-card group flex min-h-[140px] flex-col p-4 transition-colors hover:border-vinho/40 sm:p-5"><div className="flex items-center justify-between gap-2"><span className={"grid size-9 place-items-center rounded-xl "+c.tone}><AdminIcon kind={c.icon} size={19}/></span><AdminIcon kind="arrow" size={15}/></div><p className="mt-3 text-3xl font-semibold tabular-nums text-vinho">{value(c.amount)}</p><p className="mt-1 text-sm font-semibold leading-snug">{c.label}</p><p className="mt-2 text-xs leading-snug text-ink/60">{c.caption}</p></Link>)}</div>
  <div className="mt-5 grid gap-5 xl:grid-cols-2">
   <section className="admin-card min-w-0 p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-sans text-lg font-semibold">Novos atendimentos</h2><p className="mt-1 text-sm text-ink/60">Comece pelas solicitações recebidas.</p></div><Link href={inboxHref+"&status=new"} className="text-sm font-semibold text-vinho">Ver todos</Link></div><InboxRows rows={(recent.data??[]) as InboxRow[]} error={Boolean(recent.error)} empty="Tudo em dia! Nenhum novo contato aguardando atendimento."/></section>
   <section className="admin-card min-w-0 p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-sans text-lg font-semibold">Retornos para hoje</h2><p className="mt-1 text-sm text-ink/60">Inclui os retornos que ficaram atrasados.</p></div><Link href={inboxHref+"&foco=retornos"} className="text-sm font-semibold text-vinho">Ver agenda</Link></div><InboxRows rows={(due.data??[]) as InboxRow[]} error={Boolean(due.error)} empty="Nenhum retorno vencido ou previsto para hoje." reminders/></section>
  </div>
  {!notifications&&<div className="mt-5 grid gap-5 xl:grid-cols-2">
   <section className="admin-card p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-sans text-lg font-semibold">Acompanhamento</h2><p className="mt-1 text-sm text-ink/60">{value(data.total)} solicitações registradas</p></div><Link href={inboxHref} className="text-sm font-semibold text-vinho">Abrir atendimentos</Link></div><div className="mt-5 space-y-3">{leadStatuses.map(s=><Link href={inboxHref+"&status="+s} key={s} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 px-3 py-3 text-sm"><LeadBadge status={s}/><span className="font-semibold tabular-nums text-vinho">{value(data.states?.[s])}</span><AdminIcon kind="arrow" size={14}/></Link>)}</div></section>
   <section className="admin-card p-5 sm:p-6"><h2 className="font-sans text-lg font-semibold">Atalhos da editora</h2><p className="mt-1 text-sm text-ink/60">Acesse diretamente o que precisa gerenciar.</p><div className="mt-4 divide-y divide-ink/10">{leadSources.map(s=><Link key={s} href={inboxHref+"&origem="+s} className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>{leadSourceLabels[s]}</span><span className="font-semibold text-vinho">{value(data.sources?.[s])}</span></Link>)}<Link href="/admin?aba=livros" className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Livraria · títulos cadastrados</span><strong className="text-vinho">{value(data.books)}</strong></Link><Link href="/admin?aba=pedidos" className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Pedidos em andamento</span><strong className="text-vinho">{value(data.orders)}</strong></Link></div><p className="mt-5 rounded-xl bg-almond p-4 text-sm leading-relaxed text-ink/70"><strong>Como usar:</strong> abra um atendimento, converse com a pessoa pelo contato informado, registre a situação e marque a próxima data de retorno. Os lembretes aparecerão aqui.</p></section>
  </div>}
 </>;
}
