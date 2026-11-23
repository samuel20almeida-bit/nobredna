"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { autora } from "@/lib/autora";
import { BrandSeal } from "@/components/brand-seal";
import { Quill, Seal, Spines, Bookmark } from "@/components/icons";

export const projects = [
  { title:"Ave Mulher", type:"Devocional", detail:"Liderança feminina à luz da Bíblia. Um lançamento celebrado pela Casa.", href:"https://instagram.com/p/DRULXj2jnX6", image:"/brand/ave-mulher.webp", book:true },
  { title:"Noiva Apaixonada", type:"Lançamento editorial", detail:"Uma ideia que se tornou livro. Conheça o registro desse lançamento.", href:"https://instagram.com/p/Dd4MhDqtZJV", image:"/brand/noiva-apaixonada.webp", book:true },
  { title:"Nos bastidores da Casa", type:"Processo editorial", detail:"Acompanhe o ensaio com Auxiliadora Nobre e o cuidado por trás da produção.", href:"https://instagram.com/p/DXY_p6ADucG", image:"/brand/bastidores.webp", book:false },
];

// Adaptado do conceito 3D Book Carousel Reading Mode (Cue Foundations):
// as lombadas giram em perspectiva; o livro escolhido abre pela lombada.
export function LiteraryShelf() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const books = projects.filter(p => p.book);
  const selected = books[active];
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  function select(i:number) { setActive(i); setOpen(false); }
  return <div className="literary-shelf mt-7 grid items-center gap-5 p-5 md:grid-cols-[1.25fr_1fr] md:p-8">
    <div>
      <div className="shelf-scene" onPointerDown={e=>{start.current=e.clientX;swiped.current=false}} onPointerUp={e=>{if(start.current!==null && Math.abs(e.clientX-start.current)>45){swiped.current=true;select(e.clientX<start.current?Math.min(active+1,books.length-1):Math.max(active-1,0))}start.current=null}} onPointerCancel={()=>{start.current=null}}>
        {books.map((book,i)=><button key={book.title} type="button" className="shelf-volume" data-active={active===i} data-open={active===i&&open} aria-label={active===i?(open?"Fechar ":"Abrir ")+book.title:"Selecionar "+book.title} aria-pressed={active===i&&open} onClick={()=>{if(swiped.current){swiped.current=false;return}active===i?setOpen(!open):select(i)}}>
          <span className="shelf-page"><span>✦</span><strong>{book.title}</strong><span className="shelf-small">Projeto editorial</span></span>
          <span className="shelf-hinge"><span className="shelf-cover"><Image src={book.image} alt="" fill sizes="200px" className="object-cover"/></span><span className="shelf-spine">{book.title}</span></span>
        </button>)}
      </div>
      <div className="flex flex-wrap justify-center gap-2 pt-3">{books.map((book,i)=><button key={book.title} className="min-h-11 rounded-full border border-khaki-ink/35 px-4 text-sm" aria-pressed={active===i} data-selected={active===i} onClick={()=>select(i)}>{book.title}</button>)}</div>
    </div>
    <div className="min-w-0 p-2 md:p-5" aria-live="polite"><p className="label">{selected.type}</p><h3 className="mt-3 text-4xl text-vinho">{selected.title}</h3><p className="mt-3 text-ink/75 leading-relaxed">{selected.detail}</p><p className="mt-3 text-sm text-khaki-ink">Capa conceitual · não é a edição oficial.</p><div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={()=>setOpen(!open)} className="min-h-11 rounded-xl border border-vinho px-4 text-vinho">{open?"Fechar livro":"Abrir livro"}</button><a href={selected.href} target="_blank" rel="noreferrer" className="min-h-11 inline-flex items-center bg-vinho px-4 text-almond">Conhecer projeto</a></div><p className="mt-4 text-sm text-ink/65">Toque em uma capa para explorar a estante.</p></div>
  </div>;
}

