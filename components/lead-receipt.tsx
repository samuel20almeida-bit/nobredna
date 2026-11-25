"use client";
import {useState} from "react";
import Link from "next/link";

export function LeadReceipt({protocol,book=false}:{protocol:string;book?:boolean}){
 const [copied,setCopied]=useState(false);
 return <div className="rounded-2xl border border-khaki/45 bg-almond-lift p-5 text-ink sm:p-7" role="status">
   <span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-800"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></span>
   <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-khaki-ink">Recebido pela Casa</p>
   <h3 className="mt-2 text-3xl leading-tight text-vinho">{book?"Consulta registrada!":"Seu interesse foi registrado."}</h3>
   <p className="mt-3 text-sm leading-relaxed text-ink/75">{book?"A equipe confirmará os valores, o frete e a disponibilidade pelo contato informado. Nenhum pagamento foi efetuado.":"A equipe recebeu suas respostas e entrará em contato pelo canal informado. Obrigada por compartilhar o início da sua história."}</p>
   <div className="mt-5 rounded-xl border border-khaki-ink/20 bg-almond p-4"><p className="text-xs text-ink/60">Seu protocolo de acompanhamento</p><p className="mt-2 break-all font-mono text-xs font-semibold text-vinho">{protocol}</p><button type="button" className="mt-2 min-h-10 text-sm font-medium text-vinho underline" onClick={async()=>{try{await navigator.clipboard.writeText(protocol);setCopied(true)}catch{setCopied(false)}}}>{copied?"Protocolo copiado":"Copiar protocolo"}</button></div>
   <Link href="/livros" className="mt-5 flex min-h-12 items-center justify-center rounded-lg bg-vinho px-4 text-center text-sm font-semibold text-white">{book?"Voltar à livraria":"Conhecer a livraria"}</Link>
 </div>;
}
