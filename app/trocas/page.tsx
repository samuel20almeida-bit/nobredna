import type { Metadata } from "next";
import Link from "next/link";
import { HelixRail } from "@/components/helix-rail";
import { DivisorPerola } from "@/components/perola";
import { ArrowLeft } from "@/components/icons";
import { politicaTroca } from "@/lib/politicas";

export const metadata: Metadata = {
  title: politicaTroca.titulo,
  description:
    "Sete dias para desistir da compra, troca imediata em caso de defeito e frete de retorno por conta da casa.",
};

export default function TrocasPage() {
  return (
    <>
      <HelixRail side="right" width={34} fadeIn={0.04} from={0.85} />

      <div className="relative z-10 bg-almond pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-[820px] px-6 lg:px-10">
          <Link
            href="/livros"
            className="group inline-flex items-center gap-3 font-serif text-[1.05rem] text-ink/40 italic transition-colors duration-500 hover:text-ink"
          >
            <span className="transition-transform duration-500 group-hover:-translate-x-1">
              <ArrowLeft size={15} />
            </span>
            voltar aos livros
          </Link>

          <h1 className="mt-12 max-w-[16ch] text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.04] font-light text-balance text-ink">
            {politicaTroca.titulo}
          </h1>
          <p className="mt-5 border border-ink/20 bg-almond-lift p-4 text-ink/75">Modelo de política para revisão pela Casa antes da ativação da loja. Nenhum pedido é realizado nesta versão demonstrativa.</p>

          <p className="mt-8 max-w-[38rem] text-[1.05rem] leading-[1.85] text-ink/65">
            {politicaTroca.chamada}
          </p>

          <DivisorPerola tone="light" className="mt-14" width="min(14rem,40%)" />

          <div className="mt-14 space-y-14">
            {politicaTroca.blocos.map((bloco) => (
              <section key={bloco.titulo}>
                <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] leading-tight font-light text-ink">
                  {bloco.titulo}
                </h2>
                <ul className="mt-6 space-y-5">
                  {bloco.itens.map((item) => (
                    <li
                      key={item.slice(0, 24)}
                      className="border-l border-khaki pl-6 text-[0.98rem] leading-[1.85] text-ink/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="hairline mt-16 border-t pt-8 font-serif text-[1.05rem] text-ink/45 italic">
            Qualquer dúvida antes disso, escreva para{" "}
            <a
              href="mailto:contato@nobredna.com.br"
              className="underline decoration-ink/20 underline-offset-4 transition-colors duration-500 hover:text-ink"
            >
              contato@nobredna.com.br
            </a>
            . A casa responde.
          </p>
        </div>
      </div>
    </>
  );
}
