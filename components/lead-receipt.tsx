"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";

export function LeadReceipt({protocol,book=false}:{protocol:string;book?:boolean}){
 const [copied,setCopied]=useState(false);
 const container=useRef<HTMLDivElement>(null);
 useEffect(()=>{container.current?.focus({preventScroll:true});container.current?.scrollIntoView({block:"start",behavior:"instant"})},[]);
 return <div ref={container} tabIndex={-1} className="scroll-mt-24 rounded-2xl border border-khaki/45 bg-almond-lift p-5 text-ink outline-none sm:p-7" role="status">
   <span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-800"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></span>
   <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-khaki-ink">Recebido pela Casa</p>
   <h3 className="mt-2 text-3xl leading-tight text-vinho">{book?"Consulta registrada!":"Seu interesse foi registrado."}</h3>
   <p className="mt-3 text-sm leading-relaxed text-ink/75">{book?"Sua consulta já está no painel da editora. Não foi criada uma compra nem houve cobrança.":"A equipe recebeu suas respostas e entrará em contato pelo canal informado. Obrigada por compartilhar o início da sua história."}</p>
   <div className="mt-5 rounded-xl border border-khaki-ink/20 bg-almond p-4"><p className="text-xs text-ink/60">Seu protocolo de acompanhamento</p><p className="mt-2 break-all font-mono text-xs font-semibold text-vinho">{protocol}</p><button type="button" className="mt-2 min-h-10 text-sm font-medium text-vinho underline" onClick={async()=>{try{await navigator.clipboard.writeText(protocol);setCopied(true)}catch{setCopied(false)}}}>{copied?"Protocolo copiado":"Copiar protocolo"}</button></div>
   {book&&<div className="mt-6"><h4 className="text-base font-semibold text-vinho">O que acontece agora?</h4><ol className="mt-3 space-y-3 text-sm leading-relaxed text-ink/75">{[["Solicitação recebida","A equipe já pode consultar seus dados e livros escolhidos."],["Retorno da editora","A Casa confirma disponibilidade, valores e frete pelo contato informado."],["Pagamento e entrega","A compra será combinada após sua aprovação dos valores."]].map(([title,description],i)=><li key={title} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-vinho/10 font-semibold text-vinho">{i+1}</span><div><p className="font-semibold text-vinho">{title}</p><p>{description}</p></div></li>)}</ol><p className="mt-4 rounded-xl bg-almond p-3 text-xs leading-relaxed">Guarde o protocolo. Ele permite que a equipe encontre sua solicitação, mesmo que nenhum e-mail tenha sido recebido.</p></div>}
   <Link href="/livros" className="mt-5 flex min-h-12 items-center justify-center rounded-lg bg-vinho px-4 text-center text-sm font-semibold text-white">{book?"Voltar à livraria":"Conhecer a livraria"}</Link>
 </div>;
}
