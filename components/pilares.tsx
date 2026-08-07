"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DivisorPerola } from "@/components/perola";
import { epigrafe, manifesto, pilares } from "@/lib/casa";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Os sete pilares e o manifesto, direto do livro de marca dela.
 *
 * A ordem não é decorativa: a fé vem primeiro porque é assim que ela escreveu
 * — "antes de qualquer planejamento existiu uma oração". O site inteiro vinha
 * tratando a fé como subtexto discreto; no livro dela ela é o primeiro pilar,
 * abre com o Salmo 127:1 e tem um capítulo que é uma oração pela Casa.
 *
 * A revelação usa GSAP e não framer-motion pelo mesmo motivo das coleções: o
 * framer 12.43 não anima `clipPath: inset(...)`, falha em silêncio e trava o
 * elemento invisível.
 */
export function Pilares() {
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
          if (ctx.conditions?.reduzido) return;

          gsap.utils.toArray<HTMLElement>(".pil-item").forEach((el, i) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: Math.min(i, 3) * 0.09,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
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
      id="pilares"
      className="grain grain-on-dark relative overflow-hidden bg-ink py-24 text-almond lg:py-32"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 lg:px-10">
        {/* a epígrafe que abre o livro dela abre também esta seção */}
        <figure className="mx-auto max-w-[38rem] text-center">
          <blockquote className="font-serif text-[clamp(1.4rem,3vw,2.1rem)] leading-[1.45] text-almond/90 italic">
            “{epigrafe.texto}”
          </blockquote>
          <figcaption className="mt-5 font-serif text-[1.05rem] text-khaki italic">
            {epigrafe.referencia}
          </figcaption>
        </figure>

        <DivisorPerola tone="dark" className="mt-14" width="min(14rem,40%)" />

        <p className="label label-on-dark mt-20">os pilares da Casa</p>
        <h2 className="mt-5 max-w-[22ch] text-[clamp(2rem,4.2vw,3rem)] leading-[1.06] font-light text-almond">
          Nenhuma construção permanece firme
          <span className="text-almond/45 italic">
            {" "}
            só pela beleza da fachada.
          </span>
        </h2>

        <ul className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-20">
          {pilares.map((pilar, i) => (
            <li key={pilar.id} className="pil-item hairline-on-dark border-t pt-7">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-[1rem] text-khaki italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(1.5rem,2.8vw,1.95rem)] leading-tight font-light text-almond">
                  {pilar.nome}
                </h3>
              </div>

              <p className="mt-4 font-serif text-[1.18rem] leading-relaxed text-lavender italic">
                {pilar.linha}
              </p>
              <p className="mt-3 text-[0.95rem] leading-[1.85] text-almond/55">
                {pilar.texto}
              </p>
            </li>
          ))}
        </ul>

        {/* o manifesto: onze linhas, todas dela */}
        <div className="mt-24 max-w-[46rem]">
          <p className="label label-on-dark">o manifesto</p>
          <ul className="mt-8 space-y-4">
            {manifesto.map((linha) => (
              <li
                key={linha}
                className="pil-item font-serif text-[clamp(1.1rem,2.2vw,1.45rem)] leading-[1.5] text-almond/80"
              >
                <span className="text-khaki">Acreditamos que</span> {linha}.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
