import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { leadSources,leadSourceLabels,leadStatuses,leadStatusLabels,type LeadSource,type LeadStatus } from "@/lib/editorial-leads";
import { AdminHeading,AdminIcon } from "./admin-shell";
import { LeadBadge } from "./admin-crm";

export async function AdminOverview({client}:{client:SupabaseClient}){
 const [stats,recent]=await Promise.all([
   client.rpc("editorial_admin_overview"),
   client.from("editorial_leads").select("id,customer_name,source,status,created_at").order("created_at",{ascending:false}).limit(5),
 ]);
 const data=stats.data??{};
 const error=stats.error||!stats.data;
 const countResult=(count:number|undefined)=>({error,count:count??0});
 const total=countResult(data.total),states=leadStatuses.map(s=>countResult(data.states?.[s])),sources=leadSources.map(s=>countResult(data.sources?.[s]));
 const bookCount=countResult(data.books),orderCount=countResult(data.orders),lowStock=countResult(data.lowStock);
 const active=states.slice(1,4);
 const value=(r:{error:unknown;count:number|null})=>r.error?"—":r.count??0;
 const cards=[
   {label:"Novas solicitações",amount:value(states[0]),caption:"Aguardam primeiro retorno",icon:"people",href:"/admin?aba=interessados&status=new"},
   {label:"Em acompanhamento",amount:active.some(s=>s.error)?"—":active.reduce((sum,s)=>sum+(s.count??0),0),caption:"Atendimento e negociação",icon:"clock",href:"/admin?aba=interessados"},
   {label:"Livros cadastrados",amount:value(bookCount),caption:"Catálogo e estoque",icon:"book",href:"/admin?aba=livros"},
   {label:"Pedidos em andamento",amount:value(orderCount),caption:"Pagos, a preparar ou entregar",icon:"bag",href:"/admin?aba=pedidos"},
 ];
 return <>
   <AdminHeading eyebrow="Painel da Casa" title="Visão geral" description="Acompanhe o que está chegando e organize os próximos passos da editora."/>
   <div className="relative overflow-hidden rounded-2xl bg-vinho p-6 text-white shadow-lift sm:p-8"><div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-80 rounded-full border border-khaki/25 sm:size-96"/><div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-10 size-64 rounded-full border border-khaki/20"/><p className="relative text-xs font-medium uppercase tracking-[.16em] text-khaki">Seu escritório editorial</p><h2 className="relative mt-3 max-w-xl text-4xl leading-tight sm:text-5xl">Toda história começa com um contato.</h2><p className="relative mt-3 max-w-lg text-sm leading-relaxed text-white/85">As solicitações chegam diretamente do site. Organize as conversas e acompanhe cada projeto em um único lugar.</p><Link href="/admin?aba=interessados&status=new" className="relative mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-vinho">Ver novas solicitações <AdminIcon kind="arrow" size={16}/></Link></div>
   <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(c=><Link key={c.label} href={c.href} className="admin-card group p-5 transition-colors hover:border-vinho/35"><div className="flex items-center justify-between gap-2"><span className="grid size-10 place-items-center rounded-xl bg-vinho/8 text-vinho"><AdminIcon kind={c.icon}/></span><AdminIcon kind="arrow" size={16}/></div><p className="mt-4 text-sm text-ink/65">{c.label}</p><p className="mt-1 text-3xl font-semibold tabular-nums text-vinho">{c.amount}</p><p className="mt-2 text-xs text-ink/55">{c.caption}</p></Link>)}</div>
   <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
    <section className="admin-card min-w-0 p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-sans text-lg font-semibold">Fila de interessados</h2><p className="mt-1 text-sm text-ink/60">{value(total)} solicitações registradas</p></div><Link href="/admin?aba=interessados" className="text-sm font-semibold text-vinho">Ver todos</Link></div>
    {recent.error?<p role="alert" className="mt-5 text-sm text-vinho">Não foi possível carregar a fila.</p>:recent.data?.length?<ul className="mt-4 divide-y divide-ink/10">{recent.data.map(item=><li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-4"><div className="min-w-0"><p className="break-words text-sm font-semibold">{item.customer_name}</p><p className="mt-1 text-xs text-ink/60">{leadSourceLabels[item.source as LeadSource]} · {new Date(item.created_at).toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo"})}</p></div><LeadBadge status={item.status as LeadStatus}/></li>)}</ul>:<p className="mt-8 rounded-xl bg-almond p-5 text-sm text-ink/65">Ainda não há solicitações. Quando alguém preencher um formulário, você verá o registro aqui.</p>}
    </section>
    <section className="admin-card p-5 sm:p-6"><h2 className="font-sans text-lg font-semibold">Funil de atendimento</h2><p className="mt-1 text-sm text-ink/60">Distribuição atual das solicitações</p><div className="mt-5 space-y-4">{leadStatuses.map((s,i)=>{const count=states[i].count??0;return <Link href={"/admin?aba=interessados&status="+s} key={s} className="block"><div className="flex items-center justify-between gap-2 text-xs"><span className="font-medium text-ink/75">{leadStatusLabels[s]}</span><span className="font-semibold tabular-nums text-vinho">{value(states[i])}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-almond-deep"><div className="h-full rounded-full bg-vinho/75" style={{width:total.count?Math.min(100,count/total.count*100)+"%":"0%"}}/></div></Link>})}</div></section>
   </div>
   <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="admin-card p-5 sm:p-6"><h2 className="font-sans text-lg font-semibold">Origem das solicitações</h2><div className="mt-4 divide-y divide-ink/10">{leadSources.map((source,i)=><Link href={"/admin?aba=interessados&origem="+source} key={source} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{leadSourceLabels[source]}</span><strong className="text-vinho">{value(sources[i])}</strong></Link>)}</div></section><section className="admin-card p-5 sm:p-6"><h2 className="font-sans text-lg font-semibold">Atenção na operação</h2><p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950"><strong>Loja em preparação.</strong> O pagamento real permanece desativado durante a validação comercial.</p><Link href="/admin?aba=livros" className="mt-3 flex min-h-11 items-center justify-between rounded-lg border border-ink/10 px-4 text-sm font-medium">Livros ativos com estoque baixo <span className="text-vinho">{value(lowStock)}</span></Link></section></div>
 </>;
}