// Book Page Curl: capa com dobradura progressiva, usando o gesto horizontal
// dentro do livro; o botão oferece a mesma ação sem depender do gesto.
export function HeroBook() {
  const [opened,setOpened] = useState(false);
  const [drag,setDrag] = useState<number|null>(null);
  const start = useRef<number|null>(null);
  const moved = useRef(false);
  const progress = drag ?? (opened ? 1 : 0);
  const fold = Math.min(100, progress*110);
  return <div className="hero-interactive">
    <button type="button" aria-expanded={opened} aria-label={opened?"Fechar a mensagem de boas-vindas":"Abrir o livro da NobreDNA"} className="hero-book relative mx-auto block aspect-[4/5] w-full max-w-[480px] touch-pan-y" onPointerDown={e=>{start.current=e.clientX;moved.current=false;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(start.current===null)return;const delta=start.current-e.clientX;if(Math.abs(delta)>12)moved.current=true;if(moved.current)setDrag(Math.max(0,Math.min(1,(opened?1:0)+delta/e.currentTarget.clientWidth)))}} onPointerUp={()=>{if(moved.current){setOpened(progress>.35);setDrag(null)}start.current=null}} onPointerCancel={()=>{start.current=null;setDrag(null)}} onClick={()=>{if(!moved.current)setOpened(v=>!v);moved.current=false}}>
      <span className="hero-page" aria-hidden={!opened} style={{opacity:progress>0?1:0}}><BrandSeal size={48}/><span className="hero-page-title">O primeiro capítulo</span><span className="hero-page-copy">Toda grande história começa com coragem. Seja bem-vinda à Casa de Legados.</span><span className="hero-page-rule">✦</span></span>
      <span className="hero-curl-cover" style={{clipPath:progress>=1?"polygon(0 0,0 0,0 100%,0 100%)":`polygon(0 0,100% 0,100% ${100-fold}%,${100-fold}% 100%,0 100%)`,opacity:progress>=1?0:1,transform:`perspective(900px) rotateY(${-progress*55}deg)`,transition:drag===null?"clip-path .55s ease, transform .55s ease, opacity .35s ease":"none"}}><Image src="/brand/hero-livro-isolado.webp" alt="Livro antigo de capa dura bordô com o selo dourado da NobreDNA" fill priority sizes="(max-width: 639px) 190px, (max-width: 767px) 300px, (max-width: 1023px) 410px, 480px" className="object-contain"/></span>
      {progress>0 && progress<.92 && <span className="hero-curl-fold" style={{width:`${fold*.52}%`,height:`${fold*.52}%`,opacity:1-progress}} aria-hidden="true"/>}
    </button>
    <button type="button" onClick={()=>setOpened(v=>!v)} className="mx-auto mt-2 block min-h-11 text-center font-serif text-base italic text-vinho underline decoration-khaki-ink/45 underline-offset-4">{opened?"Fechar a carta":"Abra o livro · toque ou deslize"}</button>
  </div>;
}

