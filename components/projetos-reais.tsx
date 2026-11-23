import Link from "next/link";

const projetos = [
 {titulo:"Ave Mulher",tipo:"Devocional",detalhe:"Liderança feminina à luz da Bíblia. Um lançamento celebrado pela Casa.",href:"https://instagram.com/p/DRULXj2jnX6",estilo:"book-wine"},
 {titulo:"Noiva Apaixonada",tipo:"Lançamento editorial",detalhe:"Uma ideia que se tornou livro. Conheça o registro desse lançamento.",href:"https://instagram.com/p/Dd4MhDqtZJV",estilo:"book-ivory"},
 {titulo:"Nos bastidores da Casa",tipo:"Processo editorial",detalhe:"Acompanhe o ensaio com Auxiliadora Nobre e o cuidado por trás da produção.",href:"https://instagram.com/p/DXY_p6ADucG",estilo:"book-brown"}
];

export function ProjetosReais() {
 return <section id="acervo" className="bg-almond py-16 lg:py-24">
  <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
   <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="label">a estante da Casa</p><h2 className="mt-4 max-w-[22ch] text-[clamp(2.4rem,5vw,3.75rem)] leading-none">Histórias que se tornaram <em className="text-vinho">legado.</em></h2></div><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Ver mais no Instagram</a></div>
   <div className="mt-9 grid gap-6 md:grid-cols-3">
    {projetos.map((p,i)=><article key={p.titulo} className="group flex flex-col border border-khaki-ink/20 bg-almond-lift">
       <a href={p.href} target="_blank" rel="noreferrer" aria-label={"Conhecer "+p.titulo+" no Instagram"} className="editorial-display relative grid min-h-[280px] place-items-center overflow-hidden bg-almond-deep p-8">
        <div className={"editorial-book "+p.estilo} aria-hidden="true"><div className="editorial-book-frame"><span className="font-serif text-sm italic">NobreDNA</span><span className="text-xl">✦</span><span className="font-serif text-[1.8rem] leading-none">{p.titulo}</span><span className="mt-auto text-[0.65rem] tracking-widest uppercase">Casa de Legados</span></div></div>
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
