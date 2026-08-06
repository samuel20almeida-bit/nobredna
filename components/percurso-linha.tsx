"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quill, Route, Seal, Spines } from "@/components/icons";
import { percurso } from "@/lib/servicos";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const icones = [Quill, Seal, Spines, Route];

/**
 * O percurso como linha do tempo.
 *
 * Era uma grade de quatro colunas, que mostrava as etapas lado a lado como se
 * acontecessem juntas. Elas não acontecem: uma puxa a outra, e o fio entre os
 * números diz isso. Ele é desenhado conforme a página desce — o leitor avança
 * no ritmo do trabalho.
 */
export function PercursoLinha() {
  const raiz = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduzido: "(prefers-reduced-motion: reduce)",
          completo: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          if (ctx.conditions?.reduzido) return;

          // o fio de cada trecho se desenha entre uma etapa e a seguinte
          gsap.utils.toArray<HTMLElement>(".pl-fio").forEach((fio) => {
            gsap.fromTo(
              fio,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                transformOrigin: "top center",
                scrollTrigger: {
                  trigger: fio,
                  start: "top 80%",
                  end: "bottom 65%",
                  scrub: 0.6,
                },
              },
            );
          });

          gsap.from(".pl-etapa", {
            autoAlpha: 0,
            y: 24,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: raiz.current,
              start: "top 78%",
              once: true,
            },
          });
        },
        raiz,
      );

      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <ol ref={raiz} className="mt-16 max-w-[46rem]">
      {percurso.map((etapa, i) => {
        const Icon = icones[i];
        const ultima = i === percurso.length - 1;

        return (
          <li
            key={etapa.n}
            className="pl-etapa grid grid-cols-[3.5rem_1fr] gap-x-6 sm:grid-cols-[4rem_1fr] sm:gap-x-8"
          >
            <div className="flex flex-col items-center">
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-khaki bg-almond font-serif text-[1.05rem] text-ink/55 sm:size-16">
                {etapa.n}
              </span>
              {!ultima && (
                <span className="pl-fio mt-3 w-px flex-1 bg-khaki/50" />
              )}
            </div>

            <div className={ultima ? "pt-3" : "pt-3 pb-14"}>
              <div className="flex items-baseline gap-4">
                <h3 className="text-[clamp(1.35rem,2.4vw,1.6rem)] leading-tight font-light text-ink">
                  {etapa.titulo}
                </h3>
                <span className="shrink-0 text-khaki-ink/70" aria-hidden="true">
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-3 max-w-[34rem] text-[0.95rem] leading-[1.85] text-ink/55">
                {etapa.texto}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
