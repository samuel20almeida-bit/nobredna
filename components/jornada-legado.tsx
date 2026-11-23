"use client";

import { useState } from "react";

const perguntas = [
  { titulo: "Que tipo de história deseja compartilhar?", opcoes: ["Minha trajetória e testemunho", "Fé e reflexões", "Memórias e histórias de família", "Ainda estou descobrindo"] },
  { titulo: "Onde você está nessa jornada?", opcoes: ["Tenho apenas uma ideia", "Já comecei a escrever", "Tenho um manuscrito pronto"] },
  { titulo: "Como gostaria de publicar?", opcoes: ["Uma obra autoral", "Uma coautoria", "Quero entender as possibilidades"] },
];

export function JornadaLegado({ coautoria = false }: { coautoria?: boolean }) {
  const [respostas, setRespostas] = useState<string[]>([]);
  const [copiado, setCopiado] = useState(false);
  const concluido = respostas.length === perguntas.length;
  const passo = perguntas[respostas.length];
  const mensagem = `Olá, NobreDNA! Gostaria de conversar sobre ${coautoria ? "coautoria" : "meu projeto editorial"}.\n${perguntas.map((q, i) => `${q.titulo} ${respostas[i] || ""}`).join("\n")}`;
  async function copiar() { try { await navigator.clipboard.writeText(mensagem); setCopiado(true); } catch { setCopiado(false); } }
  return <div className="border border-almond/25 bg-ink-soft/30 p-6 sm:p-10">
    <p className="font-serif text-xl italic text-khaki">{concluido ? "Seu primeiro passo" : `Capítulo ${respostas.length + 1} de ${perguntas.length}`}</p>
    <div className="mt-4 flex gap-2" aria-hidden="true">{perguntas.map((q, i) => <span key={q.titulo} className={`h-1 flex-1 ${i <= respostas.length ? "bg-khaki" : "bg-almond/15"}`} />)}</div>
    {!concluido ? <><h3 className="mt-8 text-3xl text-almond">{passo.titulo}</h3><div className="mt-6 grid gap-3">{passo.opcoes.map(opcao => <button key={opcao} type="button" onClick={() => setRespostas([...respostas, opcao])} className="border border-almond/25 px-5 py-4 text-left text-almond hover:bg-almond/10 focus-visible:bg-almond/10">{opcao}</button>)}</div></> : <div aria-live="polite"><h3 className="mt-8 text-3xl text-almond">Seu legado já tem um começo.</h3><p className="mt-4 text-almond/75 leading-relaxed">Copie o resumo e envie uma mensagem à Casa pelo Instagram. Nenhuma resposta é enviada automaticamente.</p><textarea readOnly aria-label="Resumo da sua jornada" value={mensagem} className="mt-5 w-full min-h-40 border border-almond/25 p-4 text-almond bg-transparent text-sm"/><div className="mt-5 flex flex-wrap gap-3"><button onClick={copiar} className="rounded-full border border-khaki px-6 py-3 text-almond">{copiado ? "Copiado!" : "Copiar resumo"}</button><a href="https://ig.me/m/nobre_dna" target="_blank" rel="noreferrer" className="rounded-full bg-almond px-6 py-3 text-ink">Conversar no Instagram</a></div></div>}
    {respostas.length > 0 && <button type="button" onClick={() => {setRespostas(respostas.slice(0,-1));setCopiado(false);}} className="mt-6 text-almond/70 underline underline-offset-4">Voltar uma etapa</button>}
  </div>;
}
