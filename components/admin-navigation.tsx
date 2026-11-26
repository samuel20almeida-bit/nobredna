"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {createContext,useContext,useState,useTransition,type ComponentProps,type ReactNode} from "react";

type Operation={kind:"link"|"filter"|"refresh";target:string|null};
type Navigation={pending:boolean;operation:Operation|null;navigate:(href:string,kind?:"link"|"filter",options?:{scroll?:boolean;replace?:boolean})=>void;refresh:()=>void};
const NavigationContext=createContext<Navigation|null>(null);
const isAdminHref=(href:string)=>/^\/admin(?:[/?#]|$)/.test(href);

export function AdminNavigationProvider({children}:{children:ReactNode}){
 const router=useRouter(),[pending,startTransition]=useTransition(),[operation,setOperation]=useState<Operation|null>(null);
 function navigate(href:string,kind:"link"|"filter"="link",options?:{scroll?:boolean;replace?:boolean}){
   if(!isAdminHref(href))return;
   if(new URL(href,window.location.origin).href===window.location.href)return;
   setOperation({kind,target:href});
   startTransition(()=>{if(options?.replace)router.replace(href,{scroll:options.scroll});else router.push(href,{scroll:options?.scroll})});
 }
 function refresh(){setOperation({kind:"refresh",target:null});startTransition(()=>router.refresh())}
 return <NavigationContext.Provider value={{pending,operation:pending?operation:null,navigate,refresh}}>
  {pending&&<div className="admin-navigation-progress" role="status" aria-live="polite"><span className="admin-navigation-progress-bar" aria-hidden="true"/><span className="admin-navigation-progress-label">{operation?.kind==="filter"?"Filtrando…":operation?.kind==="refresh"?"Atualizando…":"Abrindo…"}</span></div>}
  {children}
 </NavigationContext.Provider>;
}

export function useAdminNavigation(){return useContext(NavigationContext)}

// Only admin links are intercepted. Browser semantics (new tab, external URL,
// modifiers) are preserved. Avoid eagerly fetching dozens of private records.
export function AdminLink({href,prefetch=false,scroll,replace,onNavigate,children,...props}:ComponentProps<typeof Link>){
 const nav=useAdminNavigation(),target=typeof href==="string"&&isAdminHref(href)?href:null;
 const busy=Boolean(target&&nav?.pending&&nav.operation?.target===target);
 return <Link {...props} href={href} prefetch={prefetch} scroll={scroll} replace={replace} aria-busy={busy||undefined} data-admin-pending={busy?"true":undefined} onNavigate={event=>{if(onNavigate){onNavigate(event);return}if(nav&&target){event.preventDefault();nav.navigate(target,"link",{scroll,replace})}}}>{children}</Link>;
}
