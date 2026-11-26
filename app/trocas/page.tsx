import type { Metadata } from "next";
import Link from "next/link";
import { HelixRail } from "@/components/helix-rail";
import { DivisorPerola } from "@/components/perola";
import { ArrowLeft } from "@/components/icons";
import { politicaTroca } from "@/lib/politicas";
import { institucional } from "@/lib/institucional";
import { liveStoreEnabled } from "@/lib/store-public";

export const metadata: Metadata = {
  title: politicaTroca.titulo,
  description:
    "Conheça os prazos, os direitos e os canais oficiais de atendimento para trocas, devoluções e cancelamentos de pedidos.",
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
          {!liveStoreEnabled()&&<p className="mt-5 rounded-xl border border-ink/10 bg-almond-lift p-4 text-sm leading-relaxed text-ink/75">A compra online está em preparação. Esta é a política da Casa para os pedidos realizados quando a livraria online estiver disponível.</p>}

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

          <section className="mt-14 rounded-2xl border border-khaki/40 bg-almond-lift p-6 sm:p-8" aria-label="Atendimento oficial">
            <p className="label">atendimento da Casa</p>
            <h2 className="mt-3 text-3xl text-vinho">Precisa de ajuda com seu pedido?</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">Fale com nossa equipe para registrar sua solicitação.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/pos-venda" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-vinho px-5 py-3 text-sm font-medium text-almond hover:bg-vinho-soft">Registrar solicitação pelo site</Link>
              <a href={`mailto:${institucional.email}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-vinho/30 px-5 py-3 text-sm font-medium text-vinho">Enviar e-mail</a>
              <a href={`tel:${institucional.telefoneE164}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-vinho/30 px-5 py-3 text-sm font-medium text-vinho">Ligar para a editora</a>
            </div>
            <p className="mt-4 break-words text-sm text-ink/70">{institucional.email} · {institucional.telefone}</p>
          </section>
        </div>
      </div>
    </>
  );
}
