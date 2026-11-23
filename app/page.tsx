import { Hero } from "@/components/hero";
import { ProjetosReais } from "@/components/projetos-reais";
import { JornadaLegado } from "@/components/jornada-legado";
import Image from "next/image";
import { autora } from "@/lib/autora";
import Link from "next/link";

export default function HomePage() {
 return <>
  <Hero/>
  <section className="border-y border-khaki-ink/20 bg-almond-lift">
   <div className="mx-auto grid max-w-[1180px] divide-y divide-khaki-ink/20 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
    {[["Obras autorais","Descubra os livros e lançamentos.","/livros"],["Coautorias","Escreva ao lado de outras vozes.","/coautorias"],["Projetos editoriais","Transforme sua ideia em livro.","/publique"]].map(([title,sub,href])=><Link key={href} href={href} className="group py-5 transition-colors hover:bg-almond sm:p-7"><h2 className="text-2xl text-vinho">{title}</h2><p className="mt-1 text-base text-ink/70">{sub}</p><span className="mt-3 inline-block border-b border-khaki-ink text-sm text-khaki-ink">Conhecer</span></Link>)}
   </div>
  </section>
  <ProjetosReais/>
  <section className="bg-almond-lift py-12 lg:py-24">
   <div className="mx-auto grid max-w-[1180px] gap-7 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-10 lg:px-10">
    <figure className="relative mx-auto aspect-square w-full max-w-[220px] rounded-full border border-khaki/60 bg-almond p-2 shadow-book md:max-w-[380px]"><div className="relative h-full w-full overflow-hidden rounded-full"><Image src="/brand/nanda-retrato-inicio.webp" alt="Nanda Almeida, escritora e fundadora da NobreDNA" fill sizes="(max-width: 767px) 220px, 380px" className="object-cover"/></div></figure>
    <div><p className="label">uma carta da fundadora</p><h2 className="mt-4 text-[clamp(2.4rem,5vw,3.75rem)] leading-none">Antes de existir um livro, <em className="text-vinho">existe uma vida.</em></h2><p className="mt-6 text-lg leading-relaxed text-ink/80">{autora.bio[0]}</p><p className="mt-5 font-serif text-2xl italic text-vinho">{autora.nome}</p><p className="text-sm text-ink/65">Fundadora da NobreDNA</p><Link href="/sobre" className="mt-6 inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Conheça nossa história</Link></div>
   </div>
  </section>
  <section className="bg-almond py-16 lg:py-24"><div className="mx-auto max-w-[1180px] px-6 lg:px-10"><p className="label">do manuscrito à publicação</p><h2 className="mt-4 text-4xl lg:text-5xl">O seu livro, um capítulo de cada vez.</h2><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[["Escuta","Uma conversa para compreender sua história."],["Estrutura","Organização das ideias e do projeto."],["Cuidado editorial","Revisão e identidade visual da obra."],["Publicação","Planejamento para levar seu livro ao mundo."]].map(([t,d])=><article key={t} className="border-t-2 border-khaki-ink/45 pt-5"><h3 className="text-3xl text-vinho">{t}</h3><p className="mt-3 text-ink/75 leading-relaxed">{d}</p></article>)}</div><Link href="/publique" className="mt-9 inline-flex min-h-12 items-center bg-vinho px-7 py-3 font-serif text-xl text-almond hover:bg-vinho-soft">Conhecer o processo editorial</Link></div></section>
  <section className="bg-vinho py-16 text-almond lg:py-24"><div className="mx-auto grid max-w-[1180px] gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-10"><div><p className="label label-on-vinho">o primeiro capítulo</p><h2 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] leading-none">Existe um livro <em className="text-khaki">dentro de você?</em></h2><p className="mt-5 max-w-md leading-relaxed text-almond/85">Responda três perguntas para descobrir como iniciar sua jornada. Você não precisa ter um manuscrito pronto.</p></div><JornadaLegado/></div></section>
  <section className="bg-almond-lift py-16 text-center lg:py-24"><div className="mx-auto max-w-3xl px-6"><p className="label">a essência da Casa</p><h2 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] italic text-vinho">“Se o Senhor não edificar a casa, em vão trabalham os que a edificam.”</h2><p className="mt-4 text-khaki-ink">Salmo 127:1</p><p className="mt-7 text-ink/75">Fé, verdade, excelência, beleza, cuidado, legado e serviço.</p><Link href="/sobre#pilares" className="mt-6 inline-block border-b border-vinho pb-1 text-vinho">Leia o manifesto da Casa</Link></div></section>
  <section id="assine" className="bg-ink py-16 text-center text-almond"><div className="mx-auto max-w-xl px-6"><p className="label label-on-dark">continue a história</p><h2 className="mt-4 text-4xl">Vamos escrever o próximo capítulo?</h2><div className="mt-7 flex flex-wrap justify-center gap-4"><Link href="/publique" className="inline-flex min-h-12 items-center bg-almond px-7 py-3 text-vinho">Quero publicar</Link><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center border border-khaki/60 px-7 py-3 text-almond">@nobre_dna</a></div></div></section>
 </>;
}
