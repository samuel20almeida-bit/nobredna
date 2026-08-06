"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Helix } from "@/components/helix";
import { Manuscrito } from "@/components/manuscrito";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  const helixRaw = useTransform(scrollYProgress, [0, 1], [0, -420]);
  const helixY = useSpring(helixRaw, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.4,
  });
  const bookY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const bookOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
      ref={section}
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-almond pt-28 pb-20 lg:pb-24"
    >
      <div className="glow-lavender pointer-events-none absolute inset-x-0 top-[-6%] h-[70%]" />

      {/* marca d'água: a hélice deixou de ser uma tira lateral e virou o fundo
          da seção inteira — presença sem disputar espaço com o texto */}
      <div className="pointer-events-none absolute inset-y-[-30%] left-1/2 w-[min(88vw,430px)] -translate-x-1/2 opacity-70 lg:w-[min(46vw,520px)]">
        <Helix
          className="relative h-full w-full"
          width={300}
          viewHeight={1350}
          turns={3}
          rungsPerTurn={9}
          strokeWidth={1.15}
          intensity={0.45}
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
          <Manuscrito className="w-full" />
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
