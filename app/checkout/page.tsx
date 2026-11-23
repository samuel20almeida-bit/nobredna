import type { Metadata } from "next";
import { CheckoutDemo } from "@/components/checkout-demo";
import { HelixRail } from "@/components/helix-rail";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize seu pedido na NobreDNA Editorial.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      {/* mesmo fio, em volume mínimo: o checkout não é lugar de ornamento */}
      <HelixRail side="left" width={26} fadeIn={0.04} from={0.6} />

      <div className="relative z-10 bg-almond pt-32 pb-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <p className="label">Prévia da loja · demonstração</p>
          <h1 className="mt-5 max-w-[20ch] text-[clamp(2rem,4.4vw,3rem)] leading-[1.1] text-ink">
            Seu próximo livro, em poucos passos.
          </h1>

          <div className="mt-14">
            <CheckoutDemo />
          </div>
        </div>
      </div>
    </>
  );
}
