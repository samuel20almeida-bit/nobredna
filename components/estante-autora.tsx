"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/book-cover";
import { livrosDaAutora } from "@/lib/books";
import { formatBRL } from "@/lib/format";

/**
 * A estante da autora.
 *
 * Sem filtro por coleção, ao contrário do acervo: são poucos títulos e todos
 * da mesma pessoa — um filtro aqui seria móvel de loja grande numa estante de
 * casa. O que a vitrine precisa dizer é o formato, porque devocional e leitura
 * corrida se compram por motivos diferentes.
 */
export function EstanteAutora() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:gap-x-8">
      {livrosDaAutora.map((book, i) => (
        <motion.li
          key={book.slug}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.4,
            delay: Math.min(i, 6) * 0.06,
            ease: "easeOut",
          }}
        >
          <Link href={`/livro/${book.slug}`} className="group block">
            <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
              <BookCover book={book} />
            </div>

            <div className="mt-6">
              <p className="font-serif text-[0.98rem] text-khaki-ink italic">
                {book.formato === "devocional"
                  ? "devocional"
                  : "leitura corrida"}
              </p>
              <h3 className="mt-1 font-serif text-[1.3rem] leading-snug text-ink transition-colors duration-200 group-hover:text-lavender-ink">
                {book.title}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/50">
                {book.line}
              </p>
              <p className="mt-3 text-[0.85rem] tabular-nums text-khaki-ink">
                {formatBRL(book.priceCents)}
              </p>
            </div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
