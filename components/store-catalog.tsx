"use client";
import {useState} from "react";
import Link from "next/link";
import {Bag} from "@/components/icons";
import {formatBRL} from "@/lib/format";
import {useStoreCart} from "@/lib/store-cart";
import type {StoreBook} from "@/lib/store-types";

export function StoreCatalog({books}:{books:StoreBook[]}){
 const cart=useStoreCart(),[search,setSearch]=useState("");
 const normalize=(s:string)=>s.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().trim();
 const filtered=books.filter(b=>normalize(`${b.title} ${b.author}`).includes(normalize(search)));
 return <section id="catalogo" className="editorial-paper py-12 lg:py-20"><div className="mx-auto max-w-[1180px] px-6 lg:px-10">
 <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="label">a livraria da Casa</p><h2 className="mt-3 text-4xl text-vinho lg:text-5xl">Encontre sua próxima leitura.</h2><p className="mt-3 text-ink/75">Escolha seus exemplares e calcule a entrega antes de pagar.</p></div><Link href="/checkout" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-vinho/30 px-4 text-vinho"><Bag size={20}/> Minha sacola ({cart.count})</Link></div>
 <label className="mt-7 block max-w-md"><span className="sr-only">Buscar livros</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por título ou autora" className="min-h-12 w-full rounded-xl border border-khaki-ink/30 bg-white px-4"/></label>
 <p className="mt-4 text-sm text-khaki-ink" role="status">{filtered.length} {filtered.length===1?"título encontrado":"títulos encontrados"}</p>
 <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(b=>{const qty=cart.lines.find(l=>l.slug===b.slug)?.qty??0;return <article key={b.slug} className="editorial-card flex flex-col overflow-hidden"><div className="editorial-display grid aspect-[5/4] place-items-center p-7"><img src={b.cover_url} alt={`Capa de ${b.title}`} loading="lazy" referrerPolicy="no-referrer" className="max-h-64 w-auto max-w-full rounded-sm object-contain shadow-book"/></div><div className="flex flex-1 flex-col p-5 sm:p-7"><p className="label">{b.author}</p><h3 className="mt-2 text-3xl text-vinho">{b.title}</h3><details className="mt-3"><summary className="cursor-pointer text-vinho underline underline-offset-4">Sobre o livro</summary><p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">{b.description}</p>{b.isbn&&<p className="mt-2 text-sm text-ink/70">ISBN {b.isbn}</p>}</details><div className="mt-auto pt-6"><p className="text-xl font-medium text-vinho">{formatBRL(b.price_cents)}</p><p className="mt-1 text-sm text-ink/75">{b.stock>0?"Disponível":"Esgotado"}</p><button disabled={!cart.ready||b.stock===0||qty>=b.stock||cart.count>=30} onClick={()=>cart.add(b.slug,b.stock)} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-vinho px-4 text-almond disabled:opacity-50"><Bag size={20}/>{b.stock===0?"Esgotado":qty>=b.stock?"Limite disponível atingido":"Adicionar à sacola"}</button>{qty>0&&<Link href="/checkout" className="mt-2 block py-2 text-center text-sm text-vinho underline" aria-live="polite">{qty} na sacola · Revisar pedido</Link>}</div></div></article>})}</div>
 {filtered.length===0&&<div className="editorial-card mt-5 p-6">{books.length===0?"A Casa está organizando os próximos títulos da livraria.":"Nenhum título encontrado."}{search&&<button className="ml-3 text-vinho underline" onClick={()=>setSearch("")}>Limpar busca</button>}</div>}
 </div></section>
}
