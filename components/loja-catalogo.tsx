"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bag, Minus, Plus } from "@/components/icons";
import { catalogoConsulta, type ObraConsulta } from "@/lib/catalogo-consulta";
import { useConsultationCart } from "@/lib/consultation-cart";

export function ObraCover({obra}:{obra:ObraConsulta}){
 return <div className="editorial-display relative grid aspect-[5/4] place-items-center overflow-hidden rounded-t-[20px] p-5 sm:p-8"><div className="editorial-book"><Image src={obra.imagem} alt={`Capa conceitual de ${obra.titulo}`} width={640} height={960} sizes="(max-width: 767px) 180px, 260px"/></div><span className="absolute bottom-3 right-3 rounded-md bg-almond-lift/95 px-2.5 py-1 text-xs text-ink/80">Capa ilustrativa</span></div>
}
export function ConsultaButton({obra,detail=false}:{obra:ObraConsulta;detail?:boolean}){
 const {add,lines,ready}=useConsultationCart();const [qty,setQty]=useState(1);const existing=lines.find(l=>l.slug===obra.slug)?.qty||0;
 return <div className="space-y-3">
  {detail&&<div className="flex items-center gap-4"><span className="text-sm text-ink/75">Quantidade</span><div className="inline-flex items-center rounded-xl border border-khaki-ink/25"><button type="button" aria-label="Diminuir quantidade" disabled={qty<=1} onClick={()=>setQty(n=>n-1)} className="grid h-11 w-11 place-items-center disabled:opacity-30"><Minus size={15}/></button><span className="w-8 text-center tabular-nums">{qty}</span><button type="button" aria-label="Aumentar quantidade" disabled={qty>=12} onClick={()=>setQty(n=>n+1)} className="grid h-11 w-11 place-items-center disabled:opacity-30"><Plus size={15}/></button></div></div>}
  <button type="button" disabled={!ready||existing>=12} onClick={()=>add(obra.slug,qty)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-vinho px-4 py-3 text-almond disabled:opacity-60"><Bag size={20}/>{existing>=12?"Limite de exemplares atingido":"Adicionar à sacola"}</button>
  {existing>0&&<Link href="/checkout" className="flex min-h-11 items-center justify-center rounded-xl border border-vinho/35 px-4 text-sm text-vinho" aria-live="polite">{existing} {existing===1?"exemplar":"exemplares"} na sacola · Revisar pedido</Link>}
 </div>
}
export function LojaCatalogo(){
 const [search,setSearch]=useState("");const {count}=useConsultationCart();
 const obras=catalogoConsulta.filter(o=>`${o.titulo} ${o.categoria}`.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().includes(search.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().trim()));
 return <section id="catalogo" className="editorial-paper py-12 lg:py-20"><div className="mx-auto max-w-[1180px] px-6 lg:px-10">
 <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="label">a livraria da Casa</p><h2 className="mt-3 text-4xl text-vinho lg:text-5xl">Encontre sua próxima leitura.</h2><p className="mt-3 max-w-xl text-ink/75">Selecione os títulos de interesse e consulte valores e disponibilidade com a equipe editorial.</p></div><Link href="/checkout" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-vinho/30 px-4 text-vinho"><Bag size={20}/> Minha sacola ({count})</Link></div>
 <label className="mt-7 block max-w-md"><span className="sr-only">Buscar livros</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por título ou categoria" className="min-h-12 w-full rounded-xl border border-khaki-ink/30 bg-almond-lift px-4 text-ink"/></label>
 <p className="mt-4 text-sm text-khaki-ink" role="status">{obras.length} {obras.length===1?"título encontrado":"títulos encontrados"}</p>
 <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:max-w-[900px]">{obras.map(obra=><article key={obra.slug} className="editorial-card flex flex-col overflow-hidden"><Link href={`/livros/${obra.slug}`} aria-label={`Ver detalhes de ${obra.titulo}`}><ObraCover obra={obra}/></Link><div className="flex flex-1 flex-col p-5 sm:p-7"><p className="label">{obra.categoria}</p><Link href={`/livros/${obra.slug}`} className="mt-2 text-vinho"><h3 className="text-3xl">{obra.titulo}</h3></Link><p className="mt-3 flex-1 leading-relaxed text-ink/75">{obra.descricao}</p><p className="my-5 border-t border-khaki-ink/20 pt-4 text-sm font-medium text-khaki-ink">Preço e disponibilidade sob consulta</p><ConsultaButton obra={obra}/><Link href={`/livros/${obra.slug}`} className="mt-2 flex min-h-11 items-center justify-center text-sm text-vinho underline underline-offset-4">Ver detalhes do livro</Link></div></article>)}</div>
 {obras.length===0&&<div className="editorial-card mt-5 p-6">Nenhum título encontrado. <button onClick={()=>setSearch("")} className="text-vinho underline">Limpar busca</button></div>}
 <p className="mt-5 text-sm text-ink/65">Capas conceituais para apresentação; os dados comerciais serão confirmados pela Casa.</p></div></section>
}
