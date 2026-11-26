import type { Metadata } from "next";
import { JornadaLegado } from "@/components/jornada-legado";
import { DivisorPerola } from "@/components/perola";
export const metadata: Metadata = { title: "Coautorias", description: "Conheça a possibilidade de escrever uma obra coletiva com a NobreDNA, Casa de Legados." };
export default function CoautoriasPage() {
  return <>
    <section className="grain relative bg-almond pt-25 pb-12 lg:pt-36 lg:pb-20">
      <div className="relative mx-auto max-w-[1180px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div><p className="label">escrever em companhia</p><h1 className="mt-4 max-w-[19ch] text-[clamp(2.8rem,6vw,5.5rem)] leading-none">Muitas vozes. <em className="text-vinho">Um legado.</em></h1><p className="mt-5 max-w-[40rem] text-base leading-relaxed text-ink/75 sm:text-lg">Uma coautoria reúne histórias em torno de um propósito compartilhado. Escreva com outras pessoas, preservando sua própria voz.</p><a href="#jornada" className="mt-6 inline-flex min-h-14 items-center justify-center rounded-xl bg-vinho px-6 text-center font-semibold text-almond">Tenho interesse em coautoria <span aria-hidden="true" className="ml-3">→</span></a><p className="mt-3 text-xs text-khaki-ink">Manifestação de interesse sem compromisso.</p></div>
          <div className="editorial-letter rounded-2xl p-7 sm:p-10"><p className="label">uma obra, muitas histórias</p><DivisorPerola tone="light" className="my-5" width="180px"/><p className="font-serif text-[clamp(2rem,4vw,3rem)] italic leading-tight text-vinho">Sua voz não precisa caminhar sozinha.</p><p className="mt-5 text-sm leading-relaxed text-ink/70">Cada história tem lugar em um livro construído com cuidado, propósito e apoio editorial.</p></div>
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-3">{[["01","O encontro","Conheça o tema e converse com a Casa."],["02","Sua voz","Compartilhe sua história e descubra como pode contribuir."],["03","A obra","Entenda o percurso editorial e a publicação coletiva."]].map(([n,t,d])=><article key={n} className="editorial-card p-6"><span className="text-xs font-semibold tracking-widest text-khaki-ink">ETAPA {n}</span><h2 className="mt-3 text-3xl text-vinho">{t}</h2><p className="mt-2 text-sm leading-relaxed text-ink/75">{d}</p></article>)}</div>
      </div>
    </section>
    <section id="jornada" className="scroll-mt-20 bg-ink py-12 text-almond lg:py-20"><div className="mx-auto grid max-w-[1180px] gap-8 px-6 lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-10"><div><p className="label label-on-dark">manifestação de interesse</p><h2 className="mt-4 text-4xl">Quer saber sobre futuras coautorias?</h2><p className="mt-5 leading-relaxed text-almond/80">Conheça os próximos projetos, a seleção e as condições de participação. As vagas e datas serão informadas pela equipe editorial.</p><p className="mt-4 text-sm text-khaki">Responda três perguntas rápidas e deixe seu contato.</p></div><JornadaLegado coautoria/></div></section>
  </>;
}
