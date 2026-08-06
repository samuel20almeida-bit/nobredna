"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Bookmark } from "@/components/icons";
import { collections } from "@/lib/books";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Ritmo da seção: médio, editorial.
 * O mecanismo aqui é outro — as linhas não sobem em fade, elas são reveladas
 * por um corte horizontal, como página virando sob a régua. Nenhuma seção do
 * site entra do mesmo jeito.
 *
 * A revelação é feita em GSAP, e não no framer-motion como as seções vizinhas,
 * por um motivo concreto: o framer (12.43) não anima `clipPath: inset(...)`.
 * Ele falha em silêncio, sem erro no console, e trava o elemento no estado
 * `initial` — arrastando junto a opacidade que dividia o mesmo variant. O
 * resultado era um mil pixels de azul vazio no lugar das três coleções, com o
 * texto presente no DOM e invisível. O GSAP anima o mesmo `clipPath` sem
 * problema, e é o que já revela o traço a lápis em `anotacao.tsx`.
 */
export function Colecoes() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduzido: "(prefers-reduced-motion: reduce)",
          completo: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          // sem movimento a coleção nasce pronta, nunca refém da animação
          if (ctx.conditions?.reduzido) return;

          gsap.utils.toArray<HTMLElement>(".col-linha").forEach((linha, i) => {
            gsap.fromTo(
              linha,
              { clipPath: "inset(0 100% 0 0)", opacity: 0.15 },
              {
                clipPath: "inset(0 0% 0 0)",
                opacity: 1,
                duration: 0.95,
                delay: Math.min(i, 2) * 0.16,
                ease: "power1.inOut",
                scrollTrigger: {
                  trigger: linha,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          });
        },
        raiz,
      );

      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <section
      ref={raiz}
      id="colecoes"
      className="grain grain-on-dark relative overflow-hidden bg-ink py-24 text-almond lg:py-32"
    >
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="label label-on-dark flex items-center gap-3">
              <Bookmark size={16} />
              as três linhas da casa
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-light text-balance">
              A casa não aceita qualquer livro.
              <span className="text-almond/45 italic">
                {" "}
                Aceita os que sabe editar.
              </span>
            </h2>
            <p className="mt-7 max-w-[30rem] text-[1rem] leading-[1.85] text-almond/60">
              Uma assessoria vale pelo que já leu antes. Estas são as três
              linhas de assunto em que a Nobre DNA tem repertório — e quando um
              original chega de outro território, dizemos isso no diagnóstico
              em vez de aceitar o trabalho.
            </p>

            {/* `navy` era da paleta antiga e não existe desde a reescrita em
                amêndoa/lavanda: `text-navy` e `border-navy/12` não geravam
                regra nenhuma, então o número herdava o almond da seção e a
                borda saía sólida em vez de quase invisível. */}
            <dl className="mt-12 grid max-w-[26rem] grid-cols-3 gap-6 border-t border-almond/12 pt-8">
              {[
                { k: "Desde", v: "2011" },
                { k: "Livros", v: "08" },
                { k: "Por vez", v: "Três" },
              ].map((stat) => (
                <div key={stat.k}>
                  <dt className="font-serif text-[0.9rem] text-almond/45 italic">
                    {stat.k}
                  </dt>
                  <dd className="mt-2 font-serif text-[1.4rem] text-almond">
                    {stat.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul>
            {collections.map((collection, i) => (
              <li
                key={collection.name}
                className="col-linha hairline-on-dark border-t py-10 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-serif text-[1.05rem] text-khaki italic">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[clamp(1.7rem,3.2vw,2.4rem)] leading-tight font-light">
                      Coleção {collection.name}
                    </h3>
                    <p className="mt-3 font-serif text-[1.25rem] leading-relaxed text-lavender italic">
                      {collection.line}
                    </p>
                    <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-[1.85] text-almond/50">
                      {collection.description}
                    </p>
                    <Link
                      href="#acervo"
                      className="group mt-6 inline-flex items-center gap-3 font-serif text-[1.08rem] text-khaki transition-colors duration-300 hover:text-almond"
                    >
                      ver títulos
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
