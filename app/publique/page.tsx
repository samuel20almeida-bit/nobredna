import type { Metadata } from "next";
import { ConviteSelado } from "@/components/convite-selado";
import { PropostaForm } from "@/components/proposta-form";
import { Perguntas } from "@/components/perguntas";
import { HelixRail } from "@/components/helix-rail";
import { Quill, Route, Seal, Spines } from "@/components/icons";
import { percurso } from "@/lib/servicos";

export const metadata: Metadata = {
  title: "Envie seu original",
  description:
    "Assessoria editorial: leitura crítica, preparação, revisão, projeto gráfico e circulação. O diagnóstico do seu original é gratuito.",
};

const icones = [Quill, Seal, Spines, Route];

const criterios = [
  {
    title: "O que a casa faz bem",
    items: [
      "Livros sobre origem, linhagem, continuidade e herança — em ensaio, romance, poesia, memória ou correspondência reunida.",
      "Originais concluídos e também projetos em andamento, quando já existe estrutura.",
      "Autoria disposta ao trabalho de mesa: o texto sai daqui diferente de como entrou.",
    ],
  },
  {
    title: "O que a casa não faz",
    items: [
      "Comprar direitos. O livro é do autor do começo ao fim, e o ISBN sai no nome dele.",
      "Aceitar tudo. São três projetos por vez, e um original fora do nosso repertório recebe essa resposta no diagnóstico.",
      "Prometer venda. Ninguém sério garante leitor — o que se garante é o cuidado com o objeto.",
    ],
  },
];

export default function PubliquePage() {
  return (
    <>
      <HelixRail side="right" width={44} fadeIn={0.05} from={0.7} />

      <div className="relative z-10">
        {/* 1 — o convite */}
        <section className="grain relative overflow-hidden bg-almond pt-36 pb-24 lg:pt-44">
          <div className="glow-lavender pointer-events-none absolute inset-x-0 top-0 h-[70%]" />

          <div className="relative mx-auto grid max-w-[1180px] items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
            <div>
              <p className="label">seu original</p>
              <h1 className="mt-6 max-w-[16ch] text-[clamp(2.6rem,5.6vw,4.2rem)] leading-[1.02] font-light text-balance text-ink">
                Um original é uma
                <span className="text-lavender-ink italic">
                  {" "}
                  herança em rascunho.
                </span>
              </h1>
              <p className="mt-8 max-w-[32rem] text-[1.02rem] leading-[1.85] text-ink/60">
                A Nobre DNA lê originais o ano inteiro. A primeira leitura é
                gratuita e termina num parecer escrito: o que o texto já tem, o
                que falta, e quanto custaria cada etapa do trabalho — para você
                decidir com número na mão.
              </p>
              <p className="mt-6 max-w-[32rem] font-serif text-[1.15rem] text-ink/45 italic">
                O convite ao lado é literal. Rompa o lacre.
              </p>
            </div>

            <div className="mx-auto w-[min(88vw,460px)] lg:w-full">
              <ConviteSelado />
            </div>
          </div>
        </section>

        {/* 2 — o percurso do trabalho */}
        <section className="bg-almond pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
            <h2 className="max-w-[18ch] text-[clamp(2rem,4vw,3rem)] leading-[1.06] font-light text-ink">
              Do envio à estante, em quatro tempos.
            </h2>

            <ol className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {percurso.map((etapa, i) => {
                const Icon = icones[i];
                return (
                  <li key={etapa.n} className="hairline border-t pt-7">
                    <div className="flex items-center justify-between">
                      <span className="text-khaki-ink">
                        <Icon size={24} />
                      </span>
                      <span className="font-serif text-[1.05rem] text-ink/30 italic">
                        {etapa.n}
                      </span>
                    </div>
                    <h3 className="mt-6 text-[1.5rem] leading-tight font-light text-ink">
                      {etapa.titulo}
                    </h3>
                    <p className="mt-3 text-[0.93rem] leading-[1.85] text-ink/55">
                      {etapa.texto}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* 3 — o que a casa faz e o que não faz */}
        <section className="bg-almond pb-24 lg:pb-32">
          <div className="mx-auto grid max-w-[1180px] gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
            {criterios.map((bloco) => (
              <div key={bloco.title}>
                <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] leading-tight font-light text-ink">
                  {bloco.title}
                </h2>
                <ul className="mt-8 space-y-6">
                  {bloco.items.map((item) => (
                    <li
                      key={item.slice(0, 20)}
                      className="border-l border-khaki pl-6 text-[0.98rem] leading-[1.85] text-ink/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4 — o bloco escuro: dúvidas e primeiro contato, juntos */}
        <section id="perguntas" className="bg-ink pt-24 pb-8 lg:pt-32">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10">
            <p className="label label-on-dark">antes de enviar</p>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-light text-almond">
              O que todo autor pergunta primeiro.
            </h2>
            <div className="mt-12">
              <Perguntas />
            </div>
          </div>
        </section>

        <section id="proposta" className="bg-ink pt-16 pb-24 lg:pb-32">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10">
            <p className="label label-on-dark">primeiro contato</p>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-light text-almond">
              Conte o que você está escrevendo.
            </h2>
            <p className="mt-6 max-w-[36rem] text-[0.98rem] leading-[1.85] text-almond/55">
              Depois deste primeiro contato pedimos o original completo por
              e-mail. Nenhum arquivo precisa ser anexado agora, e nada é cobrado
              pela leitura.
            </p>

            <div className="mt-14">
              <PropostaForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
