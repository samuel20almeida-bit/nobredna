"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Seal } from "@/components/icons";

const campos = [
  { name: "nome", label: "Seu nome", type: "text", placeholder: "" },
  { name: "email", label: "E-mail", type: "email", placeholder: "" },
  { name: "titulo", label: "Título provisório", type: "text", placeholder: "" },
] as const;

export function PropostaForm() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok">("idle");
  const [erro, setErro] = useState<string | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setEstado("enviando");
    setErro(null);

    try {
      const res = await fetch("/api/proposta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro ?? "Não foi possível enviar.");
      setProtocolo(data.protocolo ?? null);
      setEstado("ok");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar.");
      setEstado("idle");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {estado === "ok" ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border border-almond/30 bg-lavender/5 px-8 py-12 text-center"
        >
          <span className="mx-auto block w-fit text-lavender">
            <Seal size={30} />
          </span>
          <p className="mt-6 font-serif text-[1.5rem] text-almond">
            Seu manuscrito entrou na fila de leitura.
          </p>
          <p className="mx-auto mt-4 max-w-[34rem] text-[0.92rem] leading-[1.8] text-almond/55">
            O conselho editorial responde a todas as propostas em até 60 dias,
            com um parecer escrito — inclusive quando a resposta é não.
          </p>
          {protocolo && (
            <p className="mt-6 font-serif text-[1rem] italic text-almond/35">
              Protocolo {protocolo}
            </p>
          )}
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="grid gap-8 md:grid-cols-2"
        >
          {campos.map((campo) => (
            <label
              key={campo.name}
              className={`flex flex-col gap-3 ${
                campo.name === "titulo" ? "md:col-span-2" : ""
              }`}
            >
              <span className="text-[0.6rem] font-serif italic text-almond/40">
                {campo.label}
              </span>
              <input
                name={campo.name}
                type={campo.type}
                required
                className="border-b border-almond/25 bg-transparent pb-3 text-[1rem] text-almond outline-none transition-colors duration-300 focus:border-almond"
              />
            </label>
          ))}

          <label className="flex flex-col gap-3 md:col-span-2">
            <span className="text-[0.6rem] font-serif italic text-almond/40">
              Em até 800 caracteres: sobre o que é o livro
            </span>
            <textarea
              name="sinopse"
              required
              rows={5}
              maxLength={800}
              className="resize-none border border-almond/25 bg-transparent p-4 text-[0.98rem] leading-[1.8] text-almond outline-none transition-colors duration-300 focus:border-almond"
            />
          </label>

          <div className="flex flex-wrap items-center gap-6 md:col-span-2">
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="group inline-flex items-center gap-3 rounded-full bg-almond px-8 py-4 font-serif text-[1.1rem] text-ink transition-colors duration-500 hover:bg-almond-lift disabled:opacity-40"
            >
              {estado === "enviando" ? "Enviando" : "Enviar proposta"}
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </button>
            {erro && <p className="text-[0.85rem] text-almond/80">{erro}</p>}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
