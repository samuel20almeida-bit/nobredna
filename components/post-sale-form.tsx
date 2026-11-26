"use client";

import {useEffect,useRef,useState} from "react";
import type {FormEvent} from "react";
import Link from "next/link";
import {supportCategories,supportCategoryLabels,validateSupportRequest} from "@/lib/post-sale";

const receiptKey="nobredna-support-receipt";
const input="mt-2 w-full min-h-12 rounded-xl border border-khaki-ink/25 bg-white px-4 py-3 text-sm text-ink transition-colors focus:border-vinho focus:outline-none focus:ring-2 focus:ring-vinho/15";

export function PostSaleForm(){
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[protocol,setProtocol]=useState(""),[copied,setCopied]=useState(false);
  const attempt=useRef<{payload:string;id:string}|null>(null),sending=useRef(false);
  useEffect(()=>{try{const value=sessionStorage.getItem(receiptKey);if(value&&/^ND-S-[0-9A-F]{32}$/.test(value))setProtocol(value)}catch{}},[]);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(sending.current)return;
    const data=new FormData(e.currentTarget);
    const payload={category:data.get("category"),nome:data.get("nome"),email:data.get("email"),telefone:data.get("telefone"),pedido:data.get("pedido"),livro:data.get("livro"),descricao:data.get("descricao"),consentimento:data.get("consentimento")==="on",website:data.get("website")};
    const signature=JSON.stringify(payload);
    if(!attempt.current||attempt.current.payload!==signature)attempt.current={payload:signature,id:crypto.randomUUID()};
    const body={...payload,requestId:attempt.current.id};
    if(!validateSupportRequest(body)){setError("Confira seu nome, e-mail, telefone e assunto. O relato é opcional.");return}
    sending.current=true;setBusy(true);setError("");
    try{
      const result=await fetch("/api/pos-venda",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const response=await result.json();
      if(!result.ok||typeof response.protocolo!=="string")throw new Error(typeof response.erro==="string"?response.erro:"Não foi possível registrar a solicitação.");
      setProtocol(response.protocolo);attempt.current=null;try{sessionStorage.setItem(receiptKey,response.protocolo)}catch{}
    }catch(e){setError(e instanceof Error?e.message:"Não foi possível registrar a solicitação. Tente novamente.")}
    finally{sending.current=false;setBusy(false)}
  }
  if(protocol)return <div className="editorial-card p-6 sm:p-9" role="status"><div className="grid size-12 place-items-center rounded-full bg-vinho/10 text-2xl text-vinho" aria-hidden="true">✓</div><p className="label mt-5">Solicitação registrada</p><h2 className="mt-3 text-4xl text-vinho">Recebemos seu pedido de atendimento.</h2><p className="mt-4 leading-relaxed text-ink/75">A equipe da editora já pode consultar sua solicitação. Guarde o protocolo para acompanhar o atendimento pelo contato informado. A solicitação não executa automaticamente cancelamento, troca ou estorno.</p><div className="mt-6 rounded-xl border border-khaki-ink/20 bg-almond p-4"><p className="text-xs font-semibold uppercase tracking-wider text-khaki-ink">Seu protocolo</p><p className="mt-2 break-all font-mono text-sm font-semibold text-vinho">{protocol}</p><button type="button" className="mt-3 min-h-10 rounded-lg border border-vinho/25 px-4 text-sm font-semibold text-vinho" onClick={async()=>{try{await navigator.clipboard.writeText(protocol);setCopied(true)}catch{setCopied(false)}}}>{copied?"Protocolo copiado!":"Copiar protocolo"}</button></div><p className="mt-4 text-sm leading-relaxed text-ink/70">A equipe enviará uma resposta em até 5 dias, observados os prazos previstos na política.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/trocas" className="inline-flex min-h-11 items-center text-vinho underline">Consultar política</Link><button type="button" onClick={()=>{setProtocol("");setCopied(false);try{sessionStorage.removeItem(receiptKey)}catch{}}} className="min-h-11 text-sm font-semibold text-vinho">Registrar outra solicitação</button></div></div>;
  return <form onSubmit={submit} className="editorial-card p-5 sm:p-8" aria-busy={busy}>
    <p className="label">Atendimento online</p><h2 className="mt-3 text-3xl text-vinho">Como podemos ajudar?</h2><p className="mt-3 text-sm leading-relaxed text-ink/70">Preencha seus dados para a equipe localizar a compra e responder. Não envie senhas, dados do cartão ou dados bancários.</p>
    <fieldset disabled={busy} className="mt-6 space-y-5 disabled:opacity-70">
      <label className="block text-sm font-semibold text-ink">Assunto<select name="category" required defaultValue="" className={input}><option value="" disabled>Selecione o motivo do atendimento</option>{supportCategories.map(c=><option key={c} value={c}>{supportCategoryLabels[c]}</option>)}</select></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-ink sm:col-span-2">Nome completo<input name="nome" autoComplete="name" maxLength={100} minLength={2} required className={input}/></label><label className="block text-sm font-semibold text-ink">E-mail para resposta<input name="email" type="email" autoComplete="email" maxLength={160} required className={input}/></label><label className="block text-sm font-semibold text-ink">Telefone (opcional)<input name="telefone" type="tel" autoComplete="tel" maxLength={30} className={input}/></label><label className="block text-sm font-semibold text-ink">Número do pedido (se tiver)<input name="pedido" maxLength={100} className={input} placeholder="No recibo de compra"/></label><label className="block text-sm font-semibold text-ink">Título do livro (opcional)<input name="livro" maxLength={160} className={input}/></label></div>
      <label className="block text-sm font-semibold text-ink">Conte o que aconteceu (opcional)<textarea name="descricao" rows={4} maxLength={2000} className={input+" resize-y"} placeholder="Se desejar, descreva o problema e o que gostaria de solicitar."/></label>
      <p className="text-xs leading-relaxed text-ink/65">Não é necessário justificar uma desistência. Se houver fotos do livro, a equipe poderá pedir que sejam enviadas pelo canal oficial.</p>
      <div className="absolute size-px overflow-hidden opacity-0" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/75"><input name="consentimento" type="checkbox" required className="mt-1 size-5 shrink-0 accent-vinho"/>Autorizo o registro dos meus dados para identificar a compra e atender esta solicitação.</label>
    </fieldset>
    {error&&<p role="alert" className="mt-5 rounded-xl bg-vinho/5 p-3 text-sm text-vinho">{error}</p>}
    <button disabled={busy} className="mt-6 flex min-h-14 w-full items-center justify-center rounded-xl bg-vinho px-5 py-3 font-semibold text-almond hover:bg-vinho-soft disabled:opacity-50" type="submit">{busy?"Registrando solicitação…":"Enviar solicitação"}</button><p className="mt-3 text-center text-xs text-ink/65">Você recebe o protocolo nesta tela, sem sair do site.</p>
  </form>;
}
