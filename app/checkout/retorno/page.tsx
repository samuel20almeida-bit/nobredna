import type { Metadata } from "next";
import Link from "next/link";
import { LimparSacola } from "@/components/limpar-sacola";
import { ArrowRight, Seal } from "@/components/icons";

export const metadata: Metadata = {
  title: "Retorno do pagamento",
  robots: { index: false },
};

const mensagens = {
  aprovado: {
    titulo: "Pedido confirmado.",
    texto:
      "O pagamento foi aprovado. A editora despacha o exemplar em até dois dias úteis e envia o código de rastreio por e-mail.",
  },
  pendente: {
    titulo: "Pagamento em análise.",
    texto:
      "Assim que o Mercado Pago confirmar, a expedição começa. Se você escolheu boleto ou Pix, o prazo conta a partir da compensação.",
  },
  recusado: {
    titulo: "O pagamento não foi concluído.",
    texto:
      "Nada foi cobrado. Sua sacola continua montada — é possível tentar outra forma de pagamento.",
  },
} as const;

type Status = keyof typeof mensagens;

export default async function RetornoPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pedido?: string }>;
}) {
  const { status, pedido } = await searchParams;
  const chave: Status =
    status === "aprovado" || status === "pendente" || status === "recusado"
      ? status
      : "pendente";
  const mensagem = mensagens[chave];

  return (
    <div className="relative z-10 bg-navy pt-40 pb-32">
      {chave === "aprovado" && <LimparSacola />}

      <div className="mx-auto max-w-[720px] px-6 text-center lg:px-10">
        <span className="mx-auto block w-fit text-gold">
          <Seal size={34} />
        </span>
        <h1 className="mt-8 text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] text-cream">
          {mensagem.titulo}
        </h1>
        <p className="mx-auto mt-6 max-w-[36rem] text-[1rem] leading-[1.8] text-cream/55">
          {mensagem.texto}
        </p>

        {pedido && (
          <p className="mt-8 text-[0.68rem] tracking-[0.26em] uppercase text-cream/35">
            Pedido {pedido}
          </p>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link
            href="/#acervo"
            className="group inline-flex items-center gap-3 border border-gold/40 px-7 py-3.5 text-[0.75rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-500 hover:border-gold hover:bg-gold/8"
          >
            Voltar ao acervo
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </Link>
          {chave === "recusado" && (
            <Link
              href="/checkout"
              className="text-[0.75rem] tracking-[0.2em] uppercase text-cream/50 underline decoration-gold/30 underline-offset-[7px] transition-colors duration-500 hover:text-gold-light"
            >
              Tentar novamente
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
