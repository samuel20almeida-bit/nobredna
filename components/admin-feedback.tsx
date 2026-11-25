"use client";

import Link, {useLinkStatus} from "next/link";
import {useFormStatus} from "react-dom";
import type {ReactNode} from "react";
import {useState,useTransition} from "react";
import {useRouter} from "next/navigation";

function Spinner(){return <span aria-hidden="true" className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"/>}
function PendingLink(){const {pending}=useLinkStatus();return pending?<span role="status" aria-label="Carregando" className="ml-auto flex shrink-0"><Spinner/></span>:null}
export function AdminNavLink({href,active,children,dock=false}:{href:string;active:boolean;children:ReactNode;dock?:boolean}){
 return <Link href={href} aria-current={active?"page":undefined} className={"admin-nav-link relative flex min-h-12 shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-medium "+(dock?"max-lg:min-w-0 max-lg:flex-col max-lg:justify-center max-lg:gap-1 max-lg:px-1 max-lg:py-2 max-lg:text-[10px] ":"")+(active?"bg-vinho text-white shadow-sm":"text-ink/65 hover:bg-almond-deep hover:text-vinho")} >{children}<span className={dock?"max-lg:absolute max-lg:right-1 max-lg:top-1":"ml-auto"}><PendingLink/></span></Link>
}
export function AdminSubmit({children,pendingText="Salvando…",className="admin-primary"}:{children:ReactNode;pendingText?:string;className?:string}){
 const {pending}=useFormStatus();
 return <button type="submit" disabled={pending} aria-busy={pending} className={className+" gap-2 disabled:cursor-wait disabled:opacity-65"}>{pending?<><Spinner/>{pendingText}</>:children}</button>
}
export function AdminFilter({children}:{children:ReactNode}){
 const router=useRouter(),[pending,startTransition]=useTransition();
 return <form method="get" action="/admin" aria-busy={pending} onSubmit={event=>{event.preventDefault();const params=new URLSearchParams();for(const [key,value] of new FormData(event.currentTarget)){if(typeof value==="string"&&value)params.append(key,value)}startTransition(()=>router.push("/admin?"+params.toString()))}} className="grid gap-3 border-b border-ink/10 p-4 sm:grid-cols-2 xl:flex xl:items-end">{children}<div className="flex items-center gap-2"><button disabled={pending} className="admin-primary gap-2 disabled:opacity-65">{pending?<><Spinner/>Filtrando…</>:"Filtrar"}</button></div></form>
}
export function AdminRefresh({children="Atualizar"}:{children?:ReactNode}){
 const router=useRouter(),[pending,startTransition]=useTransition();
 return <button type="button" disabled={pending} aria-busy={pending} onClick={()=>startTransition(()=>router.refresh())} className="admin-secondary gap-2 disabled:opacity-65">{pending?<><Spinner/>Atualizando…</>:children}</button>
}
export function AdminCopy({value,label}:{value:string;label:string}){
 const [copied,setCopied]=useState(false);
 return <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(value);setCopied(true)}catch{setCopied(false)}}} className="inline-flex min-h-10 items-center rounded-lg border border-vinho/20 px-3 text-xs font-semibold text-vinho">{copied?"Copiado!":label}</button>
}
