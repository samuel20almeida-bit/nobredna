"use client";
import {useEffect,useRef,useState,type FormEvent} from "react";
import Image from "next/image";
import Link from "next/link";
import {Bag,Minus,Plus} from "@/components/icons";
import {getObra} from "@/lib/catalogo-consulta";
import {useConsultationCart} from "@/lib/consultation-cart";
import {LeadReceipt} from "./lead-receipt";

const stages=["Sacola","Seus dados","Revisão","Confirmado"];
const receiptKey="nobredna:ultimo-protocolo-v1";
const input="mt-2 min-h-12 w-full rounded-xl border border-khaki-ink/30 bg-white px-4 focus:border-vinho";

export function CheckoutSteps({step,live=false}:{step:number;live?:boolean}){
 const labels=live?["Sacola","Entrega","Pagamento","Confirmação"]:stages;
 return <ol aria-label="Etapas da jornada" className="mb-6 grid grid-cols-4 gap-1.5 rounded-2xl border border-khaki-ink/20 bg-almond-lift p-3 sm:gap-4 sm:p-5">{labels.map((label,i)=><li key={label} aria-current={i===step?"step":undefined} className="min-w-0 text-center"><span className={"mx-auto grid size-8 place-items-center rounded-full text-xs font-semibold "+(i<=step?"bg-vinho text-white":"bg-almond-deep text-ink/55")}>{i<step?"✓":i+1}</span><span className={"mt-2 block text-[10px] leading-tight sm:text-sm "+(i===step?"font-semibold text-vinho":"text-ink/65")}>{label}</span></li>)}</ol>;
}

