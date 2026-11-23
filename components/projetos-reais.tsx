import Link from "next/link";
import Image from "next/image";

const projetos = [
 {titulo:"Ave Mulher",tipo:"Devocional",detalhe:"Liderança feminina à luz da Bíblia. Um lançamento celebrado pela Casa.",href:"https://instagram.com/p/DRULXj2jnX6",imagem:"/brand/ave-mulher.webp",livro:true},
 {titulo:"Noiva Apaixonada",tipo:"Lançamento editorial",detalhe:"Uma ideia que se tornou livro. Conheça o registro desse lançamento.",href:"https://instagram.com/p/Dd4MhDqtZJV",imagem:"/brand/noiva-apaixonada.webp",livro:true},
 {titulo:"Nos bastidores da Casa",tipo:"Processo editorial",detalhe:"Acompanhe o ensaio com Auxiliadora Nobre e o cuidado por trás da produção.",href:"https://instagram.com/p/DXY_p6ADucG",imagem:"/brand/bastidores.webp",livro:false}
];

export function ProjetosReais() {
 return <section id="acervo" className="bg-almond py-16 lg:py-24">
  <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
   <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="label">a estante da Casa</p><h2 className="mt-4 max-w-[22ch] text-[clamp(2.4rem,5vw,3.75rem)] leading-none">Histórias que se tornaram <em className="text-vinho">legado.</em></h2></div><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Ver mais no Instagram</a></div>
   <p className="mt-6 text-sm text-khaki-ink md:hidden">Deslize para explorar os projetos</p>
   <div className="mobile-projects -mx-6 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:mt-9 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0" aria-label="Projetos editoriais">
    {projetos.map((p,i)=><article key={p.titulo} className="editorial-card group flex w-[min(79vw,340px)] shrink-0 snap-start flex-col overflow-hidden md:w-auto">
       <a href={p.href} target="_blank" rel="noreferrer" aria-label={"Conhecer "+p.titulo+" no Instagram"} className={`editorial-display relative grid min-h-[275px] place-items-center overflow-hidden bg-almond-deep md:min-h-[345px] ${p.livro?"p-6 md:p-8":""}`}>
        {p.livro ? <div className="editorial-book"><Image src={p.imagem} alt={`Capa conceitual de ${p.titulo}`} width={640} height={960} unoptimized /></div> : <Image src={p.imagem} alt="Composição editorial ilustrativa com livros e manuscritos" fill unoptimized sizes="(max-width: 767px) 100vw, 33vw" className="object-cover object-center" />}
        <span className="absolute bottom-3 right-3 bg-almond-lift/95 px-2 py-1 text-xs text-ink/80">{i===2?"Composição ilustrativa":"Capa conceitual"}</span>
       </a>
       <div className="flex flex-1 flex-col p-6"><p className="label">{p.tipo}</p><h3 className="mt-2 text-3xl text-vinho">{p.titulo}</h3><p className="mt-3 flex-1 text-base leading-relaxed text-ink/75">{p.detalhe}</p><a href={p.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 items-center justify-center border border-vinho px-5 py-2 text-base text-vinho transition-colors hover:bg-vinho hover:text-almond">Conhecer projeto</a></div>
    </article>)}
   </div>
   <p className="mt-5 text-sm text-ink/65">Projetos apresentados no perfil da Casa. As imagens acima são composições conceituais, não capas oficiais.</p>
   <Link href="/coautorias" className="mt-7 inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Descubra também as coautorias</Link>
  </div>
 </section>;
}
