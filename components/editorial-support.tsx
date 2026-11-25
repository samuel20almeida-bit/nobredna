"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {whatsappUrl} from "@/lib/editorial-workspace";

const topics=[
 {title:"Dúvida sobre compra",detail:"Livros, disponibilidade e valores",text:"Olá, NobreDNA! Tenho uma dúvida sobre a compra de um livro."},
 {title:"Publicação e coautoria",detail:"Projetos editoriais e próximos passos",text:"Olá, NobreDNA! Gostaria de ajuda sobre publicação ou coautoria."},
 {title:"Ajuda com meu pedido",detail:"Pagamento, envio ou acompanhamento",text:"Olá, NobreDNA! Preciso de ajuda com uma solicitação ou pedido."},
];
export function ChatIcon({size=22}:{size?:number}){
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.4 11.4a8.5 8.5 0 0 1-12.6 7.5L3 20l1.2-4.5A8.5 8.5 0 1 1 20.4 11.4Z"/><path d="M8 10h7m-7 4h4"/></svg>;
}
export function EditorialSupport(){
 const pathname=usePathname(),[open,setOpen]=useState(false),[number,setNumber]=useState<string|null>(null),[loaded,setLoaded]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),close=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{if(!open)return;let active=true;setLoaded(false);fetch("/api/suporte").then(r=>r.json()).then(data=>{if(active){setNumber(typeof data.whatsapp==="string"?data.whatsapp:null);setLoaded(true)}}).catch(()=>{if(active){setNumber(null);setLoaded(true)}});return()=>{active=false}},[open]);
 useEffect(()=>{if(!open)return;close.current?.focus();const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpen(false);trigger.current?.focus()}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[open]);
 function dismiss(){setOpen(false);trigger.current?.focus()}
 return <div className="editorial-support fixed z-[45]">
  {open&&<section id="editorial-support-panel" role="dialog" aria-label="Suporte da NobreDNA" className="mb-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-khaki-ink/25 bg-almond-lift shadow-panel">
   <header className="flex items-start gap-3 bg-vinho p-5 text-almond"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/30"><ChatIcon/></span><div className="flex-1"><p className="text-xs font-medium uppercase tracking-widest text-khaki">Atendimento da Casa</p><h2 className="mt-1 font-sans text-lg font-semibold">Como podemos ajudar?</h2></div><button ref={close} onClick={dismiss} className="grid size-9 shrink-0 place-items-center rounded-full border border-white/25 text-lg" aria-label="Fechar suporte">×</button></header>
   <div className="p-4"><p className="mb-3 text-sm leading-relaxed text-ink/70">Escolha o assunto para falar com a equipe editorial.</p>
   {!loaded?<p role="status" className="rounded-xl bg-almond p-3 text-sm">Consultando canal de atendimento…</p>:number?<div className="space-y-2">{topics.map(t=><a key={t.title} href={whatsappUrl(number,t.text)??undefined} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-3 rounded-xl border border-khaki-ink/20 bg-white p-3 text-sm text-vinho transition-colors hover:bg-almond"><div className="flex-1"><p className="font-semibold">{t.title}</p><p className="mt-1 text-xs text-ink/65">{t.detail}</p></div><span aria-hidden="true">↗</span></a>)}<a href={whatsappUrl(number,"Olá, NobreDNA! Preciso de suporte.")??undefined} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#176b4d] px-4 font-semibold text-white"><ChatIcon size={18}/>Falar no WhatsApp</a></div>:<div className="rounded-xl bg-almond p-4 text-sm text-ink/75"><p>O canal de WhatsApp ainda está em configuração. A equipe pode receber sua solicitação pelo site.</p><Link href="/publique#jornada" onClick={dismiss} className="mt-3 block min-h-10 font-semibold text-vinho underline">Falar sobre publicação</Link><Link href="/livros#catalogo" onClick={dismiss} className="block min-h-10 font-semibold text-vinho underline">Consultar livros</Link></div>}
   <p className="mt-3 text-xs leading-relaxed text-ink/60">Opcional: suas solicitações do site continuam registradas diretamente no painel da editora.</p></div>
  </section>}
  <button ref={trigger} type="button" aria-expanded={open} aria-controls="editorial-support-panel" onClick={()=>setOpen(v=>!v)} className="ml-auto flex min-h-12 items-center justify-center gap-2 rounded-full border border-khaki-ink/25 bg-vinho px-4 font-sans text-sm font-semibold text-white shadow-panel hover:bg-vinho-soft"><ChatIcon size={21}/><span>{open?"Fechar":"Precisa de ajuda?"}</span></button>
 </div>;
}
