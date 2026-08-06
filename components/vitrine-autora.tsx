"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EstanteAutora } from "@/components/estante-autora";
import { ArrowRight } from "@/components/icons";
import { autora } from "@/lib/autora";

/**
 * Os livros dela na home.
 *
 * Vem antes da seção de serviços de propósito: é o que a casa já vende hoje, e
 * é o que a maior parte de quem chega por indicação veio buscar. A assessoria
 * pode esperar mais um scroll.
 */
export function VitrineAutora() {
  return (
    // O bloco da loja na home usa o sépia da /livros: quem desce a página
    // atravessa o mesmo chão que encontrará ao entrar por aquela porta.
    <section id="livros" className="grain relative bg-sepia py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="hairline flex flex-col gap-8 border-b pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              className="label label-on-sepia"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
            >
              meus livros
            </motion.p>
            <motion.h2
              className="mt-5 max-w-[20ch] text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-light text-almond"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Escritos para dias comuns.
              <span className="text-almond/45 italic">
                {" "}
                Leia um antes de levar.
              </span>
            </motion.h2>
          </div>

          <Link
            href="/livros"
            className="group inline-flex shrink-0 items-center gap-3 font-serif text-[1.12rem] text-khaki transition-colors duration-500 hover:text-almond"
          >
            todos os livros
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        <div className="mt-12">
          <EstanteAutora />
        </div>

        <p className="mt-12 max-w-[34rem] font-serif text-[1.1rem] leading-relaxed text-almond/45 italic">
          {autora.chamada}
        </p>
      </div>
    </section>
  );
}
