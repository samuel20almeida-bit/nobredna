import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ProjetosReais } from "@/components/projetos-reais";
import { HelixRail } from "@/components/helix-rail";
import { Anotacao } from "@/components/anotacao";
import { DivisorPerola } from "@/components/perola";
import { Pilares } from "@/components/pilares";
import { ArrowRight } from "@/components/icons";
import { autora } from "@/lib/autora";

export const metadata: Metadata = {
  title: "Nanda Almeida | Escritora e Fundadora",
  description: `${autora.nome} — ${autora.linha.toLowerCase()}. A fundadora da NobreDNA, a Casa editorial por trás dos livros.`,
};

export default function SobrePage() {
  return (
    <>
      <HelixRail side="left" width={38} fadeIn={0.04} from={0.8} />

      <div className="relative z-10">
        {/* 1 — quem é ela */}
        <section className="grain relative overflow-hidden bg-almond pt-24 pb-14 md:pt-36 md:pb-24 lg:pt-44">
          <div className="glow-lavender pointer-events-none absolute inset-x-0 top-0 h-[65%]" />

          <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
            <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <figure className="mx-auto w-full max-w-[240px] md:max-w-[440px]">
                <div className="relative aspect-square rounded-full border border-khaki/60 bg-almond-lift p-2 shadow-book">
                  <div className="relative h-full w-full overflow-hidden rounded-full"><Image src="/brand/nanda-retrato-sobre-v2.webp" alt="Nanda Almeida, escritora e fundadora da NobreDNA" fill priority sizes="(max-width: 767px) 240px, 440px" className="object-cover object-center" /></div>
                </div>
                <figcaption className="mt-4 text-center font-serif text-lg italic text-khaki-ink">Nanda Almeida · Fundadora da Casa</figcaption>
              </figure>
              <div>
                <p className="label">a mulher por trás da Casa</p>
                <h1 className="mt-5 text-[clamp(3rem,6vw,5.4rem)] leading-none text-vinho">Nanda Almeida</h1>
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-khaki-ink">Escritora · Fundadora da NobreDNA</p>
                <p className="mt-7 max-w-[38rem] text-lg leading-relaxed text-ink/80">Escritora e fundadora da Casa de Legados, Nanda acredita que toda história carrega um propósito. Sua missão é acolher vozes, preservar testemunhos e ajudar outras autoras a transformar suas experiências em livros que atravessam gerações.</p>
                <blockquote className="mt-8 border-l border-khaki pl-5 font-serif text-2xl italic leading-snug text-vinho">“{autora.chamada}”</blockquote>
                <a href="https://www.instagram.com/escritoranandaalmeida/" target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center border border-vinho px-6 py-3 text-vinho transition-colors hover:bg-vinho hover:text-almond">Acompanhe @escritoranandaalmeida</a>
              </div>
            </div>

            <div className="mt-14 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
              <div className="max-w-[38rem] space-y-6">
                <p className="label">carta da fundadora</p>
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
        <ProjetosReais />

        {/* 3 — os pilares e o manifesto, direto do livro de marca dela */}
        <Pilares />

        {/* 4 — a costura: por que uma autora abre uma Casa */}
        <section className="bg-ink py-24 lg:py-32">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10">
            <p className="label label-on-dark">por que a Casa existe</p>
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
                A NobreDNA é isso posto à disposição de outras autoras. Com uma
                regra que não muda: o livro é de quem escreveu. Os direitos, o
                ISBN e a última palavra sobre cada vírgula ficam com a autora. A
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
