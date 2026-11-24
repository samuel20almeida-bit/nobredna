import { Hero } from "@/components/hero";
import { ProjetosReais } from "@/components/projetos-reais";
import { JornadaLegado } from "@/components/jornada-legado";
import { EditorialTimeline, EditorialFaq } from "@/components/editorial-journey";
import Image from "next/image";
import { autora } from "@/lib/autora";
import Link from "next/link";
import { BrandSeal } from "@/components/brand-seal";
import { Spines, Quill, Seal } from "@/components/icons";
import { PearlSectionDivider, DivisorPerola } from "@/components/perola";

export default function HomePage() {
 return <>
  <Hero/>
  <section className="editorial-paper py-9 lg:py-14">
   <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
    <p className="label text-center">encontre seu lugar nesta Casa</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-5">
    {[{title:"Obras autorais",sub:"Descubra os livros e lançamentos.",href:"/livros",Icon:Spines},{title:"Coautorias",sub:"Escreva ao lado de outras vozes.",href:"/coautorias",Icon:Seal},{title:"Projetos editoriais",sub:"Transforme sua ideia em livro.",href:"/publique",Icon:Quill}].map(({title,sub,href,Icon})=><Link key={href} href={href} className="editorial-card group flex items-center gap-4 p-5 sm:block sm:p-7"><span className="editorial-icon"><Icon size={27}/></span><div><h2 className="text-2xl text-vinho sm:mt-4">{title}</h2><p className="mt-1 text-base text-ink/70">{sub}</p><span className="mt-3 inline-block border-b border-khaki-ink text-sm text-khaki-ink">Conhecer</span></div></Link>)}
    </div>
   </div>
  </section>
  <PearlSectionDivider/>
  <ProjetosReais/>
  <PearlSectionDivider/>
  <section className="editorial-paper py-12 lg:py-24">
   <div className="mx-auto grid max-w-[1180px] gap-7 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-10 lg:px-10">
    <figure className="relative mx-auto aspect-square w-full max-w-[220px] rounded-full border border-khaki/60 bg-almond p-2 shadow-book md:max-w-[380px]"><div className="relative h-full w-full overflow-hidden rounded-full"><Image src="/brand/nanda-retrato-inicio-v2.webp" alt="Nanda Almeida, escritora e fundadora da NobreDNA" fill sizes="(max-width: 767px) 220px, 380px" className="object-cover"/></div></figure>
    <div className="editorial-letter p-6 sm:p-9 lg:p-12"><p className="label">a mulher por trás da Casa</p><h2 className="mt-4 text-[clamp(2.4rem,5vw,3.75rem)] leading-none">Antes de existir um livro, <em className="text-vinho">existe uma vida.</em></h2><p className="mt-6 text-lg leading-relaxed text-ink/80">{autora.bio[0]}</p><DivisorPerola tone="light" width="180px" className="mt-6"/><p className="mt-5 font-serif text-3xl italic text-vinho">{autora.nome}</p><p className="text-sm text-ink/65">Fundadora da NobreDNA</p><Link href="/sobre" className="mt-6 inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Conheça nossa história</Link></div>
   </div>
  </section>
  <section className="editorial-paper py-8 lg:py-14">
    <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
      <div className="editorial-welcome grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <figure className="relative min-h-[240px] lg:min-h-[410px]"><Image src="/brand/bastidores.webp" alt="Composição ilustrativa com livros antigos, manuscritos e objetos de escrita" fill sizes="(max-width: 1023px) 90vw, 480px" className="object-cover"/><figcaption className="absolute bottom-3 left-3 rounded-full bg-almond/90 px-3 py-1 text-xs text-ink">Composição editorial</figcaption></figure>
        <div className="editorial-letter flex flex-col justify-center p-7 sm:p-12"><p className="label">da carta da fundadora</p><DivisorPerola tone="light" width="180px" className="my-4"/><h2 className="text-[clamp(2.2rem,4vw,3.3rem)] italic leading-none text-vinho">Seja bem-vinda à nossa Casa.</h2><blockquote className="mt-5 font-serif text-[1.45rem] leading-relaxed text-ink/85">“{autora.chamada}”</blockquote><div className="mt-6 flex items-center gap-3"><BrandSeal size={53}/><p className="font-serif text-xl italic text-vinho">{autora.nome}<span className="block font-sans text-xs not-italic text-khaki-ink">Fundadora da Casa</span></p></div></div>
      </div>
    </div>
  </section>
  <PearlSectionDivider/>
  <section className="bg-almond py-16 lg:py-24"><div className="mx-auto max-w-[1180px] px-6 lg:px-10"><p className="label">do manuscrito à publicação</p><h2 className="mt-4 text-4xl lg:text-5xl">O seu livro, um capítulo de cada vez.</h2><EditorialTimeline/><Link href="/publique" className="mt-9 inline-flex min-h-12 items-center bg-vinho px-7 py-3 font-serif text-xl text-almond hover:bg-vinho-soft">Conhecer o processo editorial</Link></div></section>
  <section className="bg-vinho py-16 text-almond lg:py-24"><div className="mx-auto grid max-w-[1180px] gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-10"><div><p className="label label-on-vinho">o primeiro capítulo</p><h2 className="mt-4 text-[clamp(2.6rem,5vw,4rem)] leading-none">Existe um livro <em className="text-khaki">dentro de você?</em></h2><p className="mt-5 max-w-md leading-relaxed text-almond/85">Responda três perguntas para descobrir como iniciar sua jornada. Você não precisa ter um manuscrito pronto.</p></div><JornadaLegado/></div></section>
  <section className="bg-almond-lift py-16 text-center lg:py-24"><div className="mx-auto max-w-3xl px-6"><p className="label">a essência da Casa</p><h2 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] italic text-vinho">“Se o Senhor não edificar a casa, em vão trabalham os que a edificam.”</h2><p className="mt-4 text-khaki-ink">Salmo 127:1</p><p className="mt-7 text-ink/75">Fé, verdade, excelência, beleza, cuidado, legado e serviço.</p><Link href="/sobre#pilares" className="mt-6 inline-block border-b border-vinho pb-1 text-vinho">Leia o manifesto da Casa</Link></div></section>
  <EditorialFaq/>
  <section id="assine" className="bg-ink py-16 text-center text-almond"><div className="mx-auto max-w-xl px-6"><DivisorPerola tone="dark" width="min(300px,75%)" className="mb-5"/><p className="label label-on-dark">continue a história</p><h2 className="mt-4 text-4xl">Vamos escrever o próximo capítulo?</h2><div className="mt-7 flex flex-wrap justify-center gap-4"><Link href="/publique" className="inline-flex min-h-12 items-center bg-almond px-7 py-3 text-vinho">Quero publicar</Link><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center border border-khaki/60 px-7 py-3 text-almond">@nobre_dna</a></div></div></section>
 </>;
}
