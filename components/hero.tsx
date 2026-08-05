"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Helix } from "@/components/helix";
import { Opening } from "@/components/opening";
import { ArrowRight, Crown, HelixMark } from "@/components/icons";

const ease = [0.16, 1, 0.3, 1] as const;

/** Metade da capa: as duas juntas formam uma capa contínua quando fechada. */
function CoverHalf({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-y-0 w-[200%]"
        style={{ left: side === "left" ? 0 : "-100%" }}
      >
        <div
          className="grain relative h-full w-full"
          style={{
            background:
              "linear-gradient(155deg,#1b2b4a 0%,#0f1b33 48%,#080f1f 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(118deg,rgb(232 217 168 / .14) 0%,transparent 42%)",
            }}
          />
          <div className="absolute inset-[7%] border border-gold/25" />
          <div className="absolute inset-[7%] m-[3px] border border-gold/10" />

          <div className="relative flex h-full flex-col items-center justify-center gap-6 px-[12%] text-center">
            <span className="text-gold">
              <Crown size={34} />
            </span>
            <div className="h-px w-16 bg-gold/35" />
            <h2 className="font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.1] text-gold-light">
              Editora
              <br />
              Nobre DNA
            </h2>
            <span
              className="text-[0.6rem] text-gold/65"
              style={{ letterSpacing: "0.42em", textTransform: "uppercase" }}
            >
              Catálogo 2026
            </span>
          </div>
        </div>
      </div>

      {/* dobradiça central escurece a face virada para dentro */}
      <div
        className="pointer-events-none absolute inset-y-0 w-8"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          background:
            side === "left"
              ? "linear-gradient(to right,transparent,rgb(6 11 22 / .55))"
              : "linear-gradient(to left,transparent,rgb(6 11 22 / .55))",
        }}
      />
    </div>
  );
}

/** Miolo revelado — a página aberta. */
function Spread() {
  return (
    <div
      className="grain relative h-full w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg,#f7f3ea 0%,#ece5d5 100%)",
        boxShadow: "var(--shadow-panel)",
      }}
    >
      {/* vinco central */}
      <div
        className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right,transparent,rgb(15 27 51 / .16) 48%,rgb(15 27 51 / .16) 52%,transparent)",
        }}
      />

      <div className="relative flex h-full items-center justify-center px-[14%]">
        <div className="flex flex-col items-center gap-5 text-center text-navy">
          <span className="text-gold-deep">
            <HelixMark size={30} />
          </span>
          <p className="font-serif text-[clamp(1.05rem,2vw,1.6rem)] leading-[1.45] text-navy/90">
            Toda casa editorial guarda uma pergunta.
            <br />A nossa é o que se transmite.
          </p>
          <div className="h-px w-10 bg-navy/25" />
          <span
            className="text-[0.55rem] text-navy/55"
            style={{ letterSpacing: "0.36em", textTransform: "uppercase" }}
          >
            Desde 2011 · São Paulo
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  // a hélice desliza no próprio eixo — lê-se como rotação contínua
  const helixRaw = useTransform(scrollYProgress, [0, 1], [0, -640]);
  const helixY = useSpring(helixRaw, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.4,
  });
  const bookY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const bookOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  useEffect(() => {
    // o livro abre sozinho, depois que a página assenta — ritmo cinematográfico
    const t = window.setTimeout(() => setOpen(true), reduced ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <section
      ref={section}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy pt-28 pb-20 lg:pb-24"
    >
      <div className="glow-gold pointer-events-none absolute inset-x-0 top-[-10%] h-[80%]" />

      {/* hélice do hero: atravessa a seção inteira e continua para baixo */}
      <div className="pointer-events-none absolute inset-y-[-25%] right-[-14%] w-[min(52vw,300px)] opacity-30 sm:right-[-4%] sm:opacity-45 lg:right-[14%] lg:w-[min(30vw,420px)] lg:opacity-100">
        {/* brilho difuso atrás da fita — só CSS, para não criar borda dura */}
        <div className="glow-gold absolute inset-x-[-120%] inset-y-[18%]" />
        <Helix
          className="relative h-full w-full"
          width={150}
          viewHeight={1100}
          turns={5}
          rungsPerTurn={10}
          strokeWidth={1.4}
          y={helixY}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-6 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10">
        <motion.div style={{ y: reduced ? 0 : textY }} className="max-w-[36rem]">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
          >
            Editora Nobre DNA
          </motion.p>

          <h1 className="mt-7 text-[clamp(2.6rem,6.2vw,4.6rem)] leading-[1.04] text-balance text-cream">
            {["Cada linhagem", "tem um livro", "por escrever."].map(
              (line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.4,
                    delay: 0.6 + i * 0.22,
                    ease,
                  }}
                >
                  {i === 2 ? (
                    <span className="text-gold-light">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              ),
            )}
          </h1>

          <motion.p
            className="mt-8 max-w-[30rem] text-[1.0625rem] leading-[1.75] text-cream/70"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.55, ease }}
          >
            Publicamos obras sobre origem, continuidade e o que uma geração
            entrega à seguinte. Um catálogo curto, editado com o cuidado de
            quem sabe que o livro vai durar mais que todos nós.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.95, ease }}
          >
            <Link
              href="#acervo"
              className="group inline-flex items-center gap-3 border border-gold/40 px-7 py-3.5 text-[0.8rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-500 hover:border-gold hover:bg-gold/8"
            >
              Ver o acervo
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={17} />
              </span>
            </Link>
            <Link
              href="/publique"
              className="text-[0.8rem] tracking-[0.2em] uppercase text-cream/55 underline decoration-gold/30 underline-offset-[7px] transition-colors duration-500 hover:text-gold-light hover:decoration-gold"
            >
              Publique seu livro
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: reduced ? 0 : bookY, opacity: bookOpacity }}
          className="relative mx-auto w-[min(62vw,300px)] sm:w-[min(56vw,340px)] lg:w-[min(30vw,400px)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.5, ease }}
          >
            <Opening
              className="aspect-[3/4.05] w-full"
              open={open}
              angle={72}
              duration={2}
              delay={0}
              left={<CoverHalf side="left" />}
              right={<CoverHalf side="right" />}
              inner={<Spread />}
              innerClassName="[transform:translateZ(-12px)]"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <motion.span
          className="flex flex-col items-center gap-3 text-[0.6rem] tracking-[0.36em] uppercase text-cream/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.7, ease }}
        >
          role
          <span className="block h-10 w-px bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.span>
      </motion.div>
    </section>
  );
}
