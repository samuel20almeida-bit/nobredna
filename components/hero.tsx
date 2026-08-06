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
import { HelixMark } from "@/components/icons";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Metade da capa: as duas juntas formam uma capa contínua quando fechada.
 * O livro é o único objeto escuro da página — por isso ele pesa sem que a
 * página inteira precise pesar junto.
 */
function CoverHalf({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-y-0 w-[200%]"
        style={{ left: side === "left" ? 0 : "-100%" }}
      >
        <div
          className="grain grain-on-dark relative h-full w-full"
          style={{
            background:
              "linear-gradient(155deg,#0a2440 0%,#011638 52%,#010e26 100%)",
          }}
        >
          <div className="absolute inset-[8%] border border-khaki/20" />

          <div className="relative flex h-full flex-col items-center justify-center gap-7 px-[13%] text-center">
            <span className="text-lavender">
              <HelixMark size={30} />
            </span>
            <h2 className="font-serif text-[clamp(1.6rem,3.6vw,2.7rem)] leading-[1.06] font-light text-almond">
              Nobre
              <br />
              DNA
            </h2>
            <span className="font-serif text-[0.95rem] text-khaki italic">
              assessoria editorial
            </span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-8"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          background:
            side === "left"
              ? "linear-gradient(to right,transparent,rgb(1 10 26 / .45))"
              : "linear-gradient(to left,transparent,rgb(1 10 26 / .45))",
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
        background: "linear-gradient(180deg,#f4ede5 0%,#e5dacd 100%)",
        boxShadow: "var(--shadow-panel)",
      }}
    >
      <div
        className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right,transparent,rgb(1 22 56 / .09) 48%,rgb(1 22 56 / .09) 52%,transparent)",
        }}
      />

      <div className="relative flex h-full items-center justify-center px-[14%]">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="font-serif text-[clamp(1.15rem,2.1vw,1.7rem)] leading-[1.45] font-light text-ink/85">
            Um original é matéria-prima.
            <br />O livro vem depois da mesa.
          </p>
          <span className="h-px w-8 bg-khaki" />
          <span className="font-serif text-[0.95rem] text-ink/45 italic">
            desde 2011, em São Paulo
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
    const t = window.setTimeout(() => setOpen(true), reduced ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <section
      ref={section}
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-almond pt-28 pb-20 lg:pb-24"
    >
      <div className="glow-lavender pointer-events-none absolute inset-x-0 top-[-6%] h-[70%]" />

      <div className="pointer-events-none absolute inset-y-[-25%] right-[-14%] w-[min(52vw,300px)] opacity-45 sm:right-[-4%] sm:opacity-60 lg:right-[13%] lg:w-[min(30vw,420px)] lg:opacity-100">
        <Helix
          className="relative h-full w-full"
          width={150}
          viewHeight={1100}
          turns={5}
          rungsPerTurn={10}
          strokeWidth={1.2}
          y={helixY}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-10 px-6 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10">
        <motion.div style={{ y: reduced ? 0 : textY }} className="max-w-[34rem]">
          <motion.p
            className="label"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
          >
            assessoria editorial
          </motion.p>

          <h1 className="mt-6 text-[clamp(2.9rem,7vw,5.2rem)] leading-[0.98] font-light text-ink">
            {["Seu livro existe.", "Falta o trabalho", "de mesa."].map(
              (line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.6 + i * 0.22, ease }}
                >
                  {i === 2 ? (
                    <span className="text-lavender-ink italic">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              ),
            )}
          </h1>

          <motion.p
            className="mt-8 max-w-[29rem] text-[1.02rem] leading-[1.85] text-ink/60"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.55, ease }}
          >
            Somos uma assessoria editorial. Lemos, preparamos, revisamos,
            desenhamos e pomos para circular livros sobre origem, continuidade
            e o que uma geração entrega à seguinte. O livro continua sendo do
            autor — nós assinamos só o ofício.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.95, ease }}
          >
            <Link
              href="#servicos"
              className="group font-serif text-[1.2rem] text-ink transition-colors duration-500 hover:text-lavender-ink"
            >
              O que a casa faz
              <span className="mt-1.5 block h-px w-full origin-left scale-x-100 bg-ink/25 transition-colors duration-500 group-hover:bg-lavender-ink" />
            </Link>
            <Link
              href="/publique"
              className="font-serif text-[1.2rem] text-ink/45 italic transition-colors duration-500 hover:text-ink/80"
            >
              enviar meu original
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: reduced ? 0 : bookY, opacity: bookOpacity }}
          className="relative mx-auto w-[min(62vw,290px)] sm:w-[min(56vw,330px)] lg:w-[min(30vw,380px)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.5, ease }}
          >
            <Opening
              className="aspect-[3/4.05] w-full"
              open={open}
              angle={72}
              duration={2}
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
        className="pointer-events-none absolute inset-x-0 bottom-9 flex justify-center"
      >
        <motion.span
          className="flex flex-col items-center gap-3 font-serif text-[0.95rem] text-ink/35 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.7, ease }}
        >
          role
          <span className="block h-10 w-px bg-gradient-to-b from-ink/25 to-transparent" />
        </motion.span>
      </motion.div>
    </section>
  );
}
