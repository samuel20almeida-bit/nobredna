"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DivisorPerola } from "@/components/perola";

gsap.registerPlugin(useGSAP);

/* Espaço de desenho da página. O wrapper usa a mesma proporção, então o SVG
   nunca é esticado e os traços mantêm a espessura. */
const PAGINA = { w: 300, h: 405 };
const X0 = 46;
const LARGURA = 208;
const Y0 = 100;
const GAP = 28;

/** Larguras irregulares — é um datilografado, não um texto diagramado. */
const linhas = [0.97, 0.92, 1, 0.86, 0.97, 0.72, 0.95, 0.9, 0.6];

const y = (i: number) => Y0 + i * GAP;

/**
 * Marcas de revisão. São os gestos reais de quem prepara um original: corte,
 * intercalação, chamada de margem, palavra circulada.
 *
 * `pathLength={1}` normaliza o comprimento de cada traço, então o mesmo par
 * dasharray/dashoffset (1 → 0) desenha qualquer um deles sem medir no DOM.
 *
 * As coordenadas seguem `Y0`/`GAP`: mexer no ritmo das linhas exige reposicionar
 * as marcas junto, senão elas descolam do texto que corrigem.
 */
const marcas = [
  // corte na segunda linha
  "M64,128.5 C92,125.5 118,131.5 146,127.5 C172,124 186,130 196,127",
  // sinal de intercalação sob a quarta linha
  "M120,190 L127,182 L134,190",
  // a palavra que entra, escrita acima
  "M118,174 c5,-4 9,4 14,0 c4,-3 8,2 12,-1",
  // chamada de margem para o parágrafo do meio
  "M33,206 C36,218 30,236 33,248",
  // palavra circulada
  "M138,268 a26,10 0 1,1 -52,0 a26,10 0 1,1 52,0",
  // corte parcial na oitava linha
  "M150,296.5 C170,293.5 196,299 224,295.5",
  // anotação à margem direita, na altura da intercalação
  "M259,180 c4,-3 8,3 12,0 s6,-3 10,-1",
  "M259,188 c5,-3 9,3 13,0 s5,-2 8,0",
];

/**
 * O original vira livro.
 *
 * A página entra, o texto é datilografado, as marcas de revisão são feitas à
 * mão sobre ele — e então tudo isso se dissolve e sobra o texto limpo. É o
 * trabalho de mesa em quinze segundos, que é exatamente o que a casa vende.
 */
export function Manuscrito({ className = "" }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduzido: "(prefers-reduced-motion: reduce)",
          completo: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          // Sem movimento: entrega direto o estado final, que é o que importa.
          if (ctx.conditions?.reduzido) {
            gsap.set(".ms-rascunho", { autoAlpha: 0 });
            gsap.set(".ms-limpo-item", { autoAlpha: 1 });
            return;
          }

          gsap.set(".ms-limpo-item", {
            autoAlpha: 0,
            y: 20,
            filter: "blur(7px)",
          });

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(".ms-papel", {
            autoAlpha: 0,
            y: 46,
            scale: 0.965,
            rotateX: 9,
            duration: 1.5,
            ease: "power4.out",
          })
            // o texto sendo batido, linha a linha
            .from(
              ".ms-linha",
              {
                scaleX: 0,
                autoAlpha: 0,
                transformOrigin: "left center",
                duration: 0.5,
                stagger: 0.07,
              },
              "-=1",
            )
            // a caneta passa por cima
            .fromTo(
              ".ms-marca",
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                duration: 0.55,
                stagger: 0.13,
                ease: "power2.inOut",
              },
              "-=0.2",
            )
            .addLabel("mesa", "+=0.7")
            // e o que estava sujo se dissolve
            .to(
              ".ms-marca",
              { autoAlpha: 0, duration: 0.6, stagger: 0.04 },
              "mesa",
            )
            .to(
              ".ms-linha",
              {
                autoAlpha: 0,
                scaleX: 0.55,
                transformOrigin: "left center",
                duration: 0.75,
                stagger: 0.045,
              },
              "mesa+=0.12",
            )
            .to(
              ".ms-limpo-item",
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.18,
              },
              "mesa+=0.6",
            )
            // respiração contínua depois que assenta
            .to(".ms-papel", {
              y: -9,
              duration: 3.6,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
        },
        container,
      );

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className={`aspect-[300/405] [perspective:1400px] ${className}`}
    >
      <div
        className="ms-papel grain relative h-full w-full overflow-hidden [will-change:transform]"
        style={{
          background: "linear-gradient(180deg,#f4ede5 0%,#e5dacd 100%)",
          boxShadow: "var(--shadow-book)",
        }}
      >
        <svg
          viewBox={`0 0 ${PAGINA.w} ${PAGINA.h}`}
          className="ms-rascunho absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          {/* cabeçalho do original */}
          <rect
            className="ms-linha"
            x={X0}
            y={64}
            width={LARGURA * 0.44}
            height={4.6}
            rx={2.3}
            fill="#011638"
            fillOpacity={0.26}
          />

          {linhas.map((largura, i) => (
            <rect
              key={i}
              className="ms-linha"
              x={X0}
              y={y(i) - 1.7}
              width={LARGURA * largura}
              height={3.4}
              rx={1.7}
              fill="#011638"
              fillOpacity={0.16}
            />
          ))}

          <g
            fill="none"
            stroke="#7a5f42"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.75}
          >
            {marcas.map((d, i) => (
              <path
                key={i}
                className="ms-marca"
                d={d}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              />
            ))}
          </g>
        </svg>

        {/* o livro que sai da mesa */}
        <div className="absolute inset-0 flex items-center justify-center px-[9%]">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="ms-limpo-item font-serif text-[clamp(0.95rem,1.75vw,1.35rem)] leading-[1.5] font-light text-balance text-ink/85">
              Um original é matéria-prima.
              <br />O livro vem depois da mesa.
            </p>
            <DivisorPerola
              tone="light"
              width="7rem"
              className="ms-limpo-item"
            />
            <span className="ms-limpo-item font-serif text-[0.85rem] text-ink/45 italic">
              desde 2011, em São Paulo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
