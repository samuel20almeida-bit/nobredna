"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 18 };
  return (
    <section className="brand-paper grain relative isolate flex min-h-[min(840px,100svh)] items-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 inset-y-5 border border-khaki-ink/12 sm:inset-x-6 lg:inset-x-12" />
      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-8 px-6 sm:gap-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:px-14">
        <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="max-w-[38rem]">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-khaki-ink/45" aria-hidden="true" />
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.23em] text-khaki-ink">Casa de Legados</p>
          </div>
          <h1 className="mt-6 text-[clamp(3rem,7.1vw,5.5rem)] leading-[0.98] text-ink">
            Toda história merece deixar <em className="block text-vinho">um legado.</em>
          </h1>
          <p className="mt-7 max-w-[34rem] text-base leading-[1.9] text-ink/75 lg:text-[1.1rem]">
            Histórias reais em livros memoráveis. A NobreDNA acolhe autoras,
            coautorias e projetos editoriais — da primeira conversa à publicação.
          </p>
          <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            <Link href="/publique" className="inline-flex min-h-14 w-full items-center justify-center bg-vinho px-5 py-4 text-center font-serif text-[1.2rem] text-almond transition-colors hover:bg-vinho-soft rounded-sm shadow-lift sm:w-auto sm:px-7">
              Quero publicar minha história
            </Link>
            <Link href="/livros" className="border-b border-khaki-ink/45 pb-1 font-serif text-[1.2rem] italic text-vinho hover:text-ink">
              Conhecer os livros da Casa
            </Link>
          </div>
          <p className="mt-9 text-xs font-medium uppercase tracking-[0.15em] text-khaki-ink">Autorais · Coautorias · Projetos</p>
        </motion.div>

        <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.25 }} className="mx-auto w-full max-w-[410px] lg:max-w-none">
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-[480px]">
            <Image src="/brand/hero-livro-isolado.webp" alt="Livro antigo de capa dura bordô com o selo dourado da NobreDNA" fill priority unoptimized sizes="(max-width: 1023px) 410px, (max-width: 1240px) 42vw, 480px" className="object-contain object-center" />
          </figure>
          <p className="mt-4 text-center font-serif text-base italic text-khaki-ink">O primeiro capítulo começa com uma conversa.</p>
        </motion.div>
      </div>
    </section>
  );
}
