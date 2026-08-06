import type { Metadata } from "next";
import Link from "next/link";
import { EstanteAutora } from "@/components/estante-autora";
import { Anotacao } from "@/components/anotacao";
import { HelixRail } from "@/components/helix-rail";
import { DivisorPerola } from "@/components/perola";
import { ArrowRight } from "@/components/icons";
import { autora } from "@/lib/autora";

export const metadata: Metadata = {
  title: "Livros",
  description:
    "Devocionais e livros de fé escritos por " +
    autora.nome +
    ". Compre com envio para todo o Brasil.",
};

export default function LivrosPage() {
  return (
    <>
      <HelixRail side="right" width={40} fadeIn={0.05} from={0.75} />

      <div className="relative z-10">
        {/* sépia: o chão da leitora. Quebra o creme logo na primeira dobra e
            diz, antes de qualquer texto, em que lado do site se está. */}
        <section className="grain relative overflow-hidden bg-sepia pt-36 pb-16 lg:pt-44">
          <div className="glow-khaki pointer-events-none absolute inset-x-0 top-0 h-[60%]" />

          <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
            <p className="label label-on-sepia">{autora.linha.toLowerCase()}</p>
            <h1 className="mt-6 max-w-[16ch] text-[clamp(2.6rem,5.6vw,4.2rem)] leading-[1.02] font-light text-balance text-almond">
              Livros para dias
              <span className="text-khaki italic"> comuns.</span>
            </h1>
            <p className="mt-8 max-w-[34rem] text-[1.02rem] leading-[1.85] text-almond/60">
              Devocionais curtos, escritos para caber numa manhã de verdade.
              Cada título tem um dia inteiro disponível para ler antes de
              decidir.
            </p>
            <p className="mt-7">
              <Anotacao tom="escuro">
                devocional não se escolhe pela sinopse, se escolhe pela voz
              </Anotacao>
            </p>

            <DivisorPerola
              tone="dark"
              className="mt-14"
              width="min(16rem,45%)"
            />
          </div>
        </section>

        <section className="bg-almond pt-20 pb-24 lg:pt-24 lg:pb-32">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <EstanteAutora />
          </div>
        </section>

        {/* a ponte para a outra porta da casa — discreta, no fim, para quem
            chegou aqui como leitora e talvez também escreva */}
        <section className="bg-ink py-20 lg:py-24">
          <div className="mx-auto max-w-[900px] px-6 text-center lg:px-10">
            <p className="label label-on-dark">e se você também escreve</p>
            <h2 className="mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.12] font-light text-almond">
              Esta casa também prepara o livro de outros autores.
            </h2>
            <p className="mx-auto mt-6 max-w-[34rem] text-[0.98rem] leading-[1.85] text-almond/55">
              A Nobre DNA nasceu do percurso de publicar os livros acima. Hoje
              faz o mesmo trabalho de mesa para quem tem um original na gaveta.
            </p>
            <Link
              href="/publique"
              className="group mt-9 inline-flex items-center gap-3 font-serif text-[1.15rem] text-khaki transition-colors duration-500 hover:text-almond"
            >
              conheça a assessoria
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
