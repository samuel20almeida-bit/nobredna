"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Quill } from "@/components/icons";
import { livrosDaAutora } from "@/lib/books";

/**
 * As duas portas da casa.
 *
 * Quem chega aqui quer uma de duas coisas muito diferentes: comprar um livro
 * (leitora, decisão rápida) ou entregar um original (autor, decisão longa e
 * desconfiada). Misturar as duas numa vitrine só faz as duas perderem — então
 * a home bifurca cedo, com o mesmo peso visual de cada lado, e cada porta
 * assume o tom de quem vai entrar por ela.
 */
const portas = [
  {
    href: "/livros",
    Icon: Bookmark,
    etiqueta: "para ler",
    titulo: "Os livros",
    texto:
      "Devocionais curtos, para caber numa manhã de verdade. Cada título tem um dia inteiro para ler antes de decidir.",
    acao: "ver os livros",
    // sépia: o chão da leitora, repetido em toda a /livros
    fundo: "bg-sepia hover:bg-sepia-soft",
    acento: "text-khaki",
    rotulo: "label-on-sepia",
  },
  {
    href: "/publique",
    Icon: Quill,
    etiqueta: "para publicar",
    titulo: "A assessoria",
    texto:
      "Leitura, preparação, revisão, projeto gráfico e registro do seu original. O diagnóstico é gratuito, e o livro continua seu.",
    acao: "enviar meu original",
    // azul-tinta: o chão do autor cliente, repetido em toda a /publique
    fundo: "bg-ink hover:bg-ink-soft",
    acento: "text-lavender",
    rotulo: "label-on-dark",
  },
];

export function Portas() {
  return (
    <section className="relative bg-almond-deep/35 py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
        <ul className="grid gap-px overflow-hidden bg-almond-deep md:grid-cols-2">
          {portas.map((porta, i) => (
            <motion.li
              key={porta.href}
              className={porta.fundo}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={porta.href}
                className="group flex h-full flex-col px-8 py-11 transition-colors duration-500 sm:px-11 sm:py-14"
              >
                <p className={`label ${porta.rotulo} flex items-center gap-3`}>
                  <porta.Icon size={17} />
                  {porta.etiqueta}
                </p>

                <h2 className="mt-6 text-[clamp(1.8rem,3.6vw,2.5rem)] leading-tight font-light text-almond">
                  {porta.titulo}
                </h2>

                <p className="mt-4 max-w-[26rem] flex-1 text-[0.98rem] leading-[1.85] text-almond/60">
                  {porta.texto}
                </p>

                <span
                  className={`mt-8 inline-flex items-center gap-3 font-serif text-[1.12rem] ${porta.acento}`}
                >

                  {porta.acao}
                  <span className="transition-transform duration-500 group-hover:translate-x-1.5">
                    <ArrowRight size={16} />
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <p className="mt-8 text-center font-serif text-[1.05rem] text-ink/40 italic">
          {livrosDaAutora.length} títulos publicados · assessoria aberta o ano
          inteiro
        </p>
      </div>
    </section>
  );
}
