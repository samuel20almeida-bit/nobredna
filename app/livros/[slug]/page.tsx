import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogoConsulta,getObra } from "@/lib/catalogo-consulta";
import { ConsultaButton,ObraCover } from "@/components/loja-catalogo";
type Params={params:Promise<{slug:string}>};
export function generateStaticParams(){return catalogoConsulta.map(o=>({slug:o.slug}))}
export async function generateMetadata({params}:Params):Promise<Metadata>{const obra=getObra((await params).slug);return {title:obra?.titulo||"Livro não encontrado",description:obra?.descricao}}
export default async function ObraPage({params}:Params){
 const obra=getObra((await params).slug);if(!obra)notFound();
 return <section className="editorial-paper pt-24 pb-16 lg:pt-32 lg:pb-24"><div className="mx-auto max-w-[1100px] px-6 lg:px-10"><Link href="/livros#catalogo" className="inline-flex min-h-11 items-center text-vinho underline underline-offset-4">Voltar à livraria</Link><div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16"><div className="editorial-card overflow-hidden"><ObraCover obra={obra}/></div><div><p className="label">{obra.categoria}</p><h1 className="mt-3 text-[clamp(3rem,6vw,5rem)] leading-none text-vinho">{obra.titulo}</h1><p className="mt-5 text-lg leading-relaxed text-ink/75">{obra.descricao}</p><div className="editorial-card mt-7 p-5 sm:p-7"><p className="label">exemplares</p><h2 className="mt-2 text-3xl text-vinho">Preço sob consulta</h2><p className="mt-3 text-sm leading-relaxed text-ink/75">A equipe informará disponibilidade, edição, preço e frete. Nenhuma cobrança será realizada pelo site neste momento.</p><div className="mt-5"><ConsultaButton obra={obra} detail/></div></div><a href={obra.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center text-vinho underline underline-offset-4">Ver lançamento no Instagram</a></div></div></div></section>
}
