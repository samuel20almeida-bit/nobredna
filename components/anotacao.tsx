"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lapis } from "@/components/icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Anotação à margem: a frase que alguém sublinhou a lápis.
 *
 * O traço é feito quando a frase entra em cena, e o lápis o acompanha da
 * esquerda para a direita — o mesmo gesto do manuscrito do hero, aplicado ao
 * texto corrido do site.
 *
 * O sublinhado é esticado horizontalmente (`preserveAspectRatio="none"`) para
 * acompanhar a largura da frase; `vector-effect="non-scaling-stroke"` impede
 * que a espessura do traço estique junto. O lápis fica fora do SVG justamente
 * para não sofrer essa deformação.
 *
 * O traço é revelado por `clip-path`, não pelo DrawSVGPlugin: o plugin mede o
 * path com `getTotalLength()`, e o navegador se recusa a medir um path que
 * combina `non-scaling-stroke` com escala não proporcional — o resultado é um
 * `stroke-dasharray` degenerado e um traço que nunca aparece. O clip revela o
 * desenho já na forma final e não depende de medição nenhuma.
 */
export function Anotacao({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const raiz = useRef<HTMLSpanElement>(null);

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

          tl.fromTo(
            ".an-traco",
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power1.inOut",
            },
          )
            .fromTo(
              ".an-lapis",
              { autoAlpha: 0, x: 0 },
              { autoAlpha: 1, duration: 0.18 },
              0,
            )
            .to(
              ".an-lapis",
              {
                x: () => (raiz.current?.offsetWidth ?? 0) - 8,
                duration: 1.1,
                ease: "power1.inOut",
              },
              0,
            )
            .to(".an-lapis", { autoAlpha: 0, duration: 0.28 }, ">-0.18");
        },
        raiz,
      );

      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <span ref={raiz} className={`relative inline-block ${className}`}>
      <span className="font-serif text-[1.05rem] text-khaki-ink italic">
        {children}
      </span>

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
          stroke="#7a5f42"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeOpacity={0.75}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span
        className="an-lapis pointer-events-none absolute -bottom-[18px] left-0 text-khaki-ink"
        aria-hidden="true"
      >
        <Lapis size={19} />
      </span>
    </span>
  );
}
