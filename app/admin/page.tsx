import type { Metadata } from "next";
import {Suspense} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {AdminSubmit} from "@/components/admin-feedback";
import {editorialEmailConfigured,editorialAdminAlertConfigured} from "@/lib/editorial-notifications";
import Link from "next/link";
import { getStoreAccess } from "@/lib/store-admin";
import { saveProduct, signIn, signOut, updateFulfillment, retryNotifications, reviewExpiredReservations, requestEmailAccess, verifyEmailAccess, updateAdminPassword } from "./actions";
import { AdminCrm } from "@/components/admin-crm";
import { AdminOverview } from "@/components/admin-overview";
import { AdminShell, AdminHeading, adminTabs, type AdminTab } from "@/components/admin-shell";
import { BrandSeal } from "@/components/brand-seal";

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
  "email-rate-limit":"Aguarde antes de solicitar um novo link. Confira seu e-mail e a caixa de spam: uma solicitação anterior pode já ter sido enviada.",
  "lead-saved":"Situação da solicitação atualizada.",
  "lead-error":"Não foi possível atualizar a solicitação.",
  "email-not-configured":"O remetente e o provedor de e-mail ainda não estão configurados.",
  "editorial-email-attempt":"Fila consultada. Confira o estado de cada envio na solicitação." ,
  "stale-lead":"O acompanhamento mudou desde que você o abriu. Revise as anotações antes de salvar novamente.",
  "password-invalid":"Use uma senha com pelo menos 12 caracteres e repita-a corretamente.",
  "password-error":"Não foi possível alterar a senha. Se necessário, entre novamente com seu link de acesso.",
  "password-saved":"Senha atualizada. Agora você pode entrar com seu e-mail e sua senha.",
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
    <AdminSubmit className={button}>{product ? "Salvar alterações" : "Cadastrar livro"}</AdminSubmit>
  </form>;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mensagem?: string; liberadas?: string; revisao?: string; origem?: string; status?: string; aba?:string; busca?:string; pagina?:string }> }) {
  const access = await getStoreAccess();
  const { mensagem, liberadas, revisao, origem, status, aba, busca, pagina } = await searchParams;
  const tab:AdminTab=adminTabs.some(item=>item.id===aba)?aba as AdminTab:"visao";
  const notice = mensagem && Object.hasOwn(messages, mensagem) ? messages[mensagem] : null;

  if (access.state !== "admin") return <section className="admin-login grid min-h-screen place-items-center bg-[#f5f2ee] px-4 py-10 sm:px-8">
    <div className="w-full max-w-[960px] overflow-hidden rounded-3xl border border-ink/10 bg-almond-lift shadow-panel lg:grid lg:grid-cols-[.85fr_1fr]">
    <div className="relative hidden overflow-hidden bg-vinho p-10 text-almond lg:flex lg:flex-col lg:justify-between"><BrandSeal size={68}/><div><p className="text-xs uppercase tracking-[.18em] text-khaki">NobreDNA · Casa de Legados</p><h2 className="mt-4 text-5xl leading-tight">O cuidado com cada história começa aqui.</h2><p className="mt-5 text-sm leading-relaxed text-almond/80">Seu espaço privado de gestão editorial, livros e relacionamento com autoras.</p></div><p className="mt-14 text-xs tracking-wider text-khaki">ÁREA DA EDITORA</p></div>
    <div className="min-w-0 p-6 sm:p-10"><div className="mb-5 lg:hidden"><BrandSeal size={54}/></div>
      <p className="text-xs font-semibold uppercase tracking-widest text-khaki-ink">Acesso privado</p>
      <h1 className="mt-3 text-5xl text-vinho">Painel da Casa</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">Entre com sua conta autorizada para administrar a editora.</p>
      {notice && <p role="status" className="mt-4 rounded-xl bg-almond-deep p-3 text-sm">{notice}</p>}
      {access.state === "unconfigured" ? <div className="mt-6 rounded-2xl border border-khaki/40 bg-almond p-4"><p className="font-medium">Configuração em andamento</p><p className="mt-2 text-sm leading-relaxed text-ink/70">A área administrativa será liberada após a conexão segura com o banco de dados da editora. A loja pública continua em modo de consulta.</p></div>
        : access.state === "signed-out" ? <div className="mt-7 space-y-5"><form action={signIn} className="space-y-4"><label className="block text-sm font-medium">E-mail<input type="email" name="email" autoComplete="username" placeholder="Seu e-mail" required className={inputClass}/></label><label className="block text-sm font-medium">Senha<input type="password" name="password" autoComplete="current-password" required className={inputClass}/></label><AdminSubmit className="admin-primary w-full" pendingText="Entrando…">Entrar no painel</AdminSubmit></form><details className="border-t border-ink/15 pt-4"><summary className="cursor-pointer text-sm font-medium text-vinho">Primeiro acesso ou sem senha? Receber link</summary><form action={requestEmailAccess} className="mt-4 space-y-4"><label className="block text-sm font-medium">E-mail autorizado<input type="email" name="email" autoComplete="email" required className={inputClass}/></label><AdminSubmit className="admin-secondary w-full" pendingText="Solicitando link…">Receber link de acesso</AdminSubmit></form></details><details className="border-t border-ink/15 pt-4"><summary className="cursor-pointer text-sm text-vinho">Recebi um código por e-mail</summary><form action={verifyEmailAccess} className="mt-4 space-y-4"><label className="block text-sm">E-mail<input name="email" type="email" required className={inputClass}/></label><label className="block text-sm">Código<input name="token" inputMode="numeric" maxLength={6} required className={inputClass}/></label><AdminSubmit pendingText="Confirmando…">Confirmar código</AdminSubmit></form></details></div>
        : <div className="mt-6 space-y-4"><p role="alert">{access.state === "denied" ? "Seu usuário não tem permissão para acessar a gestão da Casa." : "Não foi possível verificar seu acesso neste momento."}</p><form action={signOut}><button className={button}>Sair</button></form></div>}
      <Link href="/" className="mt-6 inline-block text-sm text-vinho underline underline-offset-4">Voltar ao site</Link>
    </div></div>
  </section>;

  const banner=notice&&<div role="status" className="mb-5 rounded-xl border border-vinho/15 bg-white p-4 text-sm text-vinho">{notice}{mensagem==="maintenance-saved" && /^\d{1,6}$/.test(liberadas??"") && /^\d{1,6}$/.test(revisao??"") && <p className="mt-1">Reservas liberadas: {liberadas} · Aguardam conciliação: {revisao}.</p>}</div>;
  const wrap=(content:React.ReactNode)=><AdminShell tab={tab} email={access.user.email??""}>{banner}<Suspense key={tab+":"+(origem??"")+":"+(status??"")+":"+(busca??"")+":"+(pagina??"")} fallback={<div role="status" className="admin-card p-6"><p className="text-sm font-medium text-vinho">Carregando informações…</p><div className="mt-4 h-24 animate-pulse rounded-xl bg-almond-deep motion-reduce:animate-none"/></div>}>{content}</Suspense></AdminShell>;
  if(tab==="visao")return wrap(<AdminOverview client={access.client}/>);
  if(tab==="interessados"||tab==="coautorias")return wrap(<AdminCrm client={access.client} source={origem} status={status} search={busca} page={pagina} coauthor={tab==="coautorias"}/>);
  if(tab==="configuracoes")return wrap(<>
    <AdminHeading eyebrow="Área privada" title="Configurações" description="Gerencie seu acesso à Casa e as rotinas da loja."/>
    <div className="grid gap-5 xl:grid-cols-2"><section className="admin-card p-6"><h2 className="font-sans text-lg font-semibold">Sua conta</h2><p className="mt-2 break-all text-sm text-ink/65">{access.user.email}</p><p className="mt-4 text-sm leading-relaxed text-ink/70">Crie ou altere sua senha para entrar sem depender do link de e-mail. Escolha uma senha exclusiva para a editora.</p><form action={updateAdminPassword} className="mt-5 space-y-4"><label className="block text-sm font-medium">Nova senha<input type="password" name="password" minLength={12} maxLength={128} autoComplete="new-password" required className={inputClass}/></label><label className="block text-sm font-medium">Confirmar senha<input type="password" name="confirmation" minLength={12} maxLength={128} autoComplete="new-password" required className={inputClass}/></label><AdminSubmit>Salvar senha</AdminSubmit></form></section><section className="admin-card p-6"><h2 className="font-sans text-lg font-semibold">Operação comercial</h2><p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">Loja em preparação: pagamentos reais e frete aguardam configuração e validação.</p><div className="mt-5 rounded-xl border border-ink/10 p-4"><h3 className="font-sans text-sm font-semibold">E-mails transacionais</h3><p className="mt-2 text-sm text-ink/70">Confirmações: {editorialEmailConfigured()?"Provedor configurado · validar entrega":"Aguardando remetente verificado e credenciais"}.</p><p className="mt-2 text-sm text-ink/70">Avisos à editora: {editorialAdminAlertConfigured()?"Destinatário configurado":"Aguardando e-mail da equipe"}.</p><p className="mt-3 text-xs leading-relaxed text-ink/60">Cada solicitação fica salva mesmo sem e-mail. O estado de envio aparece na ficha do interessado.</p></div><h3 className="mt-5 font-sans text-sm font-semibold">Manutenção de estoque</h3><p className="mt-2 text-sm leading-relaxed text-ink/65">Libera somente reservas expiradas que nunca chegaram ao provedor. Pagamentos iniciados ficam aguardando conciliação.</p><form action={reviewExpiredReservations} className="mt-4"><AdminSubmit className="admin-secondary" pendingText="Verificando…">Verificar reservas expiradas</AdminSubmit></form></section></div>
  </>);

  return wrap(<CommerceTab client={access.client} tab={tab}/>);
}

