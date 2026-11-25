"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { journeyQuestions } from "@/lib/editorial-leads";
import { LeadReceipt } from "./lead-receipt";

export function JornadaLegado({ coautoria = false }: { coautoria?: boolean }) {
 const perguntas=journeyQuestions(coautoria);
 const [respostas,setRespostas]=useState<string[]>([]);
 const [nome,setNome]=useState(""),[email,setEmail]=useState(""),[telefone,setTelefone]=useState("");
 const [consentimento,setConsentimento]=useState(false),[salvando,setSalvando]=useState(false);
 const [protocolo,setProtocolo]=useState(""),[erro,setErro]=useState("");
 const tentativa=useRef<string|null>(null),focus=useRef<HTMLHeadingElement>(null),interagiu=useRef(false);
 const concluido=respostas.length===perguntas.length;
 const passo=perguntas[respostas.length];
 useEffect(()=>{if(interagiu.current){focus.current?.focus({preventScroll:true});if(window.matchMedia("(max-width: 767px)").matches&&focus.current){const r=focus.current.getBoundingClientRect();if(r.top<76||r.bottom>window.innerHeight-90)focus.current.scrollIntoView({block:"center",behavior:"instant"});}}},[respostas.length]);
 async function registrar(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(salvando||protocolo)return;setErro("");setSalvando(true);
   if(nome.trim().length<2||(!email.trim()&&!telefone.trim())||(telefone.trim()&&!/^\d{10,13}$/.test(telefone.replace(/\D/g,"")))){setErro("Confira seu nome e informe um e-mail ou telefone válido.");setSalvando(false);return;}
   try{
     tentativa.current??=crypto.randomUUID();
     const response=await fetch("/api/contato",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:tentativa.current,source:coautoria?"coautoria":"editorial",nome,email,telefone,respostas,consentimento})});
     const data=await response.json();if(!response.ok||!data.protocolo)throw Error(data.erro??"Não foi possível registrar.");
     setProtocolo(data.protocolo);
   }catch(error){setErro(error instanceof Error?error.message:"Não foi possível registrar.")}finally{setSalvando(false)}
 }
 const input="mt-1.5 min-h-12 w-full rounded-xl border border-khaki-ink/30 bg-white px-3 focus:border-vinho";
 if(protocolo)return <LeadReceipt protocol={protocolo}/>;
 return <div className="rounded-2xl border border-khaki/60 bg-almond-lift p-5 text-ink shadow-lift sm:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-vinho/10 px-3 py-1.5 text-xs font-semibold text-vinho">Etapa {respostas.length+1} de {perguntas.length+1}</span><span className="text-xs text-ink/65">{concluido?"Seus dados":"Sem compromisso · 2 minutos"}</span></div>
   <div aria-label={respostas.length+" etapas concluídas"} role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={respostas.length} className="mt-4 flex gap-2">{Array.from({length:4},(_,i)=><span key={i} className={"h-1.5 flex-1 rounded-full "+(i<=respostas.length?"bg-vinho":"bg-almond-deep")}/>)}</div>
   <div key={respostas.length} className="journey-chapter mt-6">
    {!concluido?<><h3 ref={focus} tabIndex={-1} className="text-3xl leading-tight text-vinho outline-none">{passo.titulo}</h3><p className="mt-2 text-sm text-ink/70">Escolha a opção que mais combina com você.</p><div className="mt-5 grid gap-3">{passo.opcoes.map(opcao=><button key={opcao} type="button" onClick={()=>{interagiu.current=true;setRespostas([...respostas,opcao])}} className="group flex min-h-14 items-center gap-3 rounded-xl border border-khaki-ink/25 bg-white px-4 py-3 text-left text-sm text-ink transition-colors hover:border-vinho hover:bg-almond focus-visible:border-vinho sm:text-base"><span className="h-3.5 w-3.5 shrink-0 rounded-full border border-khaki-ink group-hover:bg-vinho"/><span className="flex-1">{opcao}</span><span aria-hidden="true" className="text-lg text-khaki-ink">→</span></button>)}</div></>:<>
      <h3 ref={focus} tabIndex={-1} className="text-3xl text-vinho outline-none">Seu legado já tem um começo.</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/75">Deixe seu contato para que a Casa possa conhecer suas respostas e conversar com você.</p>
      <details className="mt-5 rounded-xl border border-khaki-ink/25 bg-almond p-4"><summary className="cursor-pointer text-sm font-medium text-vinho">Revisar minhas respostas</summary><dl className="mt-3 space-y-3 text-sm">{perguntas.map((q,i)=><div key={q.titulo}><dt className="text-xs text-ink/60">{q.titulo}</dt><dd className="mt-1 font-medium">{respostas[i]}</dd></div>)}</dl></details>
      <form onSubmit={registrar} className="mt-5 grid gap-4">
       <fieldset disabled={salvando} className="grid gap-4">
        <label className="text-sm font-medium text-ink">Nome<input required value={nome} onChange={e=>{setNome(e.target.value);tentativa.current=null}} maxLength={100} autoComplete="name" className={input} placeholder="Seu nome completo"/></label>
        <label className="text-sm font-medium text-ink">Telefone<input type="tel" value={telefone} onChange={e=>{setTelefone(e.target.value);tentativa.current=null}} autoComplete="tel" maxLength={30} className={input} placeholder="(41) 99999-9999"/></label>
        <label className="text-sm font-medium text-ink">E-mail<input type="email" value={email} onChange={e=>{setEmail(e.target.value);tentativa.current=null}} autoComplete="email" maxLength={160} className={input} placeholder="voce@exemplo.com"/></label>
        <p className="text-sm text-ink/70">Informe pelo menos um contato: telefone ou e-mail.</p>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/80"><input type="checkbox" required checked={consentimento} onChange={e=>setConsentimento(e.target.checked)} className="mt-1 size-4 accent-vinho"/><span>Autorizo a NobreDNA a registrar minhas respostas e utilizar meus dados de contato para atender esta solicitação.</span></label>
        </fieldset>
        {erro&&<p role="alert" className="rounded-lg border border-vinho/20 bg-vinho/5 p-3 text-sm text-vinho">{erro}</p>}
        <button type="submit" disabled={salvando} className="min-h-14 rounded-xl bg-vinho px-4 font-medium text-almond hover:bg-vinho-soft disabled:opacity-50">{salvando?"Registrando…":"Registrar meu interesse"}</button>
      </form>
    </>}
   </div>
   {respostas.length>0&&!protocolo&&<button type="button" disabled={salvando} onClick={()=>{setRespostas(respostas.slice(0,-1));setErro("");tentativa.current=null}} className="mt-5 min-h-11 text-base text-vinho underline underline-offset-4">Voltar uma etapa</button>}
 </div>;
}
