import Link from "next/link";

const projetos = [
  { titulo: "Ave Mulher", tipo: "Devocional", detalhe: "Liderança feminina à luz da Bíblia. Um lançamento celebrado pela Casa.", href: "https://instagram.com/p/DRULXj2jnX6", cor: "bg-vinho" },
  { titulo: "Noiva Apaixonada", tipo: "Lançamento editorial", detalhe: "Uma ideia que se tornou livro. Conheça o registro desse lançamento.", href: "https://instagram.com/p/Dd4MhDqtZJV", cor: "bg-ink" },
  { titulo: "Nos bastidores da Casa", tipo: "Processo editorial", detalhe: "O cuidado por trás de cada história: acompanhe o ensaio com Auxiliadora Nobre.", href: "https://instagram.com/p/DXY_p6ADucG", cor: "bg-lavender-ink" },
];

export function ProjetosReais() {
  return <section id="acervo" className="bg-almond py-20 lg:py-28">
    <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
      <p className="label">histórias da Casa</p>
      <h2 className="mt-4 max-w-[22ch] text-[clamp(2.2rem,5vw,3.5rem)] leading-tight">Histórias que se tornaram <em className="text-lavender-ink">legado.</em></h2>
      <p className="mt-5 max-w-[38rem] text-ink/70 leading-relaxed">Cada projeto nasce de uma história humana. Conheça alguns momentos compartilhados pela NobreDNA.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {projetos.map((p) => <article key={p.titulo} className="overflow-hidden border border-ink/15 bg-almond-lift">
          <div className={`${p.cor} grain relative grid min-h-[230px] place-items-center overflow-hidden px-8 text-center text-almond`}>
            <div className="absolute inset-5 border border-almond/20" aria-hidden="true" />
            <div className="relative"><span className="font-serif italic text-almond/70">NobreDNA · Casa de Legados</span><h3 className="mt-4 text-4xl leading-tight">{p.titulo}</h3><span className="mt-5 block text-khaki">✦</span></div>
          </div>
          <div className="p-7"><p className="label">{p.tipo}</p><p className="mt-3 text-ink/75 leading-relaxed">{p.detalhe}</p><a href={p.href} target="_blank" rel="noreferrer" className="mt-6 inline-block border-b border-lavender-ink font-serif text-xl text-lavender-ink">Ver no Instagram</a></div>
        </article>)}
      </div>
      <div className="mt-10 flex flex-wrap gap-5"><Link href="/coautorias" className="rounded-full bg-ink px-7 py-3 text-almond font-serif text-lg">Conhecer coautorias</Link><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="px-4 py-3 font-serif text-xl text-lavender-ink">Acompanhar a Casa</a></div>
    </div>
  </section>;
}