export function EditorialCarousel() {
  const [index,setIndex] = useState(0);
  const reduced=useReducedMotion();
  const start=useRef<number|null>(null);
  const gallery=[projects[2],projects[1],{title:"A mulher por trás da Casa",type:"Fundadora",detail:"Nanda Almeida, escritora e fundadora da NobreDNA. Conheça a sua jornada.",href:"https://www.instagram.com/escritoranandaalmeida/",image:"/brand/nanda-retrato-inicio.webp",book:false,portrait:true}];
  const p=gallery[index];
  const portrait="portrait" in p && p.portrait;
  function change(delta:number){setIndex(i=>(i+delta+gallery.length)%gallery.length)}
  return <div className="editorial-carousel mt-8 overflow-hidden rounded-[24px] border border-khaki-ink/25 bg-almond-lift" aria-roledescription="carrossel" aria-label="Lançamentos e bastidores" onTouchStart={e=>{start.current=e.touches[0].clientX}} onTouchEnd={e=>{if(start.current!==null){const delta=e.changedTouches[0].clientX-start.current;if(Math.abs(delta)>55)change(delta<0?1:-1)}start.current=null}}>
    <AnimatePresence mode="wait" initial={false}><motion.div key={index} initial={reduced?false:{opacity:.45}} animate={{opacity:1}} exit={{opacity:.5}} transition={{duration:reduced?0:.25}} className="grid md:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center p-6 md:p-10"><p className="label">olhares da Casa · {p.type}</p><h3 className="mt-3 text-4xl text-vinho">{p.title}</h3><p className="mt-4 max-w-sm leading-relaxed text-ink/75">{p.detail}</p><a href={p.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit min-h-11 items-center border border-vinho px-5 text-vinho">Ver no Instagram</a></div>
      <figure className="relative min-h-[270px] overflow-hidden bg-almond-deep md:min-h-[340px]"><Image src={p.image} alt={portrait?"Retrato de Nanda Almeida":p.book?`Capa conceitual de ${p.title}`:"Composição editorial ilustrativa"} fill sizes="(max-width: 767px) 90vw, 560px" className={p.book||portrait?"object-contain p-5":"object-cover"}/><figcaption className="absolute bottom-3 right-3 rounded-full bg-almond/95 px-3 py-1 text-xs text-ink">{portrait?"Nanda Almeida":p.book?"Capa conceitual":"Composição ilustrativa"}</figcaption></figure>
    </motion.div></AnimatePresence>
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-khaki-ink/20 px-4 py-3 md:px-7"><button type="button" onClick={()=>change(-1)} className="min-h-11 rounded-full border border-khaki-ink/35 px-4 text-sm text-vinho">Anterior</button><div className="flex items-center gap-1" aria-label="Selecionar imagem">{gallery.map((item,i)=><button key={item.title} type="button" onClick={()=>setIndex(i)} aria-label={item.title} aria-current={index===i?"true":undefined} className="grid h-11 w-8 place-items-center"><span className={`h-2 rounded-full transition-all ${index===i?"w-6 bg-vinho":"w-2 bg-khaki-ink/45"}`}/></button>)}</div><button type="button" onClick={()=>change(1)} className="min-h-11 rounded-full border border-khaki-ink/35 px-4 text-sm text-vinho">Próximo</button></div>
  </div>;
}

function ReadWord({word,progress,start,end}:{word:string;progress:MotionValue<number>;start:number;end:number}){
  const opacity=useTransform(progress,[start,end],[.57,1]);
  return <motion.span style={{opacity}}>{word}{" "}</motion.span>;
}
export function ReadingManifesto(){
  const ref=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start 90%","end 45%"]});
  const quote=autora.chamada;
  const words=quote.split(" ");
  return <div ref={ref} className="mx-auto max-w-3xl"><p className="label">a essência da Casa</p><span className="editorial-rule mx-auto mt-4" aria-hidden="true">✦</span><blockquote className="mt-5 font-serif text-[clamp(2.1rem,5vw,3.5rem)] leading-[1.2] italic text-vinho">{reduced?quote:words.map((word,i)=><ReadWord key={i} word={word} progress={scrollYProgress} start={i/words.length} end={(i+1)/words.length}/>)}</blockquote><p className="mt-4 text-khaki-ink">{autora.nome} · Fundadora da Casa</p><p className="mt-7 font-serif text-2xl italic text-vinho">“Se o Senhor não edificar a casa, em vão trabalham os que a edificam.”</p><p className="mt-2 text-sm text-khaki-ink">Salmo 127:1</p><Link href="/sobre#pilares" className="mt-6 inline-flex min-h-11 items-center border-b border-vinho text-vinho">Leia o manifesto da Casa</Link></div>;
}

const steps=[
  {title:"Escuta",detail:"Uma conversa para compreender sua história.",Icon:Seal},
  {title:"Estrutura",detail:"Organização das ideias e do projeto.",Icon:Quill},
  {title:"Cuidado editorial",detail:"Revisão e identidade visual da obra.",Icon:Bookmark},
  {title:"Publicação",detail:"Planejamento para levar seu livro ao mundo.",Icon:Spines},
];
export function EditorialTimeline(){
  const ref=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start 90%","end 35%"]});
  return <div ref={ref} className="editorial-timeline relative mt-10"><div className="timeline-track" aria-hidden="true"><motion.span style={reduced?{}: {scaleX:scrollYProgress}} className="timeline-horizontal"/><motion.span style={reduced?{}:{scaleY:scrollYProgress}} className="timeline-vertical"/></div><ol className="relative grid gap-5 md:grid-cols-4">{steps.map(({title,detail,Icon})=><li key={title} className="flex items-start gap-4 md:block"><span className="timeline-icon"><Icon size={26}/></span><article className="editorial-card flex-1 p-5 md:mt-5"><h3 className="text-3xl text-vinho">{title}</h3><p className="mt-3 leading-relaxed text-ink/75">{detail}</p></article></li>)}</ol></div>;
}

const questions=[
  ["Preciso ter um manuscrito pronto?","Não. A Casa acolhe ideias, projetos em andamento e manuscritos. A primeira conversa ajuda a entender em que etapa você está."],
  ["Como funciona uma coautoria?","Uma obra coletiva reúne diferentes vozes em torno de um propósito. A equipe apresenta os temas, condições e oportunidades de cada projeto."],
  ["Quais etapas a NobreDNA acompanha?","O percurso pode incluir escuta, organização, preparação, revisão, identidade visual e planejamento da publicação, conforme as necessidades do projeto."],
  ["Quanto custa publicar um livro?","O investimento depende do formato e das necessidades da obra. Converse com a Casa para conhecer as possibilidades e receber orientação."],
  ["Como começo a minha jornada?","Você pode responder ao questionário editorial e compartilhar o resumo com a equipe pelo Instagram para iniciar uma conversa."],
];
export function EditorialFaq(){
  return <section className="editorial-paper py-14 lg:py-20"><div className="mx-auto grid max-w-[1180px] gap-8 px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-10"><div><p className="label">antes da primeira página</p><h2 className="mt-3 text-4xl text-vinho lg:text-5xl">Vamos conversar?</h2><p className="mt-4 leading-relaxed text-ink/75">Algumas respostas para quem deseja dar o primeiro passo.</p><Link href="/publique" className="mt-5 inline-flex min-h-11 items-center border-b border-vinho text-vinho">Inicie sua jornada</Link></div><div className="space-y-3">{questions.map(([q,a])=><details key={q} className="editorial-faq editorial-card group"><summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 font-serif text-xl text-vinho"><span>{q}</span><span aria-hidden="true" className="faq-plus">+</span></summary><div className="px-5 pb-5 leading-relaxed text-ink/75">{a}</div></details>)}</div></div></section>;
}
