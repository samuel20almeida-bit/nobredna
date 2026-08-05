"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Stamp } from "@/components/icons";

type Estado = "idle" | "enviando" | "ok" | "erro";

/**
 * Ritmo da seção: seco e mecânico — dois passos, sem contemplação.
 * A confirmação usa o mesmo gesto de "abrir" do hero, em escala mínima:
 * a régua dourada corre e o texto assume o lugar do formulário.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEstado("enviando");
    setErro(null);
    try {
      const res = await fetch("/api/carta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro ?? "Não foi possível assinar.");
      setEstado("ok");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível assinar.");
      setEstado("erro");
    }
  }

  return (
    <section id="assine" className="relative bg-navy py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid items-center gap-12 border-y border-gold/15 py-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <Stamp size={16} />
              Carta mensal
            </p>
            <h2 className="mt-5 max-w-[18ch] text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.14] text-cream">
              Uma carta por mês, sobre um livro só.
            </h2>
            <p className="mt-6 max-w-[32rem] text-[0.98rem] leading-[1.8] text-cream/55">
              Escrevemos sobre o título que entrou em catálogo, o motivo da
              escolha e o trecho que sustentou a decisão. Sem calendário
              comercial, sem promoção.
            </p>
          </div>

          <div className="relative min-h-[9rem]">
            <AnimatePresence mode="wait">
              {estado === "ok" ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-5"
                >
                  <motion.span
                    className="block h-px bg-gold origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.p
                    className="font-serif text-[1.35rem] leading-snug text-gold-light"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                  >
                    Está registrado.
                  </motion.p>
                  <motion.p
                    className="text-[0.9rem] leading-relaxed text-cream/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    A próxima carta sai na primeira semana do mês, para{" "}
                    <span className="text-cream/75">{email}</span>.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  className="flex flex-col gap-4"
                >
                  <label
                    htmlFor="carta-email"
                    className="text-[0.62rem] tracking-[0.28em] uppercase text-cream/40"
                  >
                    Seu e-mail
                  </label>
                  <div className="flex items-center gap-4 border-b border-gold/30 pb-3 transition-colors duration-300 focus-within:border-gold">
                    <input
                      id="carta-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@dominio.com.br"
                      className="w-full bg-transparent text-[1rem] text-cream outline-none placeholder:text-cream/25"
                    />
                    <button
                      type="submit"
                      disabled={estado === "enviando"}
                      className="group flex shrink-0 items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-gold transition-opacity duration-300 hover:text-gold-light disabled:opacity-40"
                    >
                      {estado === "enviando" ? "Enviando" : "Assinar"}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  </div>
                  {erro && (
                    <p className="text-[0.8rem] text-gold-light/80">{erro}</p>
                  )}
                  <p className="text-[0.72rem] leading-relaxed text-cream/30">
                    Cancelamento em um clique, em qualquer carta.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
