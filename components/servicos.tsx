"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@/components/icons";
import { Anotacao } from "@/components/anotacao";
import { servicos } from "@/lib/servicos";

/**
 * Ritmo da seção: cadenciado, uma etapa de cada vez.
 * Cada linha entra deslizando um pouco depois da anterior — a leitura
 * acompanha a ordem do trabalho, que é sequencial na vida real também.
 */
export function Servicos() {
  return (
    <section id="servicos" className="grain grain-on-dark relative bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
        <div className="max-w-[42rem]">
          <motion.p
            className="label label-on-dark"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            o que a casa faz
          </motion.p>
          <motion.h2
            className="mt-5 text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-light text-almond"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Um livro não fica pronto sozinho.
            <span className="text-almond/40 italic">
              {" "}
              Alguém precisa sentar à mesa com ele.
            </span>
          </motion.h2>
          <motion.p
            className="mt-7 max-w-[34rem] text-[1rem] leading-[1.85] text-almond/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            A Nobre DNA é uma assessoria editorial. O livro é do autor — a
            ideia, os direitos, a última palavra. O que fica com a casa é o
            ofício: ler, preparar, revisar, desenhar e pôr para circular.
          </motion.p>
        </div>

        <ul className="mt-16">
          {servicos.map((servico, i) => (
            <motion.li
              key={servico.id}
              className="hairline-on-dark border-t py-9 last:border-b"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: Math.min(i, 5) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.4fr_0.7fr] md:items-baseline md:gap-10">
                <h3 className="text-[clamp(1.4rem,2.6vw,1.85rem)] leading-tight font-light text-almond">
                  {servico.nome}
                </h3>

                <div>
                  <p className="font-serif text-[1.2rem] leading-relaxed text-lavender italic">
                    {servico.linha}
                  </p>
                  <p className="mt-3 max-w-[38rem] text-[0.95rem] leading-[1.85] text-almond/55">
                    {servico.descricao}
                  </p>
                </div>

                <p className="font-serif text-[1rem] text-khaki italic md:text-right">
                  {servico.entrega}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link
            href="/publique"
            className="group inline-flex items-center gap-3 rounded-full bg-almond px-8 py-4 font-serif text-[1.15rem] text-ink transition-colors duration-500 hover:bg-almond-lift"
          >
            Enviar meu original
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight size={17} />
            </span>
          </Link>
          <p className="mt-6">
            <Anotacao tom="escuro">
              o diagnóstico é gratuito, e a resposta sai em até 30 dias
            </Anotacao>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
