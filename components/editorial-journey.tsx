"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Quill, Seal, Spines, Bookmark } from "@/components/icons";

const steps = [
  {title:"Escuta", detail:"Uma conversa para compreender sua história.", Icon:Seal},
  {title:"Estrutura", detail:"Organização das ideias e do projeto.", Icon:Quill},
  {title:"Cuidado editorial", detail:"Revisão e identidade visual da obra.", Icon:Bookmark},
  {title:"Publicação", detail:"Planejamento para levar seu livro ao mundo.", Icon:Spines},
];

export function EditorialTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({target:ref, offset:["start 90%","end 35%"]});
  return <div ref={ref} className="editorial-timeline relative mt-9">
    <div className="timeline-track" aria-hidden="true">
      <motion.span style={reduced?{}:{scaleX:scrollYProgress}} className="timeline-horizontal"/>
      <motion.span style={reduced?{}:{scaleY:scrollYProgress}} className="timeline-vertical"/>
    </div>
    <ol className="relative grid gap-5 md:grid-cols-4">
      {steps.map(({title,detail,Icon})=><li key={title} className="flex min-w-0 items-start gap-4 md:block">
        <span className="timeline-icon"><Icon size={26}/></span>
        <article className="editorial-card min-w-0 flex-1 p-5 md:mt-5 md:min-h-40"><h3 className="text-[1.7rem] leading-tight text-vinho">{title}</h3><p className="mt-3 leading-relaxed text-ink/75">{detail}</p></article>
      </li>)}
    </ol>
  </div>;
}

const questions = [
  ["Preciso ter um manuscrito pronto?","Não. A Casa acolhe ideias, projetos em andamento e manuscritos. A primeira conversa ajuda a entender em que etapa você está."],
  ["Como funciona uma coautoria?","Uma obra coletiva reúne diferentes vozes em torno de um propósito. A equipe apresenta os temas, condições e oportunidades de cada projeto."],
  ["Quais etapas a NobreDNA acompanha?","O percurso pode incluir escuta, organização, preparação, revisão, identidade visual e planejamento da publicação, conforme as necessidades do projeto."],
  ["Quanto custa publicar um livro?","O investimento depende do formato e das necessidades da obra. Converse com a Casa para conhecer as possibilidades e receber orientação."],
  ["Como começo a minha jornada?","Responda ao questionário editorial e registre seu contato diretamente no site. A equipe da Casa receberá sua solicitação para dar continuidade ao atendimento."],
];

export function EditorialFaq({href="/publique#jornada"}:{href?:string}) {
  return <section id="faq" className="editorial-paper py-14 lg:py-20">
    <div className="mx-auto grid max-w-[1180px] gap-8 px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-10">
      <div><p className="label">antes da primeira página</p><h2 className="mt-3 text-4xl text-vinho lg:text-5xl">Vamos conversar?</h2><p className="mt-4 leading-relaxed text-ink/75">Algumas respostas para quem deseja dar o primeiro passo.</p><Link href={href} className="mt-5 inline-flex min-h-11 items-center border-b border-vinho text-vinho">Inicie sua jornada</Link></div>
      <div className="space-y-3">{questions.map(([q,a])=><details key={q} className="editorial-faq editorial-card"><summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 font-serif text-xl text-vinho"><span>{q}</span><span aria-hidden="true" className="faq-plus">+</span></summary><div className="px-5 pb-5 leading-relaxed text-ink/75">{a}</div></details>)}</div>
    </div>
  </section>;
}