async function CommerceTab({client,tab}:{client:SupabaseClient;tab:AdminTab}){
  const [catalog, orders] = await Promise.all([
    tab==="livros"?client.from("store_products").select("id,title,author,slug,description,isbn,cover_url,price_cents,stock,weight_g,width_mm,height_mm,length_mm,status,published,updated_at").order("created_at", { ascending: false }).limit(100):Promise.resolve({data:null,error:null}),
    tab==="pedidos"?client.from("store_orders").select("reference,customer_name,customer_email,shipping_address,shipping_service,total_cents,payment_status,fulfillment_status,tracking_code,created_at,payment_review,store_order_items(title_snapshot,quantity,unit_price_cents),store_notifications(kind,status)").order("created_at", { ascending: false }).limit(100):Promise.resolve({data:null,error:null}),
  ]);
  const products = (catalog.data ?? []) as Product[];
  return <>
    {tab==="livros"&&<section id="catalogo"><AdminHeading eyebrow="Livraria" title="Livros e estoque" description="Cadastre, revise e organize os títulos oficiais da editora."/>
      <p className="mb-5 rounded-xl border border-khaki/40 bg-almond-lift p-4 text-sm leading-relaxed"><strong>Preparação da loja:</strong> cadastre apenas títulos cuja venda foi autorizada pela Casa. O pagamento real segue desligado.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[{label:"Livros cadastrados",value:catalog.error?"—":products.length},{label:"Rascunhos",value:catalog.error?"—":products.filter(p=>p.status==="draft").length},{label:"Publicados",value:catalog.error?"—":products.filter(p=>p.published).length}].map(item=><div className="admin-card p-5" key={item.label}><p className="text-sm text-ink/65">{item.label}</p><p className="mt-2 text-3xl font-semibold text-vinho">{item.value}</p></div>)}</div>
      {catalog.error ? <p role="alert" className="mt-4">Não foi possível carregar o catálogo.</p> : <><details className={`${card} mt-5`}><summary className="cursor-pointer font-medium text-vinho">Cadastrar novo livro</summary><ProductForm /></details>
      {products.length === 0 && <p className="mt-5 text-sm text-ink/70">Nenhum livro comercial cadastrado. Comece pelo primeiro título com dados oficiais.</p>}
      <div className="mt-5 grid gap-3">{products.map(product => <details key={product.id} className={card}><summary className="cursor-pointer"><span className="font-medium text-vinho">{product.title}</span><span className="mt-2 block text-sm text-ink/70">{product.author} · {product.price_cents ? prices.format(product.price_cents / 100) : "Preço pendente"} · {product.stock} em estoque · {states[product.status]}{product.published ? " · Publicado" : " · Interno"}</span></summary><ProductForm product={product}/></details>)}</div></>}
    </section>}
    {tab==="pedidos"&&<section id="pedidos"><AdminHeading eyebrow="Operação comercial" title="Pedidos e entregas" description="Acompanhe pagamentos, expedição e rastreamento de cada compra."/><div className={`${card} mt-5`}>
      {orders.error ? <p role="alert">Não foi possível carregar os pedidos.</p> : !orders.data?.length ? <p className="text-sm text-ink/70">Nenhum pedido registrado. Os pedidos serão exibidos após a integração do checkout.</p> : <ul className="divide-y divide-ink/10">{orders.data.map(order => <li key={order.reference} className="py-4"><details><summary className="cursor-pointer"><span className="block break-all font-medium text-vinho">{order.reference}</span><span className="mt-1 block text-sm">{order.customer_name} · {new Date(order.created_at).toLocaleDateString("pt-BR", {timeZone:"America/Sao_Paulo"})} · {prices.format(order.total_cents / 100)}</span><span className="mt-1 block text-sm text-ink/70">{states[order.payment_status]} · {states[order.fulfillment_status]}{order.tracking_code ? ` · ${order.tracking_code}` : ""}</span>{order.payment_review&&<span className="mt-2 block font-medium text-vinho">Pagamento requer revisão</span>}</summary><div className="mt-4 grid gap-4 rounded-2xl bg-almond p-4 text-sm sm:grid-cols-2"><div><p className="font-medium text-vinho">Itens</p><ul className="mt-2 space-y-1">{order.store_order_items.map((item,i)=><li key={i}>{item.quantity} × {item.title_snapshot} · {prices.format(item.unit_price_cents*item.quantity/100)}</li>)}</ul></div><div><p className="font-medium text-vinho">Entrega · {order.shipping_service}</p><p className="mt-2 break-words">{order.customer_email}</p>{Object.entries(order.shipping_address??{}).map(([key,value])=><p key={key} className="break-words">{key}: {String(value)}</p>)}</div></div>{order.payment_status==="paid"&&!order.payment_review&&["preparing","shipped"].includes(order.fulfillment_status)&&<form action={updateFulfillment} className="mt-4 flex flex-wrap items-end gap-3"><input type="hidden" name="reference" value={order.reference}/><input type="hidden" name="fulfillment" value={order.fulfillment_status==="preparing"?"shipped":"delivered"}/>{order.fulfillment_status==="preparing"&&<Field name="tracking" label="Código de rastreamento" required/>}<AdminSubmit className={button}>{order.fulfillment_status==="preparing"?"Marcar como enviado":"Confirmar entrega"}</AdminSubmit></form>}{order.store_notifications.length>0&&<div className="mt-4 rounded-xl border border-ink/10 p-4"><p className="font-medium text-vinho">Notificações de compra</p>{order.store_notifications.map(n=><p className="mt-1 text-sm" key={n.kind}>{n.kind==="shipped"?"Rastreamento":"Pagamento confirmado"}: {{pending:"Na fila",sending:"Enviando",sent:"Aceito pelo provedor",failed:"Falha no envio",skipped:"Ignorado"}[n.status as string]??n.status}</p>)}{order.store_notifications.some(n=>["pending","failed","sending"].includes(n.status))&&<form action={retryNotifications} className="mt-3"><input name="reference" type="hidden" value={order.reference}/><AdminSubmit className="admin-secondary" pendingText="Consultando…">Tentar notificações pendentes</AdminSubmit></form>}</div>}</details></li>)}</ul>}
    </div></section>}
  </>;
}
