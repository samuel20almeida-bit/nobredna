"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark } from "@/components/icons";
import { collections } from "@/lib/books";

/**
 * Ritmo da seção: médio, editorial.
 * O mecanismo aqui é outro — as linhas não sobem em fade, elas são reveladas
 * por um corte horizontal, como página virando sob a régua. Nenhuma seção do
 * site entra do mesmo jeito.
 */
export function Colecoes() {
  return (
    <section
      id="colecoes"
      className="grain relative overflow-hidden bg-cream py-24 text-navy lg:py-32"
    >
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow flex items-center gap-3 text-gold-ink">
              <Bookmark size={16} />
              O legado em três linhas
            </p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,3rem)] leading-[1.12] text-balance">
              Um catálogo se organiza como uma família:
              <span className="text-navy/45"> por linha de descendência.</span>
            </h2>
            <p className="mt-7 max-w-[30rem] text-[1rem] leading-[1.8] text-navy/65">
              As três coleções da casa não separam gêneros. Separam o momento em
              que a herança aparece — antes de você escolher, enquanto você
              segue, e depois que ela vira sua responsabilidade.
            </p>

            <dl className="mt-12 grid max-w-[26rem] grid-cols-3 gap-6 border-t border-navy/12 pt-8">
              {[
                { k: "Fundada", v: "2011" },
                { k: "Títulos", v: "08" },
                { k: "Tiragem", v: "Limitada" },
              ].map((stat) => (
                <div key={stat.k}>
                  <dt className="text-[0.6rem] tracking-[0.24em] uppercase text-navy/40">
                    {stat.k}
                  </dt>
                  <dd className="mt-2 font-serif text-[1.4rem] text-navy">
                    {stat.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul>
            {collections.map((collection, i) => (
              <motion.li
                key={collection.name}
                className="border-t border-navy/12 py-10 first:border-t-0 first:pt-0"
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.15 }}
                whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.95,
                  delay: i * 0.16,
                  ease: [0.33, 0.02, 0.15, 1],
                }}
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-serif text-[0.95rem] text-gold-ink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[clamp(1.5rem,3vw,2.15rem)] leading-tight">
                      Coleção {collection.name}
                    </h3>
                    <p className="mt-3 font-serif text-[1.1rem] leading-relaxed text-navy/70 italic">
                      {collection.line}
                    </p>
                    <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-[1.8] text-navy/55">
                      {collection.description}
                    </p>
                    <Link
                      href="#acervo"
                      className="group mt-6 inline-flex items-center gap-3 text-[0.7rem] tracking-[0.22em] uppercase text-gold-ink transition-colors duration-300 hover:text-navy"
                    >
                      Ver títulos
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
