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
      className="grain grain-on-dark relative overflow-hidden bg-ink py-24 text-almond lg:py-32"
    >
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="label label-on-dark flex items-center gap-3">
              <Bookmark size={16} />
              o legado em três linhas
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-light text-balance">
              Um catálogo se organiza como uma família:
              <span className="text-almond/45 italic"> por linha de descendência.</span>
            </h2>
            <p className="mt-7 max-w-[30rem] text-[1rem] leading-[1.85] text-almond/60">
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
                  <dt className="text-[0.6rem] font-serif italic text-navy/40">
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
                className="hairline-on-dark border-t py-10 first:border-t-0 first:pt-0"
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
                  <span className="font-serif text-[1.05rem] text-khaki italic">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[clamp(1.7rem,3.2vw,2.4rem)] leading-tight font-light">
                      Coleção {collection.name}
                    </h3>
                    <p className="mt-3 font-serif text-[1.25rem] leading-relaxed text-lavender italic">
                      {collection.line}
                    </p>
                    <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-[1.85] text-almond/50">
                      {collection.description}
                    </p>
                    <Link
                      href="#acervo"
                      className="group mt-6 inline-flex items-center gap-3 font-serif text-[1.08rem] text-khaki transition-colors duration-300 hover:text-almond"
                    >
                      ver títulos
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
