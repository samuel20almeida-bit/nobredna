"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/book-cover";
import { Spines } from "@/components/icons";
import { collections, livrosDaAssessoria } from "@/lib/books";
import { formatBRL } from "@/lib/format";

type Filter = "Todos" | (typeof collections)[number]["name"];
const filters: Filter[] = ["Todos", "Origem", "Linhagem", "Herança"];

/**
 * Ritmo da seção: rápido e direto.
 * A grade entra quase instantânea — 0,32s por item, 40ms de intervalo, sem
 * deslocamento longo. É o oposto do hero de propósito: aqui o leitor veio
 * procurar, não contemplar.
 */
export function Acervo() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const visible = useMemo(
    () =>
      filter === "Todos"
        ? livrosDaAssessoria
        : livrosDaAssessoria.filter((b) => b.collection === filter),
    [filter],
  );

  return (
    <section id="acervo" className="relative bg-almond py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="hairline flex flex-col gap-8 border-b pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              className="label flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
            >
              <Spines size={17} />
              livros feitos aqui
            </motion.p>
            <motion.h2
              className="mt-5 max-w-[20ch] text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-light text-ink"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Livros que passaram por esta mesa.
              <span className="text-ink/40 italic">
                {" "}
                Todos deles, dos seus autores.
              </span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por coleção">
            {filters.map((name) => {
              const active = filter === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFilter(name)}
                  aria-pressed={active}
                  className={`flex min-h-11 items-center gap-2.5 rounded-full px-4 font-serif text-[1.05rem] transition-colors duration-200 ${
                    active
                      ? "bg-lavender/18 text-lavender-ink"
                      : "text-ink/45 hover:bg-ink/5 hover:text-ink/75"
                  }`}
                >
                  {/* a pérola marca a escolha; o espaço dela existe sempre,
                      para o botão não pular de largura ao ser selecionado */}
                  <span className="grid h-[7px] w-[7px] place-items-center">
                    <motion.span
                      className="block rounded-full bg-khaki"
                      initial={false}
                      animate={{
                        width: active ? 7 : 0,
                        height: active ? 7 : 0,
                        opacity: active ? 1 : 0,
                      }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {visible.map((book, i) => (
            <motion.li
              key={book.slug}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.32,
                delay: Math.min(i, 7) * 0.04,
                ease: "easeOut",
              }}
            >
              <Link href={`/livro/${book.slug}`} className="group block">
                <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
                  <BookCover book={book} />
                </div>

                <div className="mt-6">
                  <h3 className="font-serif text-[1.3rem] leading-snug text-ink transition-colors duration-200 group-hover:text-lavender-ink">
                    {book.title}
                  </h3>
                  <p className="mt-1 font-serif text-[1.02rem] text-ink/45 italic">
                    {book.author}
                  </p>
                  <p className="mt-3 text-[0.85rem] tabular-nums text-khaki-ink">
                    {formatBRL(book.priceCents)}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
