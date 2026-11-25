import type { Metadata } from "next";
import Link from "next/link";
import { getStoreAccess } from "@/lib/store-admin";
import { saveProduct, signIn, signOut, updateFulfillment, retryNotifications, reviewExpiredReservations, requestEmailAccess, verifyEmailAccess } from "./actions";
import { AdminLeads } from "@/components/admin-leads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Painel da Casa", robots: { index: false, follow: false } };

type Product = {
  id: string; title: string; author: string; slug: string; description: string;
  isbn: string | null; cover_url: string | null; price_cents: number | null; stock: number;
  weight_g: number | null; width_mm: number | null; height_mm: number | null; length_mm: number | null;
  status: string; published: boolean; updated_at: string;
};
const prices = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const inputClass = "mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-3 text-sm focus:border-vinho";
const button = "rounded-full bg-vinho px-5 py-3 text-sm font-medium text-white hover:bg-vinho-soft";
const card = "rounded-3xl border border-ink/10 bg-almond-lift p-5 shadow-lift sm:p-7";
const messages: Record<string, string> = {
  "login-error": "Não foi possível entrar. Confira seu e-mail e senha.",
  "email-sent":"Link de acesso solicitado. Confira sua caixa de entrada e abra o link no mesmo navegador.",
  "email-access-error":"Não foi possível solicitar ou confirmar o acesso. Confira o e-mail autorizado e tente novamente.",
  "lead-saved":"Situação da solicitação atualizada.",
  "lead-error":"Não foi possível atualizar a solicitação.",
  "not-configured": "O acesso ainda está em configuração.",
  denied: "Acesso não autorizado.",
  "invalid-product": "Confira os campos e os formatos informados.",
  "incomplete-product": "Preencha preço, sinopse, capa e medidas para marcar o livro como ativo.",
  "duplicate-product": "Já existe um livro com esse identificador.",
  "save-error": "Não foi possível salvar. Confira os dados e tente novamente.",
  "stale-product": "Este livro foi alterado (inclusive por uma compra). Atualize e revise o estoque antes de salvar.",
  saved: "Livro salvo com sucesso.",
  "invalid-shipping":"Confira o código de rastreamento e a situação do pedido.",
  "shipping-error":"Não foi possível atualizar a expedição. Confira o pagamento e a situação do pedido.",
  "shipping-saved":"Expedição atualizada com sucesso.",
  "notification-attempt":"A fila de notificações foi consultada. Confira os estados abaixo.",
  "maintenance-error":"Não foi possível verificar as reservas. Confira a configuração do banco.",
  "maintenance-saved":"Reservas verificadas. Nenhum pagamento iniciado foi cancelado automaticamente.",
};
const states: Record<string, string> = { draft: "Rascunho", active: "Ativo no cadastro", archived: "Arquivado", pending: "Pendente", paid: "Pago", failed: "Falhou", refunded: "Estornado", cancelled: "Cancelado", preparing: "Em preparação", shipped: "Enviado", delivered: "Entregue" };

function Field({ name, label, value, required = false, type = "text", placeholder, min, step }: { name: string; label: string; value?: string | number | null; required?: boolean; type?: string; placeholder?: string; min?: number; step?: string; }) {
  return <label className="block text-sm font-medium text-ink/80">{label}<input name={name} type={type} className={inputClass} defaultValue={value ?? ""} required={required} placeholder={placeholder} min={min} step={step} /></label>;
}