export function ConsultaCheckout(){
 const {lines,count,ready,setQty,clear}=useConsultationCart();
 const [step,setStep]=useState(0),[nome,setNome]=useState(""),[cep,setCep]=useState(""),[telefone,setTelefone]=useState(""),[email,setEmail]=useState("");
 const [consentimento,setConsentimento]=useState(false),[erro,setErro]=useState(""),[salvando,setSalvando]=useState(false),[protocolo,setProtocolo]=useState("");
 const tentativa=useRef<{id:string;payload:string}|null>(null),heading=useRef<HTMLHeadingElement>(null),interagiu=useRef(false);
 const items=lines.flatMap(line=>{const obra=getObra(line.slug);return obra?[{obra,qty:line.qty}]:[]});
 const digits=cep.replace(/\D/g,"");
 useEffect(()=>{if(!ready)return;try{if(count>0)sessionStorage.removeItem(receiptKey);else{const saved=sessionStorage.getItem(receiptKey);if(saved&&/^ND-[A-F0-9]{32}$/.test(saved))setProtocolo(saved)}}catch{}},[ready,count]);
 useEffect(()=>{if(interagiu.current){heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:"start",behavior:"instant"})}},[step,protocolo]);
 function go(next:number){interagiu.current=true;setErro("");setStep(next)}
 async function handle(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(salvando||protocolo)return;setErro("");
   if(step===0){if(items.length)go(1);return}
   if(step===1){
    if(nome.trim().length<2||(!email.trim()&&!telefone.trim())||(telefone.trim()&&!/^\d{10,13}$/.test(telefone.replace(/\D/g,"")))||(digits&&!/^\d{8}$/.test(digits))){setErro("Confira seu nome, o contato e o CEP informado.");return;}
    go(2);return;
   }
   if(!consentimento||!items.length){setErro("Revise sua seleção e autorize o registro para continuar.");return}
   setSalvando(true);
   try{
     const payload=JSON.stringify({source:"livros",nome,telefone,email,cep:digits,itens:lines,consentimento});
     if(!tentativa.current||tentativa.current.payload!==payload)tentativa.current={id:crypto.randomUUID(),payload};
     const response=await fetch("/api/contato",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...JSON.parse(payload),requestId:tentativa.current.id})});
     const data=await response.json();if(!response.ok||!data.protocolo)throw Error(data.erro??"Não foi possível registrar.");
     try{sessionStorage.setItem(receiptKey,data.protocolo)}catch{}
     interagiu.current=true;setProtocolo(data.protocolo);clear();
   }catch(error){setErro(error instanceof Error?error.message:"Não foi possível registrar. Tente novamente.")}finally{setSalvando(false)}
 }
 if(protocolo)return <div className="mx-auto max-w-2xl"><CheckoutSteps step={3}/><LeadReceipt protocol={protocolo} book/></div>;
 if(!ready)return <p role="status" className="text-ink/70">Carregando sua sacola…</p>;
 if(items.length===0)return <div className="editorial-card mx-auto max-w-xl p-8 text-center"><div className="editorial-icon mx-auto"><Bag size={26}/></div><h2 className="mt-4 text-4xl text-vinho">Sua sacola está vazia.</h2><p className="mt-3 leading-relaxed text-ink/75">Escolha um livro para solicitar sua compra à Casa.</p><Link href="/livros#catalogo" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-vinho px-6 text-almond">Explorar a livraria</Link></div>;
 return <><CheckoutSteps step={step}/><form onSubmit={handle} className="grid gap-5 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
 <div className="editorial-card p-5 sm:p-7">
  <p className="text-xs font-semibold uppercase tracking-widest text-khaki-ink">Etapa {step+1} de 3</p>
  <h2 ref={heading} tabIndex={-1} className="mt-2 scroll-mt-24 text-3xl text-vinho outline-none">{["Livros na sacola","Seus dados para contato","Revise sua solicitação de compra"][step]}</h2>
  {step===0?<><p className="mt-2 text-sm leading-relaxed text-ink/70">Confira os títulos e a quantidade antes de continuar.</p><ul className="mt-5 divide-y divide-khaki-ink/20">{items.map(({obra,qty})=><li key={obra.slug} className="flex gap-4 py-5"><Link href={"/livros/"+obra.slug} className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md"><Image src={obra.imagem} alt={"Capa ilustrativa de "+obra.titulo} fill sizes="64px" className="object-cover"/></Link><div className="min-w-0 flex-1"><Link href={"/livros/"+obra.slug} className="font-serif text-2xl text-vinho">{obra.titulo}</Link><p className="mt-1 text-sm text-ink/65">Preço sob consulta</p><div className="mt-3 flex flex-wrap items-center gap-3"><div className="flex items-center rounded-lg border border-khaki-ink/25"><button type="button" aria-label={"Diminuir quantidade de "+obra.titulo} disabled={qty<=1} onClick={()=>setQty(obra.slug,qty-1)} className="grid h-11 w-11 place-items-center disabled:opacity-30"><Minus size={15}/></button><span className="w-7 text-center tabular-nums">{qty}</span><button type="button" aria-label={"Aumentar quantidade de "+obra.titulo} disabled={qty>=12} onClick={()=>setQty(obra.slug,qty+1)} className="grid h-11 w-11 place-items-center disabled:opacity-30"><Plus size={15}/></button></div><button type="button" onClick={()=>setQty(obra.slug,0)} className="min-h-11 text-sm text-vinho underline">Remover</button></div></div></li>)}</ul><Link href="/livros#catalogo" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-vinho underline">Continuar escolhendo</Link></>:step===1?<><p className="mt-3 text-sm leading-relaxed text-ink/70">A equipe usará estes dados para confirmar os valores, disponibilidade e a entrega.</p><fieldset className="mt-5 grid gap-4 sm:grid-cols-2">
  <label className="block sm:col-span-2"><span className="text-sm font-medium">Nome completo</span><input required autoComplete="name" maxLength={100} value={nome} onChange={e=>setNome(e.target.value)} className={input} placeholder="Seu nome"/></label>
  <label className="block"><span className="text-sm font-medium">E-mail</span><input type="email" autoComplete="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} className={input} placeholder="voce@exemplo.com"/></label>
  <label className="block"><span className="text-sm font-medium">Telefone</span><input type="tel" autoComplete="tel" maxLength={30} value={telefone} onChange={e=>setTelefone(e.target.value)} className={input} placeholder="(41) 99999-9999"/></label>
  <p className="text-xs text-ink/65 sm:col-span-2">Informe pelo menos um contato válido: e-mail ou telefone.</p>
  <label className="block"><span className="text-sm font-medium">CEP de entrega (opcional)</span><input autoComplete="postal-code" inputMode="numeric" maxLength={9} value={cep} onChange={e=>setCep(e.target.value.replace(/[^\d-]/g,""))} className={input} placeholder="00000-000"/></label>
 </fieldset></>:<><p className="mt-3 text-sm leading-relaxed text-ink/70">Revise seus dados. Ao confirmar, a solicitação será enviada diretamente à equipe editorial.</p><div className="mt-5 rounded-xl border border-khaki-ink/20 bg-almond p-4"><div className="flex justify-between gap-2"><p className="text-sm font-semibold text-vinho">Sua seleção</p><button type="button" disabled={salvando} onClick={()=>go(0)} className="text-sm font-medium text-vinho underline">Editar</button></div><ul className="mt-3 space-y-2 text-sm">{items.map(({obra,qty})=><li key={obra.slug}>{qty} × {obra.titulo}</li>)}</ul></div><div className="mt-4 rounded-xl border border-khaki-ink/20 bg-almond p-4"><div className="flex justify-between gap-2"><p className="text-sm font-semibold text-vinho">Contato</p><button type="button" disabled={salvando} onClick={()=>go(1)} className="text-sm font-medium text-vinho underline">Editar</button></div><p className="mt-3 break-words text-sm">{nome}</p>{email&&<p className="break-all text-sm">{email}</p>}{telefone&&<p className="text-sm">{telefone}</p>}{cep&&<p className="mt-2 text-sm">CEP: {cep}</p>}</div>
 <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ink/80"><input type="checkbox" required disabled={salvando} checked={consentimento} onChange={e=>setConsentimento(e.target.checked)} className="mt-1 size-5 shrink-0 accent-vinho"/>Autorizo a NobreDNA a registrar meus dados para atender esta solicitação de compra.</label></>}
 {erro&&<p role="alert" className="mt-5 rounded-xl border border-vinho/20 bg-vinho/5 p-3 text-sm text-vinho">{erro}</p>}
 {step>0&&<button type="button" disabled={salvando} onClick={()=>go(step-1)} className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-vinho underline">← Voltar uma etapa</button>}
 </div>
 <aside className="editorial-card self-start p-5 sm:p-7 lg:sticky lg:top-28"><p className="label">resumo da solicitação</p><h2 className="mt-2 text-3xl text-vinho">{count} {count===1?"exemplar":"exemplares"}</h2><dl className="mt-5 space-y-3 border-y border-khaki-ink/20 py-4 text-sm"><div className="flex justify-between gap-2"><dt>Livros</dt><dd>A confirmar</dd></div><div className="flex justify-between gap-2"><dt>Frete</dt><dd>A consultar</dd></div><div className="flex justify-between gap-2 font-semibold text-vinho"><dt>Total</dt><dd>Sob consulta</dd></div></dl>
 <div className="mt-4 rounded-xl bg-almond p-4 text-sm"><strong className="text-vinho">Você não paga agora.</strong><p className="mt-2 leading-relaxed text-ink/75">A editora recebe sua solicitação de compra no painel e retorna pelo contato informado para confirmar valores e combinar a compra.</p></div>
 <button type="submit" disabled={salvando} className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-vinho px-5 py-3 font-semibold text-almond hover:bg-vinho-soft disabled:opacity-50">{salvando?"Registrando…":["Continuar para contato","Revisar solicitação","Solicitar compra"][step]} <span aria-hidden="true">→</span></button>
 <p className="mt-3 text-center text-xs text-ink/60">{step<2?"Você poderá revisar antes de enviar.":"Após enviar, você receberá um protocolo nesta tela."}</p>
 </aside></form></>;
}
