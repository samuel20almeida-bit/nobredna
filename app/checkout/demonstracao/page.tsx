import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutDemo } from "@/components/checkout-demo";
export const metadata:Metadata={title:"Demonstração de checkout",robots:{index:false}};
export default function Demonstracao(){return <section className="editorial-paper pt-24 pb-16 md:pt-32"><div className="mx-auto max-w-[1180px] px-6 lg:px-10"><Link href="/checkout" className="inline-flex min-h-11 items-center text-vinho underline">Voltar à sacola</Link><p className="label mt-5">simulação · nenhuma cobrança</p><h1 className="mt-3 max-w-xl text-4xl text-vinho lg:text-5xl">Experimente a futura compra online.</h1><p className="mt-4 max-w-xl text-ink/75">Produto, valores, frete e meios de pagamento são ilustrativos.</p><div className="mt-8"><CheckoutDemo/></div></div></section>}
