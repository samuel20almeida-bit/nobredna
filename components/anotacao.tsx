"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lapis } from "@/components/icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Anotação a lápis: a frase que alguém marcou ao ler.
 *
 * Duas marcas, porque são dois gestos diferentes de leitor:
 *
 * - `sublinhado` — o traço passa por baixo, da esquerda para a direita. É o
 *   gesto de destacar uma frase, e serve a uma linha só.
 * - `margem` — um risco vertical ao lado do bloco, feito de cima para baixo.
 *   É como se marca uma passagem de várias linhas, e é o gesto de quem risca
 *   o versículo do dia na própria Bíblia. Sublinhar um bloco de três linhas
 *   deixaria o traço só embaixo da última, dizendo a coisa errada.
 *
 * Em ambas o lápis acompanha o traço e sai de cena ao terminar.
 *
 * Sobre o desenho: o traço é esticado (`preserveAspectRatio="none"`) para
 * acompanhar o tamanho do texto, e `vector-effect="non-scaling-stroke"` impede
 * que a espessura estique junto. O lápis fica fora do SVG justamente para não
 * sofrer essa deformação.
 *
 * O traço é revelado por `clip-path`, não pelo DrawSVGPlugin: o plugin mede o
 * path com `getTotalLength()`, e o navegador se recusa a medir um path que
 * combina `non-scaling-stroke` com escala não proporcional — o resultado é um
 * `stroke-dasharray` degenerado e um traço que nunca aparece. O clip revela o
 * desenho já na forma final e não depende de medição nenhuma.
 */
export function Anotacao({
  children,
  marca = "sublinhado",
  tom = "claro",
  className = "",
}: {
  children: ReactNode;
  marca?: "sublinhado" | "margem";
  /** `escuro` para fundos sépia ou tinta: o lápis vira khaki claro */
  tom?: "claro" | "escuro";
  className?: string;
}) {
  const raiz = useRef<HTMLSpanElement>(null);
  const naMargem = marca === "margem";
  const noEscuro = tom === "escuro";
  const tinta = noEscuro ? "#c6ac8f" : "#7a5f42";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduzido: "(prefers-reduced-motion: reduce)",
          completo: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          // Sem movimento: o traço já nasce feito, e o lápis não entra em cena.
          if (ctx.conditions?.reduzido) {
            gsap.set(".an-lapis", { autoAlpha: 0 });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: raiz.current,
              start: "top 82%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // o clip abre no eixo do traço: para a direita, ou para baixo
          const de = naMargem ? "inset(0% 0% 100% 0%)" : "inset(0% 100% 0% 0%)";
          const percurso = naMargem
            ? {
                y: () => (raiz.current?.offsetHeight ?? 0) - 14,
                duration: 1.2,
                ease: "power1.inOut",
              }
            : {
                x: () => (raiz.current?.offsetWidth ?? 0) - 8,
                duration: 1.1,
                ease: "power1.inOut",
              };

          tl.fromTo(
            ".an-traco",
            { clipPath: de },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: naMargem ? 1.2 : 1.1,
              ease: "power1.inOut",
            },
          )
            .fromTo(
              ".an-lapis",
              { autoAlpha: 0, x: 0, y: 0 },
              { autoAlpha: 1, duration: 0.18 },
              0,
            )
            .to(".an-lapis", percurso, 0)
            .to(".an-lapis", { autoAlpha: 0, duration: 0.28 }, ">-0.18");
        },
        raiz,
      );

      return () => mm.revert();
    },
    { scope: raiz },
  );

  const traco = naMargem ? (
    <svg
      className="an-traco pointer-events-none absolute inset-y-0 left-0 h-full w-[9px]"
      viewBox="0 0 9 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5,3 C2.6,38 7,72 3.6,106 C1,140 6.8,168 4.2,197"
        fill="none"
        stroke={tinta}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeOpacity={0.7}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  ) : (
    <svg
      className="an-traco pointer-events-none absolute inset-x-0 -bottom-2 h-[10px] w-full"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2,6 C34,2.5 64,8.5 100,4.5 C134,1 168,7.5 198,3.5"
        fill="none"
        stroke={tinta}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeOpacity={0.75}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );

  return (
    <span
      ref={raiz}
      className={`relative ${naMargem ? "block pl-6" : "inline-block"} ${className}`}
    >
      {naMargem ? (
        children
      ) : (
        <span
          className={`font-serif text-[1.05rem] italic ${noEscuro ? "text-khaki" : "text-khaki-ink"}`}
        >
          {children}
        </span>
      )}

      {traco}

      <span
        className={`an-lapis pointer-events-none absolute ${noEscuro ? "text-khaki" : "text-khaki-ink"} ${
          naMargem ? "top-0 -left-[7px]" : "-bottom-[18px] left-0"
        }`}
        aria-hidden="true"
      >
        <Lapis size={19} />
      </span>
    </span>
  );
}
