import type {Metadata} from "next";
import Link from "next/link";
import {commerceClient} from "@/lib/store-commerce";
import {StorePaymentReturn} from "@/components/store-payment-return";
export const metadata:Metadata={title:"Acompanhar pagamento",robots:{index:false,follow:false},referrer:"no-referrer"};
export const dynamic="force-dynamic";

export default async function RetornoPage({searchParams}:{searchParams:Promise<{pedido?:string}>}){
 const {pedido}=await searchParams;const valid=typeof pedido==="string"&&/^NDNA-[0-9A-F]{32}$/.test(pedido);
 let status="unknown",review=false;
 if(valid&&process.env.SUPABASE_SECRET_KEY)try{const {data,error}=await commerceClient().from("store_orders").select("payment_status,payment_review").eq("reference",pedido).maybeSingle();if(!error&&data){status=data.payment_status;review=data.payment_review}}catch{}
 const paid=status==="paid"&&!review;
 const title=paid?"Pedido confirmado.":status==="refunded"?"Pagamento estornado.":status==="cancelled"?"Pedido cancelado.":"Aguardando confirmação.";
 const message=paid?"A Casa recebeu a confirmação do pagamento. O pedido segue para preparação.":review?"Seu pedido está em revisão pela equipe da Casa. Não realize outro pagamento antes de falar conosco.":status==="refunded"?"O pagamento consta como estornado. Consulte a Casa para mais informações.":status==="cancelled"?"A reserva deste pedido foi cancelada. Consulte a livraria para uma nova seleção.":"A confirmação depende da atualização do Mercado Pago. Se você já fez o pagamento, aguarde e atualize esta página. Não é necessário pagar novamente.";
 return <section className="bg-almond pt-32 pb-24"><div className="mx-auto max-w-xl px-6 text-center"><div className="editorial-card p-7 sm:p-10">{paid&&valid&&<StorePaymentReturn reference={pedido}/>}<p className="label">Acompanhamento da compra</p><h1 className="mt-4 text-4xl text-vinho">{title}</h1><p className="mt-4 leading-relaxed text-ink/75">{message}</p>{valid&&<p className="mt-5 break-all text-sm text-ink/70">Pedido {pedido}</p>}<div className="mt-7 flex flex-wrap justify-center gap-3">{valid&&!paid&&<a href={`/checkout/retorno?pedido=${encodeURIComponent(pedido)}`} className="min-h-12 rounded-xl bg-vinho px-5 py-3 text-almond">Atualizar situação</a>}<Link href="/livros" className="min-h-12 rounded-xl border border-vinho/25 px-5 py-3 text-vinho">Voltar à livraria</Link><Link href="/pos-venda" className="min-h-12 rounded-xl border border-vinho/25 px-5 py-3 text-vinho">Ajuda ou cancelamento do pedido</Link></div></div></div></section>
}
