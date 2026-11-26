import Link from "next/link";
import type { ReactNode } from "react";
import { BrandSeal } from "./brand-seal";
import { signOut } from "@/app/admin/actions";
import { AdminNavLink,AdminSubmit } from "./admin-feedback";

export const adminTabs = [
  {id:"visao",label:"Início",icon:"grid"},
  {id:"interessados",label:"Atendimentos",icon:"people"},
  {id:"livros",label:"Livraria",icon:"book"},
  {id:"pedidos",label:"Pedidos",icon:"bag"},
  {id:"pos-venda",label:"Pós-venda",icon:"support"},
  {id:"configuracoes",label:"Configurações",icon:"settings"},
] as const;
export type AdminTab=typeof adminTabs[number]["id"]|"notificacoes";

export function AdminIcon({kind,size=20}:{kind:string;size?:number}){
  const paths:Record<string,ReactNode>={
    grid:<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    people:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a4 4 0 0 1 3 4v2"/></>,
    feather:<><path d="M20 4c-4-1-9 3-12 9L5 19l6-3c6-3 10-8 9-12ZM4 20l8-8M11 15l5 .3"/></>,
    book:<><path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v14"/></>,
    bag:<><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></>,
    support:<><path d="M20 11.5a8 8 0 0 1-11.7 7.1L3 20l1.4-4.4A8 8 0 1 1 20 11.5Z"/><path d="M8 10h7m-7 4h4"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/></>,
    arrow:<path d="M7 17 17 7M7 7h10v10"/>,
    logout:<><path d="M13 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8m2-13 5 5-5 5m-8-5h13"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 3"/></>,
    check:<path d="m5 12 4 4L19 6"/>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/></>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[kind]??paths.grid}</svg>;
}

export function AdminShell({tab,email,children,help}:{tab:AdminTab;email:string;children:ReactNode;help?:ReactNode}){
  return <div className="admin-shell min-h-screen bg-[#f5f2ee] pb-24 text-ink lg:pb-0 lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
    <aside className="border-b border-ink/10 bg-[#fffdf9] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5 lg:px-6 lg:py-8"><BrandSeal size={42}/><div><span className="font-serif text-2xl leading-none text-vinho">NobreDNA</span><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-khaki-ink">Área da editora</p></div><Link href="/" className="ml-auto flex min-h-11 items-center gap-1 text-xs text-vinho lg:hidden"><AdminIcon kind="arrow" size={15}/>Site</Link></div>
      <nav aria-label="Módulos administrativos" className="admin-dock fixed inset-x-0 bottom-0 z-[55] grid grid-cols-6 gap-0.5 border-t border-ink/10 bg-[#fffdf9] px-1 pt-1 lg:static lg:mt-5 lg:flex lg:flex-col lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:px-4 lg:pb-0"><p className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-[.15em] text-ink/45 lg:block">Menu principal</p>{adminTabs.map(item=><AdminNavLink key={item.id} href={item.id==="visao"?"/admin":"/admin?aba="+item.id} active={tab===item.id} dock><AdminIcon kind={item.icon}/><span className="max-lg:hidden">{item.label}</span><span className="lg:hidden">{item.id==="interessados"?"Atender":item.id==="configuracoes"?"Ajustes":item.label}</span></AdminNavLink>)}</nav>
      <div className="mt-auto hidden border-t border-ink/10 p-5 lg:block"><div className="mb-4 flex items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-vinho/10 font-semibold text-vinho">{email.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="text-sm font-semibold">Administradora</p><p className="truncate text-xs text-ink/60" title={email}>{email}</p></div></div><Link href="/" className="flex min-h-11 items-center justify-between rounded-lg border border-ink/10 px-3 text-sm text-vinho">Abrir site público <AdminIcon kind="arrow" size={16}/></Link><form action={signOut}><button className="mt-2 flex min-h-11 w-full items-center gap-2 px-3 text-sm text-ink/65"><AdminIcon kind="logout" size={18}/> Sair da conta</button></form></div>
    </aside>
    <div className="min-w-0"><header className="flex min-h-16 items-center justify-between gap-4 border-b border-ink/10 bg-[#fffdf9] px-5 lg:px-9"><p className="text-xs text-ink/60"><span className="hidden sm:inline">Painel da Casa / </span><span className="font-semibold text-vinho">{tab==="notificacoes"?"Notificações":adminTabs.find(item=>item.id===tab)?.label}</span></p><div className="flex shrink-0 items-center gap-2"><Link href="/admin?aba=notificacoes" aria-label="Central de notificações" aria-current={tab==="notificacoes"?"page":undefined} className={"flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold "+(tab==="notificacoes"?"bg-vinho text-white":"border border-vinho/20 text-vinho")}><AdminIcon kind="bell" size={18}/><span className="hidden sm:inline">Notificações</span></Link>{help}<form action={signOut} className="lg:hidden"><AdminSubmit className="admin-secondary px-2" pendingText="Saindo…"><AdminIcon kind="logout" size={17}/><span className="sr-only">Sair</span></AdminSubmit></form></div></header><div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">{children}</div></div>
  </div>;
}

export function AdminHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
  return <div className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-khaki-ink">{eyebrow}</p><h1 className="mt-2 text-[clamp(2.5rem,5vw,3.6rem)] leading-none text-vinho">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 sm:text-base">{description}</p></div>
}
