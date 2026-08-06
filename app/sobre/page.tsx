import type { Metadata } from "next";
import Link from "next/link";
import { EstanteAutora } from "@/components/estante-autora";
import { HelixRail } from "@/components/helix-rail";
import { Anotacao } from "@/components/anotacao";
import { DivisorPerola } from "@/components/perola";
import { ArrowRight } from "@/components/icons";
import { autora } from "@/lib/autora";

export const metadata: Metadata = {
  title: "Sobre",
  description: `${autora.nome} — ${autora.linha.toLowerCase()}. A autora por trás dos livros e da assessoria editorial Nobre DNA.`,
};

export default function SobrePage() {
  return (
    <>
      <HelixRail side="left" width={38} fadeIn={0.04} from={0.8} />

      <div className="relative z-10">
        {/* 1 — quem é ela */}
        <section className="grain relative overflow-hidden bg-almond pt-36 pb-24 lg:pt-44">
          <div className="glow-lavender pointer-events-none absolute inset-x-0 top-0 h-[65%]" />

          <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
            <p className="label">a autora</p>
            <h1 className="mt-6 max-w-[18ch] text-[clamp(2.4rem,5.2vw,3.8rem)] leading-[1.05] font-light text-balance text-ink">
              {autora.chamada}
            </h1>

            <div className="mt-14 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
              <div className="max-w-[38rem] space-y-6">
                {autora.bio.map((paragrafo) => (
                  <p
                    key={paragrafo.slice(0, 24)}
                    className="text-[1.02rem] leading-[1.9] text-ink/70"
                  >
                    {paragrafo}
                  </p>
                ))}

                <p className="pt-4">
                  <Anotacao>
                    o livro continua sendo de quem escreveu — sempre
                  </Anotacao>
                </p>
              </div>

              <ul className="lg:pt-2">
                {autora.principios.map((p) => (
                  <li key={p.titulo} className="hairline border-t py-7 last:pb-0">
                    <h2 className="font-serif text-[1.25rem] leading-snug text-ink">
                      {p.titulo}
                    </h2>
                    <p className="mt-3 text-[0.94rem] leading-[1.85] text-ink/55">
                      {p.texto}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <DivisorPerola tone="light" className="mt-20" width="min(18rem,50%)" />
          </div>
        </section>

        {/* 2 — os livros dela, aqui como obra e não como vitrine */}
        <section className="bg-almond pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <h2 className="max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.08] font-light text-ink">
              O que escrevi até aqui.
            </h2>
            <div className="mt-12">
              <EstanteAutora />
            </div>
          </div>
        </section>

        {/* 3 — a costura: por que uma autora abre uma casa */}
        <section className="bg-ink py-24 lg:py-32">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10">
            <p className="label label-on-dark">por que a casa existe</p>
            <h2 className="mt-5 max-w-[22ch] text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] font-light text-almond">
              Aprendi cada etapa fazendo nos meus próprios livros.
            </h2>
            <div className="mt-8 max-w-[38rem] space-y-6 text-[1rem] leading-[1.9] text-almond/60">
              <p>
                Preparação, revisão, projeto gráfico, ISBN, ficha, gráfica,
                frete, plataforma de venda. Fiz tudo isso primeiro por não ter
                quem fizesse — e depois por descobrir que gostava do ofício
                tanto quanto de escrever.
              </p>
              <p>
                A Nobre DNA é isso posto à disposição de outros autores. Com uma
                regra que não muda: o livro é de quem escreveu. Os direitos, o
                ISBN e a última palavra sobre cada vírgula ficam com o autor. A
                casa assina apenas o trabalho de mesa.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-4">
              <Link
                href="/publique"
                className="group inline-flex items-center gap-3 rounded-full bg-almond px-8 py-4 font-serif text-[1.15rem] text-ink transition-colors duration-500 hover:bg-almond-lift"
              >
                Enviar meu original
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  <ArrowRight size={17} />
                </span>
              </Link>
              <Link
                href="/livros"
                className="font-serif text-[1.15rem] text-almond/45 italic transition-colors duration-500 hover:text-almond/80"
              >
                ver os livros
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
