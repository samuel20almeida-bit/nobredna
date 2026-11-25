"use client";
import {useRef,useState,type FormEvent} from "react";
import Image from "next/image";
import Link from "next/link";
import {Bag,Minus,Plus} from "@/components/icons";
import {getObra} from "@/lib/catalogo-consulta";
import {useConsultationCart} from "@/lib/consultation-cart";

export function ConsultaCheckout(){
 const {lines,count,ready,setQty}=useConsultationCart();
 const [nome,setNome]=useState(""),[cep,setCep]=useState(""),[telefone,setTelefone]=useState(""),[email,setEmail]=useState("");
 const [consentimento,setConsentimento]=useState(false),[erro,setErro]=useState(""),[salvando,setSalvando]=useState(false),[protocolo,setProtocolo]=useState("");
 const tentativa=useRef<string|null>(null);
 const items=lines.flatMap(line=>{const obra=getObra(line.slug);return obra?[{obra,qty:line.qty}]:[]});
 const digits=cep.replace(/\D/g,"");
 async function registrar(e:FormEvent<HTMLFormElement>){
   e.preventDefault();if(salvando||protocolo)return;setErro("");setSalvando(true);
   try{
     tentativa.current??=crypto.randomUUID();
     const response=await fetch("/api/contato",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:tentativa.current,source:"livros",nome,telefone,email,cep:digits,itens:lines,consentimento})});
     const data=await response.json();if(!response.ok||!data.protocolo)throw Error(data.erro??"Não foi possível registrar.");
     setProtocolo(data.protocolo);
   }catch(error){setErro(error instanceof Error?error.message:"Não foi possível registrar.")}finally{setSalvando(false)}
 }
 if(!ready)return <p role="status" className="text-ink/70">Carregando sua sacola…</p>;
 if(items.length===0)return <div className="editorial-card mx-auto max-w-xl p-8 text-center"><div className="editorial-icon mx-auto"><Bag size={26}/></div><h2 className="mt-4 text-4xl text-vinho">Sua sacola está vazia.</h2><p className="mt-3 leading-relaxed text-ink/75">Escolha um livro e dê o primeiro passo para sua próxima leitura.</p><Link href="/livros#catalogo" className="mt-6 inline-flex min-h-12 items-center bg-vinho px-6 text-almond">Explorar a livraria</Link></div>;
 const input="mt-2 min-h-12 w-full rounded-xl border border-khaki-ink/30 bg-almond-lift px-4";
 return <form onSubmit={registrar} className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
 <div className="space-y-5">
 <section className="editorial-card p-5 sm:p-7"><p className="label">sua seleção</p><h2 className="mt-2 text-3xl text-vinho">Livros na sacola</h2>
 <ul className="mt-4 divide-y divide-khaki-ink/20">{items.map(({obra,qty})=><li key={obra.slug} className="flex gap-4 py-5"><Link href={"/livros/"+obra.slug} className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md"><Image src={obra.imagem} alt={"Capa ilustrativa de "+obra.titulo} fill sizes="64px" className="object-cover"/></Link><div className="min-w-0 flex-1"><Link href={"/livros/"+obra.slug} className="font-serif text-2xl text-vinho">{obra.titulo}</Link><p className="mt-1 text-sm text-ink/65">Preço sob consulta</p>
 {protocolo?<p className="mt-3 text-sm">{qty} exemplar(es)</p>:<div className="mt-3 flex flex-wrap items-center gap-3"><div className="flex items-center rounded-lg border border-khaki-ink/25"><button type="button" aria-label={"Diminuir quantidade de "+obra.titulo} disabled={salvando||qty<=1} onClick={()=>{setQty(obra.slug,qty-1);tentativa.current=null}} className="grid h-11 w-11 place-items-center disabled:opacity-30"><Minus size={15}/></button><span className="w-7 text-center tabular-nums">{qty}</span><button type="button" aria-label={"Aumentar quantidade de "+obra.titulo} disabled={salvando||qty>=12} onClick={()=>{setQty(obra.slug,qty+1);tentativa.current=null}} className="grid h-11 w-11 place-items-center disabled:opacity-30"><Plus size={15}/></button></div><button type="button" disabled={salvando} onClick={()=>{setQty(obra.slug,0);tentativa.current=null}} className="min-h-11 text-sm text-vinho underline">Remover</button></div>}</div></li>)}</ul>
 <Link href="/livros#catalogo" className="inline-flex min-h-11 items-center text-vinho underline">Continuar escolhendo</Link></section>
 {!protocolo&&<section className="editorial-card p-5 sm:p-7"><p className="label">dados para atendimento</p><h2 className="mt-2 text-3xl text-vinho">Como podemos chamar você?</h2><fieldset disabled={salvando} className="grid gap-4 mt-5">
 <label className="block"><span className="text-sm font-medium text-ink">Nome</span><input required autoComplete="name" maxLength={100} value={nome} onChange={e=>setNome(e.target.value)} className={input} placeholder="Seu nome"/></label>
 <label className="block"><span className="text-sm font-medium text-ink">Telefone</span><input type="tel" autoComplete="tel" maxLength={30} value={telefone} onChange={e=>setTelefone(e.target.value)} className={input}/></label>
 <label className="block"><span className="text-sm font-medium text-ink">E-mail</span><input type="email" autoComplete="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} className={input}/></label>
 <p className="text-sm text-ink/65">Informe telefone ou e-mail para que a Casa possa retornar.</p>
 <label className="block"><span className="text-sm font-medium text-ink">CEP (opcional)</span><input autoComplete="postal-code" inputMode="numeric" maxLength={9} value={cep} onChange={e=>setCep(e.target.value.replace(/[^\d-]/g,""))} className={input} placeholder="00000-000"/></label>
 <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/80"><input type="checkbox" required checked={consentimento} onChange={e=>setConsentimento(e.target.checked)} className="mt-1 size-4 accent-vinho"/>Autorizo a NobreDNA a registrar meus dados para atender esta consulta.</label>
 </fieldset></section>}</div>
 <aside className="editorial-card self-start p-5 sm:p-7 lg:sticky lg:top-28"><p className="label">resumo do pedido</p><h2 className="mt-2 text-3xl text-vinho">{count} {count===1?"exemplar":"exemplares"}</h2>
 <dl className="mt-5 space-y-4 border-y border-khaki-ink/20 py-5"><div className="flex justify-between gap-2"><dt>Livros</dt><dd className="text-khaki-ink">A confirmar</dd></div><div className="flex justify-between gap-2"><dt>Frete</dt><dd className="text-khaki-ink">A consultar</dd></div><div className="flex justify-between gap-2 font-medium"><dt>Total</dt><dd className="text-vinho">Sob consulta</dd></div></dl>
 <p className="mt-5 leading-relaxed text-ink/75">A Casa confirmará os valores e a disponibilidade. Nenhum pagamento é efetuado agora.</p>
 {erro&&<p role="alert" className="mt-4 text-sm text-vinho">{erro}</p>}
 {protocolo?<><p role="status" className="mt-5 rounded-lg bg-almond p-4 text-sm break-all"><strong>Consulta registrada!</strong><br/>A Casa recebeu seu pedido de consulta. Aguarde o retorno da equipe.<br/>Protocolo: {protocolo}</p><Link href="/livros" className="mt-5 flex min-h-14 items-center justify-center rounded-xl bg-vinho px-5 py-3 font-medium text-almond">Voltar à livraria</Link></>:<button type="submit" disabled={salvando} className="mt-5 min-h-14 w-full rounded-xl bg-vinho px-5 py-3 font-medium text-almond disabled:opacity-50">{salvando?"Registrando…":"Registrar consulta"}</button>}
 </aside></form>
}
