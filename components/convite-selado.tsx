"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Opening } from "@/components/opening";
import { Crown, HelixMark } from "@/components/icons";
import { AUTORA_CIDADE } from "@/lib/autora";

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
              "linear-gradient(150deg,#0a2440 0%,#011638 55%,#010e26 100%)",
          }}
        >
          <div className="absolute inset-[6%] border border-almond/22" />
          <div
            className="absolute inset-x-[6%] top-[16%] text-center text-[0.58rem] text-lavender/60"
            style={{ fontStyle: "italic" }}
          >
            NobreDNA
          </div>

          {/* lacre */}
          <div className="relative flex h-[38%] aspect-square items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 34% 30%,#e0d2bd 0%,#c6ac8f 45%,#9c8060 100%)",
                boxShadow: "var(--shadow-seal)",
              }}
            />
            {/* era border-navy/25, de uma paleta que não existe mais */}
            <div className="absolute inset-[9%] rounded-full border border-ink/25" />
            <span className="relative text-ink">
              <Crown size={30} />
            </span>
          </div>

          <div
            className="absolute inset-x-[6%] bottom-[15%] text-center text-[0.56rem] text-lavender/45"
            style={{ fontStyle: "italic" }}
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
      className="grain relative flex h-full w-full items-center justify-center overflow-hidden px-[9%] text-ink"
      style={{
        background: "linear-gradient(180deg,#f4ede5 0%,#e5dacd 100%)",
        boxShadow: "var(--shadow-panel)",
      }}
    >
      <div className="max-w-[30rem] text-center">
        <span className="mx-auto block w-fit text-khaki">
          <HelixMark size={26} />
        </span>
        <p className="mt-5 font-serif text-[clamp(1.05rem,2.2vw,1.6rem)] leading-[1.5]">
          A casa lê tudo o que chega. Publica quatro títulos por ano.
        </p>
        <p className="mt-4 text-[0.86rem] leading-[1.8] text-ink/60">
          Se o seu manuscrito trata de origem, continuidade ou do que uma
          geração deixa para a seguinte, ele tem lugar nesta mesa.
        </p>
        <div className="mx-auto mt-6 h-px w-12 bg-ink/20" />
        <p
          className="mt-5 text-[0.55rem] text-ink/45"
          style={{ fontStyle: "italic" }}
        >
          Conselho editorial · {AUTORA_CIDADE}
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
        className="mt-8 text-center font-serif text-[1rem] italic"
        animate={{
          opacity: aberto ? 0.4 : 0.75,
          color: aberto ? "#eae0d5" : "#7a5f42",
        }}
        transition={{ duration: 0.8 }}
      >
        {aberto ? "Convite aberto" : "Toque no lacre para abrir"}
      </motion.p>

      {aberto && (
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="mx-auto mt-3 block font-serif text-[1rem] italic text-almond/30 transition-colors duration-500 hover:text-almond/60"
        >
          fechar
        </button>
      )}
    </div>
  );
}
