"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { journeyQuestions } from "@/lib/editorial-leads";
import Link from "next/link";

export function JornadaLegado({ coautoria = false }: { coautoria?: boolean }) {
 const perguntas=journeyQuestions(coautoria);
 const [respostas,setRespostas]=useState<string[]>([]);
 const [nome,setNome]=useState(""),[email,setEmail]=useState(""),[telefone,setTelefone]=useState("");
 const [consentimento,setConsentimento]=useState(false),[salvando,setSalvando]=useState(false);
 const [protocolo,setProtocolo]=useState(""),[erro,setErro]=useState("");
 const tentativa=useRef<string|null>(null),focus=useRef<HTMLHeadingElement>(null),interagiu=useRef(false);
 const concluido=respostas.length===perguntas.length;
 const passo=perguntas[respostas.length];
 const resumo=perguntas.map((q,i)=>"*"+q.titulo+"*\n"+(respostas[i]||"")).join("\n\n");
 useEffect(()=>{if(interagiu.current){focus.current?.focus({preventScroll:true});if(window.matchMedia("(max-width: 767px)").matches&&focus.current){const r=focus.current.getBoundingClientRect();if(r.top<76||r.bottom>window.innerHeight-90)focus.current.scrollIntoView({block:"center",behavior:"instant"});}}},[respostas.length]);
 async function registrar(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(salvando||protocolo)return;setErro("");setSalvando(true);
   try{
     tentativa.current??=crypto.randomUUID();
     const response=await fetch("/api/contato",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:tentativa.current,source:coautoria?"coautoria":"editorial",nome,email,telefone,respostas,consentimento})});
     const data=await response.json();if(!response.ok||!data.protocolo)throw Error(data.erro??"Não foi possível registrar.");
     setProtocolo(data.protocolo);
   }catch(error){setErro(error instanceof Error?error.message:"Não foi possível registrar.")}finally{setSalvando(false)}
 }
 const input="mt-1 min-h-12 w-full rounded-lg border border-khaki-ink/35 bg-white px-3";
 return <div className="border border-khaki/60 bg-almond-lift p-5 text-ink shadow-lift sm:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-serif text-xl italic text-vinho">{concluido?"Seu primeiro passo":"Capítulo "+(respostas.length+1)+" de "+perguntas.length}</p><span className="text-sm text-ink/65">{protocolo?"Registrado":concluido?"Último passo":"Sem compromisso"}</span></div>
   <div aria-label={respostas.length+" de "+perguntas.length+" respostas"} role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={respostas.length} className="mt-4 flex gap-2">{perguntas.map((q,i)=><span key={q.titulo} className={"h-1.5 flex-1 "+(i<respostas.length?"bg-vinho":"bg-almond-deep")}/>)}</div>
   <div key={respostas.length} className="journey-chapter mt-6">
    {!concluido?<><h3 ref={focus} tabIndex={-1} className="text-3xl leading-tight text-vinho outline-none">{passo.titulo}</h3><p className="mt-2 text-sm text-ink/70">Escolha a opção que mais combina com você.</p><div className="mt-5 grid gap-3">{passo.opcoes.map(opcao=><button key={opcao} type="button" onClick={()=>{interagiu.current=true;setRespostas([...respostas,opcao])}} className="group flex min-h-14 items-center gap-3 border border-khaki-ink/35 px-4 py-3 text-left text-base text-ink transition-colors hover:border-vinho hover:bg-almond focus-visible:border-vinho"><span className="h-3 w-3 shrink-0 rounded-full border border-khaki-ink group-hover:bg-vinho"/>{opcao}</button>)}</div></>:<>
      <h3 ref={focus} tabIndex={-1} className="text-3xl text-vinho outline-none">{protocolo?"Seu interesse foi registrado.":"Seu legado já tem um começo."}</h3>
      <p className="mt-3 text-base leading-relaxed text-ink/75">{protocolo?"A Casa já recebeu suas respostas e seu contato. Aguarde o retorno da equipe editorial.":"Deixe seu contato para que a Casa possa conhecer suas respostas e conversar com você."}</p>
      <details className="mt-5 border border-khaki-ink/30 p-4"><summary className="cursor-pointer font-medium text-vinho">Ver o resumo da conversa</summary><textarea readOnly aria-label="Resumo da sua jornada" value={resumo} className="mt-3 min-h-40 w-full border border-khaki-ink/30 bg-almond p-3 text-sm"/></details>
      {!protocolo?<form onSubmit={registrar} className="mt-5 grid gap-4">
        <label className="text-sm font-medium text-ink">Nome<input required value={nome} onChange={e=>setNome(e.target.value)} maxLength={100} autoComplete="name" className={input}/></label>
        <label className="text-sm font-medium text-ink">Telefone<input type="tel" value={telefone} onChange={e=>setTelefone(e.target.value)} autoComplete="tel" maxLength={30} className={input} placeholder="(41) 99999-9999"/></label>
        <label className="text-sm font-medium text-ink">E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" maxLength={160} className={input}/></label>
        <p className="text-sm text-ink/70">Informe pelo menos um contato: telefone ou e-mail.</p>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/80"><input type="checkbox" required checked={consentimento} onChange={e=>setConsentimento(e.target.checked)} className="mt-1 size-4 accent-vinho"/><span>Autorizo a NobreDNA a registrar minhas respostas e utilizar meus dados de contato para atender esta solicitação.</span></label>
        <button type="submit" disabled={salvando} className="min-h-14 bg-vinho px-4 font-medium text-almond disabled:opacity-50">{salvando?"Registrando…":"Registrar meu interesse"}</button>
      </form>:<div className="mt-5 grid gap-3"><p role="status" className="rounded-lg bg-almond p-4 text-sm break-all">Protocolo: {protocolo}</p><Link href="/livros" className="flex min-h-14 items-center justify-center bg-vinho px-4 text-center font-medium text-almond">Conhecer a livraria</Link></div>}
      {erro&&<p role="alert" className="mt-3 text-sm text-vinho">{erro}</p>}
    </>}
   </div>
   {respostas.length>0&&!protocolo&&<button type="button" disabled={salvando} onClick={()=>{setRespostas(respostas.slice(0,-1));setErro("");tentativa.current=null}} className="mt-5 min-h-11 text-base text-vinho underline underline-offset-4">Voltar uma etapa</button>}
 </div>;
}
