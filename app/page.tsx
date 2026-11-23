import { Hero } from "@/components/hero";
import { HelixRail } from "@/components/helix-rail";
import { Portas } from "@/components/portas";
import { ProjetosReais } from "@/components/projetos-reais";
import { JornadaLegado } from "@/components/jornada-legado";
import { Pilares } from "@/components/pilares";
import Link from "next/link";
export default function HomePage() {
  return <><HelixRail side="right"/><div className="relative z-10"><Hero/><Portas/><ProjetosReais/><section className="bg-ink py-20 lg:py-28 text-almond"><div className="mx-auto grid max-w-[1180px] items-center gap-12 px-6 lg:grid-cols-2 lg:px-10"><div><p className="label label-on-dark">o primeiro capítulo</p><h2 className="mt-5 text-[clamp(2.5rem,5vw,4rem)] leading-none">Existe um livro <em className="text-khaki">dentro de você?</em></h2><p className="mt-6 max-w-md text-almond/75 leading-relaxed">Você não precisa dominar todas as técnicas da escrita para começar. Toda história merece ser ouvida. Descubra seu primeiro passo, no seu tempo.</p><Link href="/sobre" className="mt-6 inline-block text-khaki underline underline-offset-4">Conheça Nanda e a missão da Casa</Link></div><JornadaLegado/></div></section><Pilares/><section id="assine" className="bg-almond py-16 text-center"><div className="mx-auto max-w-xl px-6"><p className="label">continue a história</p><h2 className="mt-4 text-4xl">Acompanhe a Casa.</h2><p className="mt-5 text-ink/70">Lançamentos, bastidores e reflexões sobre fé, escrita e legado.</p><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="mt-7 inline-block rounded-full bg-ink px-8 py-4 text-almond">@nobre_dna</a></div></section></div></>;
}
