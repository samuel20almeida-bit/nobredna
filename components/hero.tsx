"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HeroBook } from "@/components/literary-interactions";

export function Hero() {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 18 };
  return (
    <section className="brand-paper grain relative isolate flex items-center overflow-hidden pt-24 pb-8 md:min-h-[min(840px,100svh)] md:pt-28 md:pb-16 lg:pt-32 lg:pb-24">
      <div aria-hidden="true" className="hero-frame pointer-events-none absolute inset-x-4 inset-y-5 rounded-[24px] border border-khaki-ink/25 sm:inset-x-6 lg:inset-x-12" />
      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-4 px-7 sm:gap-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:px-14">
        <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="max-w-[38rem]">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-khaki-ink/45" aria-hidden="true" />
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-khaki-ink">Casa de Legados</p>
          </div>
          <h1 className="mt-4 text-[clamp(2.65rem,10vw,3.5rem)] leading-[0.98] text-ink md:mt-6 md:text-[clamp(3rem,7.1vw,5.5rem)]">
            Toda história merece deixar <em className="block text-vinho">um legado.</em>
          </h1>
          <p className="mt-4 max-w-[34rem] text-base leading-[1.6] text-ink/75 md:mt-7 md:leading-[1.9] lg:text-[1.1rem]">
            Histórias reais em livros memoráveis. A NobreDNA acolhe autoras,
            coautorias e projetos editoriais — da primeira conversa à publicação.
          </p>
          <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 md:mt-7 md:gap-4">
            <Link href="/publique" className="gold-shimmer inline-flex min-h-14 w-full items-center justify-center bg-vinho px-5 py-4 text-center font-serif text-[1.2rem] text-almond transition-colors hover:bg-vinho-soft rounded-sm shadow-lift sm:w-auto sm:px-7">
              Quero publicar minha história
            </Link>
            <Link href="/livros" className="inline-flex min-h-11 items-center font-serif text-[1.2rem] italic text-vinho underline decoration-khaki-ink/45 underline-offset-4 hover:text-ink">
              Conhecer os livros da Casa
            </Link>
          </div>
          <p className="mt-9 hidden text-xs font-medium uppercase tracking-[0.15em] text-khaki-ink md:block">Autorais · Coautorias · Projetos</p>
        </motion.div>

        <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.25 }} className="mx-auto w-full max-w-[190px] sm:max-w-[300px] md:max-w-[410px] lg:max-w-none">
          <HeroBook/>
        </motion.div>
      </div>
    </section>
  );
}
