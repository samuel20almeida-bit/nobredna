"use client";
import { useEffect, useRef, useState } from "react";

const base = [
 { titulo:"Que tipo de história deseja compartilhar?", opcoes:["Minha trajetória e testemunho","Fé e reflexões","Memórias e histórias de família","Ainda estou descobrindo"] },
 { titulo:"Onde você está nessa jornada?", opcoes:["Tenho apenas uma ideia","Já comecei a escrever","Tenho um manuscrito pronto"] },
 { titulo:"Como gostaria de publicar?", opcoes:["Uma obra autoral","Uma coautoria","Quero entender as possibilidades"] }
];
export function JornadaLegado({ coautoria = false }: { coautoria?: boolean }) {
 const perguntas = coautoria ? [...base.slice(0,2),{titulo:"O que procura em uma coautoria?",opcoes:["Compartilhar meu testemunho","Escrever com apoio de outras autoras","Conhecer os próximos projetos"]}] : base;
 const [respostas,setRespostas]=useState<string[]>([]);
 const [copiado,setCopiado]=useState(false);
 const [erro,setErro]=useState(false);
 const focus=useRef<HTMLHeadingElement>(null);
 const interagiu=useRef(false);
 const concluido=respostas.length===perguntas.length;
 const passo=perguntas[respostas.length];
 const mensagem="Olá, NobreDNA! Gostaria de conversar sobre "+(coautoria?"coautoria":"meu projeto editorial")+".\n\n*Triagem editorial — NobreDNA*\n\n"+perguntas.map((q,i)=>`*${q.titulo}*\n${respostas[i]||""}`).join("\n\n")+"\n\nGostaria de saber quais são os próximos passos.";
 const whatsappUrl="https://wa.me/554188335400?text="+encodeURIComponent(mensagem);
 useEffect(()=>{if(interagiu.current){focus.current?.focus({preventScroll:true});if(window.matchMedia("(max-width: 767px)").matches && focus.current){const r=focus.current.getBoundingClientRect();if(r.top<76 || r.bottom>window.innerHeight-90)focus.current.scrollIntoView({block:"center",behavior:"instant"});}}},[respostas.length]);
 async function copiar(){try{await navigator.clipboard.writeText(mensagem);setCopiado(true);setErro(false)}catch{setErro(true)}}
 return <div className="border border-khaki/60 bg-almond-lift p-5 text-ink shadow-lift sm:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-serif text-xl italic text-vinho">{concluido?"Seu primeiro passo":"Capítulo "+(respostas.length+1)+" de "+perguntas.length}</p><span className="text-sm text-ink/65">{concluido?"Concluído":"Sem compromisso"}</span></div>
   <div aria-label={respostas.length+" de "+perguntas.length+" respostas"} role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={respostas.length} className="mt-4 flex gap-2">{perguntas.map((q,i)=><span key={q.titulo} className={"h-1.5 flex-1 "+(i<respostas.length?"bg-vinho":"bg-almond-deep")}/>)}</div>
   <div key={respostas.length} className="journey-chapter mt-6">
    {!concluido?<><h3 ref={focus} tabIndex={-1} className="text-3xl leading-tight text-vinho outline-none">{passo.titulo}</h3><p className="mt-2 text-sm text-ink/70">Escolha a opção que mais combina com você.</p><div className="mt-5 grid gap-3">{passo.opcoes.map(opcao=><button key={opcao} type="button" onClick={()=>{interagiu.current=true;setRespostas([...respostas,opcao])}} className="group flex min-h-14 items-center gap-3 border border-khaki-ink/35 px-4 py-3 text-left text-base text-ink transition-colors hover:border-vinho hover:bg-almond focus-visible:border-vinho"><span className="h-3 w-3 shrink-0 rounded-full border border-khaki-ink group-hover:bg-vinho"/>{opcao}</button>)}</div></>:<><h3 ref={focus} tabIndex={-1} className="text-3xl text-vinho outline-none">Seu legado já tem um começo.</h3><p className="mt-3 text-base leading-relaxed text-ink/75">{respostas[1]==="Tenho apenas uma ideia"?"Não precisa ter todas as respostas: uma conversa pode ajudar você a organizar as ideias.":respostas[1]==="Tenho um manuscrito pronto"?"Você pode conversar com a Casa sobre o próximo passo do seu original.":"Compartilhe seu progresso e descubra como a Casa poderá acompanhar sua jornada."}</p><details className="mt-5 border border-khaki-ink/30 p-4"><summary className="cursor-pointer font-medium text-vinho">Ver o resumo da conversa</summary><textarea readOnly aria-label="Resumo da sua jornada" value={mensagem} className="mt-3 min-h-40 w-full border border-khaki-ink/30 bg-almond p-3 text-sm"/></details><p className="mt-4 text-sm text-ink/75">Toque no botão abaixo para abrir o WhatsApp da Casa com suas respostas preenchidas. Você pode conferir e confirmar o envio.</p><div className="mt-4 grid gap-3"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 bg-vinho px-4 text-center font-medium text-almond"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.9a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-4.8A8.5 8.5 0 1 1 20.5 11.9Z"/><path d="M8.4 7.5c.4-.4 1.1-.2 1.3.1l1.1 1.9c.2.4-.2.9-.6 1.3.7 1.5 1.9 2.7 3.4 3.4.4-.4.9-.8 1.3-.6l1.9 1.1c.4.2.5.9.1 1.3-.7.9-1.5 1.1-2.7.7-3.8-1.2-6.5-3.9-7.7-7.7-.4-1.2-.2-2 .7-2.7Z"/></svg>Enviar triagem pelo WhatsApp</a><button onClick={copiar} className="min-h-11 text-sm text-vinho underline underline-offset-4">{copiado?"Resumo copiado!":"Copiar resumo"}</button></div>{erro&&<p role="status" className="mt-3 text-sm text-vinho">Não foi possível copiar. Selecione o texto do resumo manualmente.</p>}</>}
   </div>
   {respostas.length>0&&<button type="button" onClick={()=>{setRespostas(respostas.slice(0,-1));setCopiado(false);setErro(false)}} className="mt-5 min-h-11 text-base text-vinho underline underline-offset-4">Voltar uma etapa</button>}
 </div>;
}