function ProductForm({ product }: { product?: Product }) {
  return <form action={saveProduct} className="mt-5 space-y-4">
    {product && <><input type="hidden" name="id" value={product.id} /><input type="hidden" name="version" value={product.updated_at} /></>}
    <div className="grid gap-4 sm:grid-cols-2">
      <Field name="title" label="Título do livro" value={product?.title} required />
      <Field name="author" label="Autoria" value={product?.author} required />
      <Field name="slug" label="Identificador (sem acentos ou espaços)" placeholder="nome-do-livro" value={product?.slug} required />
      <Field name="isbn" label="ISBN (opcional)" value={product?.isbn} />
    </div>
    <label className="block text-sm font-medium">Sinopse<textarea name="description" className={`${inputClass} min-h-24`} defaultValue={product?.description} /></label>
    <Field name="cover_url" label="Endereço da capa oficial" placeholder="https://… ou /imagens/…" value={product?.cover_url} />
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <Field name="price" label="Preço (R$)" placeholder="49,90" value={product?.price_cents ? (product.price_cents / 100).toFixed(2) : ""} />
      <Field name="stock" label="Estoque disponível" type="number" min={0} step="1" value={product?.stock ?? 0} required />
      <Field name="weight_g" label="Peso (g)" type="number" min={1} step="1" value={product?.weight_g} />
      <Field name="width_mm" label="Largura (mm)" type="number" min={1} step="1" value={product?.width_mm} />
      <Field name="height_mm" label="Espessura (mm)" type="number" min={1} step="1" value={product?.height_mm} />
      <Field name="length_mm" label="Comprimento (mm)" type="number" min={1} step="1" value={product?.length_mm} />
    </div>
    <label className="block text-sm font-medium">Situação<select name="status" defaultValue={product?.status ?? "draft"} className={inputClass}><option value="draft">Rascunho</option><option value="active">Ativo no cadastro</option><option value="archived">Arquivado</option></select></label>
    <label className="flex items-start gap-3 text-sm leading-relaxed"><input name="published" type="checkbox" defaultChecked={product?.published ?? false} className="mt-1 size-4 accent-vinho"/><span>Publicar livro no catálogo comercial (apenas se estiver ativo e com informações oficiais).</span></label>
    <p className="text-sm leading-relaxed text-ink/65">A compra permanece desabilitada até a ativação da loja.</p>
    <button type="submit" className={button}>{product ? "Salvar alterações" : "Cadastrar livro"}</button>
  </form>;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mensagem?: string; liberadas?: string; revisao?: string; origem?: string; status?: string }> }) {
  const access = await getStoreAccess();
  const { mensagem, liberadas, revisao, origem, status } = await searchParams;
  const notice = mensagem && Object.hasOwn(messages, mensagem) ? messages[mensagem] : null;

  if (access.state !== "admin") return <section className="mx-auto min-h-[74vh] max-w-xl px-5 pb-24 pt-32">
    <div className={card}>
      <p className="text-sm uppercase tracking-widest text-khaki-ink">NobreDNA · gestão editorial</p>
      <h1 className="mt-3 text-4xl text-vinho">Painel da Casa</h1>
      <p className="mt-3 leading-relaxed text-ink/70">Área reservada para administrar os livros e os pedidos da Casa.</p>
      {notice && <p role="status" className="mt-4 rounded-xl bg-almond-deep p-3 text-sm">{notice}</p>}
      {access.state === "unconfigured" ? <div className="mt-6 rounded-2xl border border-khaki/40 bg-almond p-4"><p className="font-medium">Configuração em andamento</p><p className="mt-2 text-sm leading-relaxed text-ink/70">A área administrativa será liberada após a conexão segura com o banco de dados da editora. A loja pública continua em modo de consulta.</p></div>
        : access.state === "signed-out" ? <div className="mt-6 space-y-5"><form action={requestEmailAccess} className="space-y-4"><label className="block text-sm font-medium">E-mail autorizado<input type="email" name="email" autoComplete="email" required className={inputClass}/></label><button className={`${button} w-full`}>Receber link de acesso</button><p className="text-xs text-ink/65">Acesso privado: apenas usuários autorizados podem ver solicitações.</p></form><details className="border-t border-ink/15 pt-4"><summary className="cursor-pointer text-sm text-vinho">Recebi um código por e-mail</summary><form action={verifyEmailAccess} className="mt-4 space-y-4"><label className="block text-sm">E-mail<input name="email" type="email" required className={inputClass}/></label><label className="block text-sm">Código<input name="token" inputMode="numeric" maxLength={6} required className={inputClass}/></label><button className={button}>Confirmar código</button></form></details><details className="border-t border-ink/15 pt-4"><summary className="cursor-pointer text-sm text-vinho">Já tenho senha</summary><form action={signIn} className="mt-4 space-y-4"><label className="block text-sm font-medium">E-mail<input type="email" name="email" autoComplete="username" required className={inputClass} /></label><label className="block text-sm font-medium">Senha<input type="password" name="password" autoComplete="current-password" required className={inputClass} /></label><button className={`${button} w-full`}>Entrar no painel</button></form></details></div>
        : <div className="mt-6 space-y-4"><p role="alert">{access.state === "denied" ? "Seu usuário não tem permissão para acessar a gestão da Casa." : "Não foi possível verificar seu acesso neste momento."}</p><form action={signOut}><button className={button}>Sair</button></form></div>}
      <Link href="/" className="mt-6 inline-block text-sm text-vinho underline underline-offset-4">Voltar ao site</Link>
    </div>
  </section>;

  const [catalog, orders] = await Promise.all([
    access.client.from("store_products").select("id,title,author,slug,description,isbn,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published,updated_at").order("created_at", { ascending: false }).limit(100),
    access.client.from("store_orders").select("reference,customer_name,customer_email,shipping_address,shipping_service,total_cents,payment_status,fulfillment_status,tracking_code,created_at,payment_review,store_order_items(title_snapshot,quantity,unit_price_cents),store_notifications(kind,status)").order("created_at", { ascending: false }).limit(100),
  ]);
  const products = (catalog.data ?? []) as Product[];
  return <section className="mx-auto max-w-6xl px-5 pb-28 pt-28 sm:pt-32">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-widest text-khaki-ink">Área administrativa</p><h1 className="mt-2 text-5xl text-vinho">Painel da Casa</h1><p className="mt-2 text-sm text-ink/70">Gestão editorial e comercial · {access.user.email}</p></div><form action={signOut}><button className="rounded-full border border-vinho/25 px-5 py-3 text-sm text-vinho">Sair</button></form></div>
    <div className="mt-6 rounded-2xl border border-khaki/40 bg-almond-lift p-4 text-sm leading-relaxed"><strong>Preparação da loja:</strong> o catálogo é interno. Frete, cobranças e notificações ainda precisam ser integrados e validados antes de liberar compras.</div>
    {notice && <div role="status" className="mt-4 rounded-xl bg-almond-deep p-4">{notice}{mensagem==="maintenance-saved" && /^\d{1,6}$/.test(liberadas??"") && /^\d{1,6}$/.test(revisao??"") && <p className="mt-1">Reservas liberadas: {liberadas} · Aguardam conciliação: {revisao}.</p>}</div>}
    <div className="mt-4 rounded-2xl border border-ink/15 bg-almond-lift p-4 text-sm"><strong>Manutenção de estoque</strong><p className="mt-1 text-ink/70">Libera somente reservas expiradas que nunca chegaram ao provedor. Pagamentos iniciados ficam aguardando conciliação.</p><form action={reviewExpiredReservations} className="mt-3"><button className={button}>Verificar reservas expiradas</button></form></div>
    <nav aria-label="Seções do painel" className="my-6 flex flex-wrap gap-3 text-sm"><a className="rounded-full bg-vinho/10 px-4 py-3 font-medium text-vinho" href="#captacoes">Solicitações</a><a className="rounded-full bg-vinho/10 px-4 py-3 font-medium text-vinho" href="#catalogo">Catálogo</a><a className="rounded-full bg-vinho/10 px-4 py-3 font-medium text-vinho" href="#pedidos">Pedidos</a></nav>
    <div className="grid gap-4 sm:grid-cols-3">
      {[{label:"Livros no cadastro",value:catalog.error ? "—" : `${products.length}${products.length === 100 ? "+" : ""}`},{label:"Rascunhos na lista",value:catalog.error ? "—" : products.filter(p => p.status === "draft").length},{label:"Pedidos recentes",value:orders.error ? "—" : `${orders.data?.length ?? 0}${orders.data?.length === 100 ? "+" : ""}`}].map(item => <div key={item.label} className={card}><p className="text-sm text-ink/70">{item.label}</p><p className="mt-2 text-3xl font-medium text-vinho">{item.value}</p></div>)}
    </div>
    <AdminLeads client={access.client} source={origem} status={status}/>
    <section id="catalogo" className="mt-10 scroll-mt-28"><h2 className="text-3xl text-vinho">Catálogo e estoque</h2><p className="mt-2 text-sm text-ink/70">Cadastre apenas títulos cuja venda foi autorizada pela Casa.</p>
      {catalog.error ? <p role="alert" className="mt-4">Não foi possível carregar o catálogo.</p> : <><details className={`${card} mt-5`}><summary className="cursor-pointer font-medium text-vinho">Cadastrar novo livro</summary><ProductForm /></details>
      {products.length === 0 && <p className="mt-5 text-sm text-ink/70">Nenhum livro comercial cadastrado. Comece pelo primeiro título com dados oficiais.</p>}
      <div className="mt-5 grid gap-3">{products.map(product => <details key={product.id} className={card}><summary className="cursor-pointer"><span className="font-medium text-vinho">{product.title}</span><span className="mt-2 block text-sm text-ink/70">{product.author} · {product.price_cents ? prices.format(product.price_cents / 100) : "Preço pendente"} · {product.stock} em estoque · {states[product.status]}{product.published ? " · Publicado" : " · Interno"}</span></summary><ProductForm product={product}/></details>)}</div></>}
    </section>
    <section id="pedidos" className="mt-10 scroll-mt-28"><h2 className="text-3xl text-vinho">Pedidos recentes</h2><div className={`${card} mt-5`}>
      {orders.error ? <p role="alert">Não foi possível carregar os pedidos.</p> : !orders.data?.length ? <p className="text-sm text-ink/70">Nenhum pedido registrado. Os pedidos serão exibidos após a integração do checkout.</p> : <ul className="divide-y divide-ink/10">{orders.data.map(order => <li key={order.reference} className="py-4"><details><summary className="cursor-pointer"><span className="block break-all font-medium text-vinho">{order.reference}</span><span className="mt-1 block text-sm">{order.customer_name} · {new Date(order.created_at).toLocaleDateString("pt-BR", {timeZone:"America/Sao_Paulo"})} · {prices.format(order.total_cents / 100)}</span><span className="mt-1 block text-sm text-ink/70">{states[order.payment_status]} · {states[order.fulfillment_status]}{order.tracking_code ? ` · ${order.tracking_code}` : ""}</span>{order.payment_review&&<span className="mt-2 block font-medium text-vinho">Pagamento requer revisão</span>}</summary><div className="mt-4 grid gap-4 rounded-2xl bg-almond p-4 text-sm sm:grid-cols-2"><div><p className="font-medium text-vinho">Itens</p><ul className="mt-2 space-y-1">{order.store_order_items.map((item,i)=><li key={i}>{item.quantity} × {item.title_snapshot} · {prices.format(item.unit_price_cents*item.quantity/100)}</li>)}</ul></div><div><p className="font-medium text-vinho">Entrega · {order.shipping_service}</p><p className="mt-2 break-words">{order.customer_email}</p>{Object.entries(order.shipping_address??{}).map(([key,value])=><p key={key} className="break-words">{key}: {String(value)}</p>)}</div></div>{order.payment_status==="paid"&&!order.payment_review&&["preparing","shipped"].includes(order.fulfillment_status)&&<form action={updateFulfillment} className="mt-4 flex flex-wrap items-end gap-3"><input type="hidden" name="reference" value={order.reference}/><input type="hidden" name="fulfillment" value={order.fulfillment_status==="preparing"?"shipped":"delivered"}/>{order.fulfillment_status==="preparing"&&<Field name="tracking" label="Código de rastreamento" required/>}<button className={button}>{order.fulfillment_status==="preparing"?"Marcar como enviado":"Confirmar entrega"}</button></form>}{order.store_notifications.length>0&&<div className="mt-4 rounded-xl border border-ink/10 p-4"><p className="font-medium text-vinho">Notificações de compra</p>{order.store_notifications.map(n=><p className="mt-1 text-sm" key={n.kind}>{n.kind==="shipped"?"Rastreamento":"Pagamento confirmado"}: {{pending:"Na fila",sending:"Enviando",sent:"Aceito pelo provedor",failed:"Falha no envio",skipped:"Ignorado"}[n.status as string]??n.status}</p>)}{order.store_notifications.some(n=>["pending","failed","sending"].includes(n.status))&&<form action={retryNotifications} className="mt-3"><input name="reference" type="hidden" value={order.reference}/><button className="text-sm text-vinho underline">Tentar notificações pendentes</button></form>}</div>}</details></li>)}</ul>}
    </div></section>
  </section>;
}
