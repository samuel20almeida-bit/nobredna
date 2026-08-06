import type { Metadata } from "next";
import { ConviteSelado } from "@/components/convite-selado";
import { PropostaForm } from "@/components/proposta-form";
import { Perguntas } from "@/components/perguntas";
import { HelixRail } from "@/components/helix-rail";
import { Quill, Route, Seal, Spines } from "@/components/icons";

export const metadata: Metadata = {
  title: "Publique seu livro",
  description:
    "A Editora Nobre DNA publica quatro títulos por ano. Envie seu manuscrito ao conselho editorial.",
};

const etapas = [
  {
    icon: Quill,
    n: "01",
    title: "Leitura",
    text: "O manuscrito é lido integralmente por dois pareceristas da casa, sem custo e sem intermediário.",
  },
  {
    icon: Seal,
    n: "02",
    title: "Parecer",
    text: "Em até 60 dias você recebe um parecer escrito — com o que sustentou a decisão, seja ela qual for.",
  },
  {
    icon: Spines,
    n: "03",
    title: "Edição",
    text: "Aceito o título, começa o trabalho de mesa: edição de texto, projeto gráfico, capa e prova de impressão.",
  },
  {
    icon: Route,
    n: "04",
    title: "Circulação",
    text: "Tiragem, distribuição em livrarias independentes, catálogo digital e a carta mensal aos leitores da casa.",
  },
];

const criterios = [
  {
    title: "O que a casa procura",
    items: [
      "Obras sobre origem, linhagem, continuidade e herança — em ensaio, romance, poesia ou correspondência.",
      "Manuscritos concluídos, ou com estrutura fechada e ao menos um terço escrito.",
      "Autoria disposta ao trabalho de mesa: o texto sai daqui diferente de como entrou.",
    ],
  },
  {
    title: "O que a casa não faz",
    items: [
      "Publicação paga pelo autor. A editora assume o custo do que aceita.",
      "Catálogo extenso: são quatro títulos por ano, e a fila é honesta sobre isso.",
      "Contratos de exclusividade vitalícia. Os direitos voltam ao autor em cinco anos.",
    ],
  },
];

export default function PubliquePage() {
  return (
    <>
      <HelixRail side="right" width={44} fadeIn={0.05} from={0.7} />

      <div className="relative z-10">
        <section className="relative overflow-hidden bg-almond pt-36 pb-24 lg:pt-44">
          <div className="glow-lavender pointer-events-none absolute inset-x-0 top-0 h-[70%]" />

          <div className="relative mx-auto grid max-w-[1240px] items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
            <div>
              <p className="label">Convite selado</p>
              <h1 className="mt-6 max-w-[16ch] text-[clamp(2.4rem,5.4vw,4rem)] leading-[1.06] text-balance text-ink">
                Um manuscrito é uma
                <span className="text-ink"> herança em rascunho.</span>
              </h1>
              <p className="mt-8 max-w-[32rem] text-[1.05rem] leading-[1.8] text-ink/65">
                A Editora Nobre DNA recebe manuscritos o ano inteiro e publica
                quatro. Não há taxa de leitura, não há pacote de publicação: o
                que a casa aceita, a casa banca.
              </p>
              <p className="mt-6 max-w-[32rem] text-[0.95rem] leading-[1.8] text-ink/45">
                O convite ao lado é literal. Rompa o lacre.
              </p>
            </div>

            <div className="mx-auto w-[min(88vw,460px)] lg:w-full">
              <ConviteSelado />
            </div>
          </div>
        </section>

        <section className="bg-almond py-24 text-ink lg:py-32">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.14]">
              Do envio à estante, em quatro tempos.
            </h2>

            <ol className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {etapas.map((etapa) => {
                const Icon = etapa.icon;
                return (
                  <li key={etapa.n} className="border-t border-navy/15 pt-7">
                    <div className="flex items-center justify-between">
                      <span className="text-khaki-ink">
                        <Icon size={24} />
                      </span>
                      <span className="font-serif text-[0.9rem] tabular-nums text-ink/35">
                        {etapa.n}
                      </span>
                    </div>
                    <h3 className="mt-6 text-[1.35rem]">{etapa.title}</h3>
                    <p className="mt-3 text-[0.93rem] leading-[1.8] text-ink/60">
                      {etapa.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="bg-almond py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1240px] gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
            {criterios.map((bloco) => (
              <div key={bloco.title}>
                <h2 className="text-[clamp(1.4rem,2.8vw,2rem)] text-ink">
                  {bloco.title}
                </h2>
                <ul className="mt-8 space-y-6">
                  {bloco.items.map((item) => (
                    <li
                      key={item.slice(0, 20)}
                      className="border-l border-ink/30 pl-6 text-[0.98rem] leading-[1.8] text-ink/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="perguntas" className="bg-almond pb-24 lg:pb-32">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10">
            <p className="label">Antes de enviar</p>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.14] text-ink">
              O que todo autor pergunta primeiro.
            </h2>
            <div className="mt-12">
              <Perguntas />
            </div>
          </div>
        </section>

        <section id="proposta" className="bg-almond py-24 lg:py-32">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10">
            <p className="label">Sua proposta</p>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.14] text-ink">
              Conte o que você está escrevendo.
            </h2>
            <p className="mt-6 max-w-[36rem] text-[0.98rem] leading-[1.8] text-ink/50">
              Depois deste primeiro contato, o conselho pede o manuscrito
              completo por e-mail. Nenhum arquivo precisa ser anexado agora.
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
