import type { Metadata } from "next";
import Link from "next/link";
import { ConsultaCheckout } from "@/components/consulta-checkout";
import { HelixRail } from "@/components/helix-rail";

export const metadata: Metadata = {
  title: "Sua sacola",
  description: "Revise sua seleção e consulte a compra com a NobreDNA Editorial.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      {/* mesmo fio, em volume mínimo: o checkout não é lugar de ornamento */}
      <HelixRail side="left" width={26} fadeIn={0.04} from={0.6} />

      <div className="relative z-10 bg-almond pt-24 pb-14 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <Link href="/livros#catalogo" className="inline-flex min-h-11 items-center text-vinho underline underline-offset-4">Voltar à livraria</Link>
          <p className="label mt-4">Sua sacola · consulta de compra</p>
          <h1 className="mt-5 max-w-[20ch] text-[clamp(2rem,4.4vw,3rem)] leading-[1.1] text-ink">
            Sua próxima leitura, quase em casa.
          </h1>

          <div className="mt-8 md:mt-14">
            <ConsultaCheckout />
          </div>
          <p className="mt-8 text-center text-sm text-ink/65">A loja online está em validação. <Link href="/checkout/demonstracao" className="text-vinho underline">Conhecer a demonstração de pagamento</Link>.</p>
        </div>
      </div>
    </>
  );
}
