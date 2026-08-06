"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Opening } from "@/components/opening";
import { Crown, HelixMark } from "@/components/icons";

/** Metade do cartão lacrado — o selo fica exatamente sobre a dobradiça. */
function CardHalf({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-y-0 w-[200%]"
        style={{ left: side === "left" ? 0 : "-100%" }}
      >
        <div
          className="grain relative flex h-full w-full items-center justify-center"
          style={{
            background:
              "linear-gradient(150deg,#1d2941 0%,#101a2c 55%,#090f1c 100%)",
          }}
        >
          <div className="absolute inset-[6%] border border-gold/22" />
          <div
            className="absolute inset-x-[6%] top-[16%] text-center text-[0.58rem] text-gold/60"
            style={{ letterSpacing: "0.42em", textTransform: "uppercase" }}
          >
            Editora Nobre DNA
          </div>

          {/* lacre */}
          <div className="relative flex h-[38%] aspect-square items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 34% 30%,#e8ce96 0%,#c9a15c 42%,#8a6127 100%)",
                boxShadow: "var(--shadow-seal)",
              }}
            />
            <div className="absolute inset-[9%] rounded-full border border-navy/25" />
            <span className="relative text-navy">
              <Crown size={30} />
            </span>
          </div>

          <div
            className="absolute inset-x-[6%] bottom-[15%] text-center text-[0.56rem] text-gold/45"
            style={{ letterSpacing: "0.34em", textTransform: "uppercase" }}
          >
            Convite à publicação
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-6"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          background:
            side === "left"
              ? "linear-gradient(to right,transparent,rgb(6 11 22 / .28))"
              : "linear-gradient(to left,transparent,rgb(6 11 22 / .28))",
        }}
      />
    </div>
  );
}

function Carta() {
  return (
    <div
      className="grain relative flex h-full w-full items-center justify-center overflow-hidden px-[9%] text-navy"
      style={{
        background: "linear-gradient(180deg,#f6e9dc 0%,#e7d8c4 100%)",
        boxShadow: "var(--shadow-panel)",
      }}
    >
      <div className="max-w-[30rem] text-center">
        <span className="mx-auto block w-fit text-gold-deep">
          <HelixMark size={26} />
        </span>
        <p className="mt-5 font-serif text-[clamp(1.05rem,2.2vw,1.6rem)] leading-[1.5]">
          A casa lê tudo o que chega. Publica quatro títulos por ano.
        </p>
        <p className="mt-4 text-[0.86rem] leading-[1.8] text-navy/60">
          Se o seu manuscrito trata de origem, continuidade ou do que uma
          geração deixa para a seguinte, ele tem lugar nesta mesa.
        </p>
        <div className="mx-auto mt-6 h-px w-12 bg-navy/20" />
        <p
          className="mt-5 text-[0.55rem] text-navy/45"
          style={{ letterSpacing: "0.34em", textTransform: "uppercase" }}
        >
          Conselho editorial · São Paulo
        </p>
      </div>
    </div>
  );
}

/**
 * O convite selado: mesmo mecanismo de revelação do livro do hero, aplicado a
 * um lacre. O gesto se repete no site inteiro — o que muda é a superfície.
 */
export function ConviteSelado() {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative w-full">
      <Opening
        className="aspect-[4/3] w-full"
        open={aberto}
        angle={78}
        duration={1.7}
        left={<CardHalf side="left" />}
        right={<CardHalf side="right" />}
        inner={<Carta />}
        innerClassName="[transform:translateZ(-14px)]"
      />

      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label="Romper o lacre e abrir o convite"
        />
      )}

      <motion.p
        className="mt-8 text-center text-[0.66rem] tracking-[0.28em] uppercase"
        animate={{
          opacity: aberto ? 0.4 : 0.75,
          color: aberto ? "#f6e9dc" : "#c9a15c",
        }}
        transition={{ duration: 0.8 }}
      >
        {aberto ? "Convite aberto" : "Toque no lacre para abrir"}
      </motion.p>

      {aberto && (
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="mx-auto mt-3 block text-[0.62rem] tracking-[0.2em] uppercase text-cream/30 transition-colors duration-500 hover:text-cream/60"
        >
          fechar
        </button>
      )}
    </div>
  );
}
