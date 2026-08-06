"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DivisorPerola } from "@/components/perola";

const depoimentos = [
  {
    quote:
      "Comprei para entender a minha própria casa. Terminei entendendo a decisão que meu pai nunca explicou.",
    name: "Beatriz Sandoval",
    role: "Leitora desde 2016 · Porto Alegre",
    book: "Cartas ao Herdeiro",
  },
  {
    quote:
      "É a única editora que me manda um livro sabendo exatamente por que aquele livro é meu.",
    name: "Otávio Nakamura",
    role: "Assinante da coleção Linhagem · Curitiba",
    book: "Vinte Gerações",
  },
  {
    quote:
      "O objeto tem a mesma seriedade do texto. Ficou na estante da sala, não na de cima.",
    name: "Rafaela D'Ávila",
    role: "Arquiteta · Recife",
    book: "Arquitetura do Legado",
  },
  {
    quote:
      "Publiquei com eles porque queria que o livro durasse mais que a minha vontade de escrevê-lo.",
    name: "Henrique Sá Barreto",
    role: "Autor da casa · Salvador",
    book: "A Casa e o Sangue",
  },
];

const CICLO = 9000;

/**
 * Ritmo da seção: lento e contemplativo.
 * A frase entra palavra por palavra, saindo de desfoque — o leitor é obrigado a
 * ler no tempo da leitura, não no tempo do scroll.
 */
export function Testemunhos() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const atual = depoimentos[index];

  const go = useCallback((next: number) => {
    setIndex((next + depoimentos.length) % depoimentos.length);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setInterval(() => go(index + 1), CICLO);
    return () => window.clearInterval(t);
  }, [index, paused, reduced, go]);

  return (
    <section
      id="testemunhos"
      className="relative overflow-hidden bg-ink py-28 lg:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="glow-lavender pointer-events-none absolute inset-x-0 top-1/4 h-1/2" />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <motion.p
          className="label label-on-dark"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          Quem já recebeu
        </motion.p>

        <div className="mt-14 grid gap-16 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div className="min-h-[22rem] md:min-h-[19rem]">
            <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeIn" } }}
              transition={{ duration: 0.9 }}
            >
              <blockquote className="max-w-[24ch] font-serif text-[clamp(1.75rem,4.4vw,3.4rem)] leading-[1.28] text-almond md:max-w-[20ch]">
                <span className="text-almond/70">“</span>
                {atual.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={`${index}-${i}`}
                    className="inline-block"
                    initial={{
                      opacity: 0,
                      y: reduced ? 0 : 14,
                      filter: reduced ? "blur(0px)" : "blur(7px)",
                    }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 1.5,
                      delay: 0.25 + i * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                    {" "}
                  </motion.span>
                ))}
                <span className="text-almond/70">”</span>
              </blockquote>

              <motion.figcaption
                className="mt-12 flex flex-col gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 1.15 }}
              >
                <span className="text-[0.85rem] tracking-[0.12em] text-almond">
                  {atual.name}
                </span>
                <span className="text-[0.78rem] text-almond/40">{atual.role}</span>
                <span className="mt-2 font-serif text-[1rem] italic text-almond/30">
                  sobre {atual.book}
                </span>
              </motion.figcaption>
            </motion.figure>
            </AnimatePresence>
          </div>

          {/* índice de vozes: dá endereço à seção sem apressar a leitura */}
          <ul className="hidden lg:block lg:self-end lg:border-t lg:border-almond/15 lg:pt-8">
            {depoimentos.map((d, i) => (
              <li key={`indice-${d.name}`}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index}
                  className="w-full border-b border-almond/10 py-4 text-left last:border-none"
                >
                  <span
                    className={`block text-[0.82rem] transition-colors duration-700 ${
                      i === index ? "text-almond" : "text-almond/35"
                    }`}
                  >
                    {d.name}
                  </span>
                  <span
                    className={`mt-1 block font-serif text-[1rem] italic transition-colors duration-700 ${
                      i === index ? "text-lavender/70" : "text-almond/20"
                    }`}
                  >
                    {d.book}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex items-center gap-4 lg:hidden">
          {depoimentos.map((d, i) => (
            <button
              key={d.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Depoimento de ${d.name}`}
              aria-current={i === index}
              className="group grid min-h-11 min-w-11 place-items-center"
            >
              <span
                className={`block h-px transition-all duration-[900ms] ease-out ${
                  i === index
                    ? "w-16 bg-lavender"
                    : "w-8 bg-almond/20 group-hover:bg-almond/45"
                }`}
              />
            </button>
          ))}
        </div>

        <DivisorPerola tone="dark" className="mt-20" width="min(20rem,55%)" />
      </div>
    </section>
  );
}
