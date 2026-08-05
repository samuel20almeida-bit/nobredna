"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/book-cover";
import { Spines } from "@/components/icons";
import { books, collections } from "@/lib/books";
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
    () => (filter === "Todos" ? books : books.filter((b) => b.collection === filter)),
    [filter],
  );

  return (
    <section id="acervo" className="relative bg-navy py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 border-b border-gold/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              className="eyebrow flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
            >
              <Spines size={16} />
              Acervo Nobre
            </motion.p>
            <motion.h2
              className="mt-5 max-w-[20ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.12] text-cream"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Oito títulos em catálogo.
              <span className="text-cream/45"> Nenhum por acaso.</span>
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
                  className={`border px-4 py-2 text-[0.68rem] tracking-[0.2em] uppercase transition-colors duration-200 ${
                    active
                      ? "border-gold bg-gold/12 text-gold-light"
                      : "border-gold/20 text-cream/50 hover:border-gold/50 hover:text-cream/80"
                  }`}
                >
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
                  <h3 className="text-[1.05rem] leading-snug text-cream transition-colors duration-200 group-hover:text-gold-light">
                    {book.title}
                  </h3>
                  <p className="mt-1.5 text-[0.8rem] text-cream/45">
                    {book.author}
                  </p>
                  <p className="mt-3 text-[0.85rem] tabular-nums text-gold">
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
