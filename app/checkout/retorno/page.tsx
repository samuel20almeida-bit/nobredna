import type { Metadata } from "next";
import Link from "next/link";
import { getOrderPaymentStatus } from "@/lib/store-commerce";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Acompanhar pagamento", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function RetornoPage({ searchParams }: { searchParams: Promise<{ pedido?: string }> }) {
  const { pedido } = await searchParams;
  const valid = typeof pedido === "string" && /^NDNA-[0-9A-F]{32}$/.test(pedido);
  const payment = valid ? await getOrderPaymentStatus(pedido).catch(() => null) : null;
  const paid = payment?.payment_status === "paid" && !payment.payment_review;
  const refunded = payment?.payment_status === "refunded";
  const cancelled = payment?.payment_status === "cancelled";
  const title = paid ? "Pedido confirmado." : refunded ? "Pagamento estornado." : cancelled ? "Pedido cancelado." : "Aguardando confirmação.";
  const message = paid ? "A Casa recebeu a confirmação do pagamento. O pedido segue para preparação." : payment?.payment_review ? "Seu pedido está em revisão pela equipe da Casa. Não realize outro pagamento antes de falar conosco." : refunded ? "O pagamento consta como estornado. Consulte a Casa para mais informações." : cancelled ? "A reserva foi cancelada. Consulte a livraria para uma nova seleção." : "A confirmação depende da atualização do provedor de pagamento. Se você já pagou, aguarde e atualize esta página. Não é necessário pagar novamente.";
  return <section className="bg-almond pt-32 pb-24"><div className="mx-auto max-w-xl px-6 text-center"><div className="editorial-card p-7 sm:p-10"><p className="label">Acompanhamento da compra</p><h1 className="mt-4 text-4xl text-vinho">{title}</h1><p className="mt-4 leading-relaxed text-ink/75">{message}</p>{valid && <p className="mt-5 break-all text-sm text-ink/70">Pedido {pedido}</p>}<div className="mt-7 flex flex-wrap justify-center gap-3">{valid && !paid && <a href={`/checkout/retorno?pedido=${encodeURIComponent(pedido)}`} className="min-h-12 rounded-xl bg-vinho px-5 py-3 text-almond">Atualizar situação</a>}<Link href="/livros" className="min-h-12 rounded-xl border border-vinho/25 px-5 py-3 text-vinho">Voltar à livraria</Link></div></div></div></section>;
}
