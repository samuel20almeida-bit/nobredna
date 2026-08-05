"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BookCover } from "@/components/book-cover";
import { ArrowRight, Close, Lock, Minus, Plus, Route } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { formatBRL, formatCEP, onlyDigits } from "@/lib/format";
import type { ShippingOption } from "@/lib/shipping";

type Comprador = {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const compradorInicial: Comprador = {
  nome: "",
  sobrenome: "",
  email: "",
  cpf: "",
  telefone: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

type Resumo = {
  simulado: boolean;
  referencia: string;
  subtotalCents: number;
  freteCents: number;
  totalCents: number;
  checkoutUrl?: string;
};

const campoBase =
  "w-full border-b border-gold/25 bg-transparent pb-2.5 text-[0.95rem] text-cream outline-none transition-colors duration-300 focus:border-gold placeholder:text-cream/20";

function Campo({
  label,
  value,
  onChange,
  className = "",
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className={`flex flex-col gap-2.5 ${className}`}>
      <span className="text-[0.58rem] tracking-[0.26em] uppercase text-cream/40">
        {label}
      </span>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={campoBase}
      />
    </label>
  );
}

export function CheckoutClient() {
  const { items, lines, subtotalCents, setQty, remove, ready } = useCart();
  const [comprador, setComprador] = useState<Comprador>(compradorInicial);
  const [opcoes, setOpcoes] = useState<ShippingOption[]>([]);
  const [freteId, setFreteId] = useState<string | null>(null);
  const [simulado, setSimulado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cotando, setCotando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const [resumo, setResumo] = useState<Resumo | null>(null);

  const set = useCallback(
    <K extends keyof Comprador>(campo: K, valor: Comprador[K]) =>
      setComprador((prev) => ({ ...prev, [campo]: valor })),
    [],
  );

  const frete = useMemo(
    () => opcoes.find((o) => o.id === freteId) ?? null,
    [opcoes, freteId],
  );

  const totalCents = subtotalCents + (frete?.priceCents ?? 0);
  const cepDigits = onlyDigits(comprador.cep);

  // trocar a sacola invalida a cotação anterior
  useEffect(() => {
    setOpcoes([]);
    setFreteId(null);
  }, [lines]);

  async function buscarEndereco(cep: string) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setComprador((prev) => ({
        ...prev,
        logradouro: prev.logradouro || data.logradouro || "",
        bairro: prev.bairro || data.bairro || "",
        cidade: data.localidade || prev.cidade,
        uf: data.uf || prev.uf,
      }));
    } catch {
      // preenchimento automático é conveniência — o usuário digita se falhar
    }
  }

  async function cotarFrete() {
    if (cepDigits.length !== 8 || items.length === 0) return;
    setCotando(true);
    setErro(null);
    setAviso(null);
    try {
      void buscarEndereco(cepDigits);

      const res = await fetch("/api/frete/cotacao", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cep: cepDigits, itens: lines }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro ?? "Falha na cotação.");

      setOpcoes(data.options);
      setFreteId(data.options[0]?.id ?? null);
      setSimulado(Boolean(data.simulated));
      setAviso(data.notice ?? null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha na cotação.");
    } finally {
      setCotando(false);
    }
  }

  async function pagar() {
    if (!frete) {
      setErro("Calcule o frete antes de finalizar.");
      return;
    }
    setPagando(true);
    setErro(null);
    try {
      const res = await fetch("/api/checkout/preferencia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ itens: lines, comprador, freteId: frete.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro ?? "Não foi possível abrir o pagamento.");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setResumo(data);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível abrir o pagamento.");
    } finally {
      setPagando(false);
    }
  }

  if (!ready) {
    return <div className="min-h-[50vh]" aria-hidden="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="border border-gold/20 px-8 py-20 text-center">
        <p className="font-serif text-[1.6rem] text-cream/85">
          A sacola está vazia.
        </p>
        <p className="mx-auto mt-4 max-w-[32rem] text-[0.95rem] leading-[1.8] text-cream/45">
          O catálogo tem oito títulos. Nenhum deles chega até aqui sozinho.
        </p>
        <Link
          href="/#acervo"
          className="group mt-9 inline-flex items-center gap-3 border border-gold/40 px-7 py-3.5 text-[0.75rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-500 hover:border-gold hover:bg-gold/8"
        >
          Ver o acervo
          <span className="transition-transform duration-500 group-hover:translate-x-1">
            <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
      <div>
        {/* Sacola */}
        <section>
          <h2 className="text-[0.62rem] tracking-[0.3em] uppercase text-gold">
            Sua sacola
          </h2>
          <ul className="mt-7 divide-y divide-gold/12 border-y border-gold/12">
            {items.map(({ book, qty }) => (
              <li key={book.slug} className="flex gap-6 py-7">
                <Link href={`/livro/${book.slug}`} className="w-[76px] shrink-0">
                  <BookCover book={book} />
                </Link>

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/livro/${book.slug}`}
                        className="text-[1rem] text-cream transition-colors duration-300 hover:text-gold-light"
                      >
                        {book.title}
                      </Link>
                      <p className="mt-1 text-[0.8rem] text-cream/45">
                        {book.author}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(book.slug)}
                      aria-label={`Remover ${book.title}`}
                      className="text-cream/30 transition-colors duration-300 hover:text-gold"
                    >
                      <Close size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center border border-gold/20">
                      <button
                        type="button"
                        onClick={() => setQty(book.slug, qty - 1)}
                        aria-label="Diminuir"
                        className="px-2.5 py-2 text-gold transition-colors duration-300 hover:bg-gold/10"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-[0.85rem] tabular-nums text-cream">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(book.slug, qty + 1)}
                        disabled={qty >= 12}
                        aria-label="Aumentar"
                        className="px-2.5 py-2 text-gold transition-colors duration-300 hover:bg-gold/10 disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-[0.95rem] tabular-nums text-gold">
                      {formatBRL(book.priceCents * qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Entrega */}
        <section className="mt-14">
          <h2 className="text-[0.62rem] tracking-[0.3em] uppercase text-gold">
            Entrega
          </h2>

          <div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <Campo
              label="Nome"
              value={comprador.nome}
              onChange={(v) => set("nome", v)}
              autoComplete="given-name"
            />
            <Campo
              label="Sobrenome"
              value={comprador.sobrenome}
              onChange={(v) => set("sobrenome", v)}
              autoComplete="family-name"
            />
            <Campo
              label="E-mail"
              type="email"
              value={comprador.email}
              onChange={(v) => set("email", v)}
              autoComplete="email"
            />
            <Campo
              label="Telefone"
              inputMode="numeric"
              value={comprador.telefone}
              onChange={(v) => set("telefone", v.slice(0, 16))}
              placeholder="(11) 90000-0000"
              autoComplete="tel"
            />
            <Campo
              label="CPF"
              inputMode="numeric"
              value={comprador.cpf}
              onChange={(v) => set("cpf", onlyDigits(v).slice(0, 11))}
              placeholder="Somente números"
            />

            <label className="flex flex-col gap-2.5">
              <span className="text-[0.58rem] tracking-[0.26em] uppercase text-cream/40">
                CEP
              </span>
              <div className="flex items-end gap-4">
                <input
                  value={formatCEP(comprador.cep)}
                  onChange={(e) => set("cep", onlyDigits(e.target.value))}
                  onBlur={() => cepDigits.length === 8 && cotarFrete()}
                  inputMode="numeric"
                  placeholder="00000-000"
                  autoComplete="postal-code"
                  className={campoBase}
                />
                <button
                  type="button"
                  onClick={cotarFrete}
                  disabled={cepDigits.length !== 8 || cotando}
                  className="shrink-0 pb-2.5 text-[0.68rem] tracking-[0.2em] uppercase text-gold transition-opacity duration-300 hover:text-gold-light disabled:opacity-30"
                >
                  {cotando ? "Calculando" : "Calcular"}
                </button>
              </div>
            </label>

            <Campo
              label="Endereço"
              value={comprador.logradouro}
              onChange={(v) => set("logradouro", v)}
              className="sm:col-span-2"
              autoComplete="address-line1"
            />
            <Campo
              label="Número"
              value={comprador.numero}
              onChange={(v) => set("numero", v)}
            />
            <Campo
              label="Complemento (opcional)"
              value={comprador.complemento}
              onChange={(v) => set("complemento", v)}
            />
            <Campo
              label="Bairro"
              value={comprador.bairro}
              onChange={(v) => set("bairro", v)}
            />
            <div className="grid grid-cols-[1fr_5rem] gap-6">
              <Campo
                label="Cidade"
                value={comprador.cidade}
                onChange={(v) => set("cidade", v)}
              />
              <Campo
                label="UF"
                value={comprador.uf}
                onChange={(v) => set("uf", v.toUpperCase().slice(0, 2))}
              />
            </div>
          </div>
        </section>

        {/* Frete */}
        <AnimatePresence>
          {opcoes.length > 0 && (
            <motion.section
              className="mt-14"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="flex items-center gap-3 text-[0.62rem] tracking-[0.3em] uppercase text-gold">
                <Route size={16} />
                Envio
              </h2>

              <ul className="mt-6 space-y-3">
                {opcoes.map((opcao) => {
                  const ativa = opcao.id === freteId;
                  return (
                    <li key={opcao.id}>
                      <button
                        type="button"
                        onClick={() => setFreteId(opcao.id)}
                        aria-pressed={ativa}
                        className={`flex w-full items-center justify-between gap-6 border px-6 py-4 text-left transition-colors duration-300 ${
                          ativa
                            ? "border-gold bg-gold/8"
                            : "border-gold/20 hover:border-gold/45"
                        }`}
                      >
                        <span>
                          <span className="block text-[0.92rem] text-cream">
                            {opcao.carrier} · {opcao.service}
                          </span>
                          <span className="mt-1 block text-[0.78rem] text-cream/40">
                            até {opcao.days} dias úteis
                          </span>
                        </span>
                        <span className="text-[0.95rem] tabular-nums text-gold">
                          {formatBRL(opcao.priceCents)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {simulado && aviso && (
                <p className="mt-4 border-l border-gold/40 pl-4 text-[0.78rem] leading-relaxed text-cream/45">
                  {aviso}
                </p>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Resumo */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-gold/20 p-8">
          <h2 className="text-[0.62rem] tracking-[0.3em] uppercase text-gold">
            Resumo
          </h2>

          <dl className="mt-7 space-y-4 text-[0.92rem]">
            <div className="flex justify-between text-cream/60">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatBRL(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-cream/60">
              <dt>Frete</dt>
              <dd className="tabular-nums">
                {frete ? formatBRL(frete.priceCents) : "a calcular"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-gold/15 pt-5 text-cream">
              <dt className="text-[0.7rem] tracking-[0.24em] uppercase">Total</dt>
              <dd className="font-serif text-[1.5rem] tabular-nums text-gold-light">
                {formatBRL(totalCents)}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={pagar}
            disabled={pagando || !frete}
            className="group mt-8 flex w-full items-center justify-center gap-3 border border-gold bg-gold/10 px-6 py-4 text-[0.75rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-500 hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {pagando ? "Abrindo pagamento" : "Pagar com Mercado Pago"}
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </button>

          {erro && (
            <p className="mt-4 text-[0.82rem] leading-relaxed text-gold-light/80">
              {erro}
            </p>
          )}

          <p className="mt-6 flex items-start gap-3 text-[0.74rem] leading-relaxed text-cream/35">
            <span className="mt-0.5 shrink-0 text-gold/70">
              <Lock size={15} />
            </span>
            O pagamento acontece no ambiente do Mercado Pago. Cartão, Pix ou
            boleto — nenhum dado de cartão passa por este site.
          </p>
        </div>

        <AnimatePresence>
          {resumo?.simulado && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-gold/25 bg-gold/5 p-6"
            >
              <p className="text-[0.7rem] tracking-[0.24em] uppercase text-gold">
                Pedido montado · {resumo.referencia}
              </p>
              <p className="mt-4 text-[0.85rem] leading-[1.75] text-cream/60">
                Nada foi cobrado: a variável{" "}
                <code className="text-gold-light">MERCADOPAGO_ACCESS_TOKEN</code>{" "}
                não está configurada neste ambiente. Com a credencial no lugar,
                este mesmo botão abre o checkout do Mercado Pago com o total de{" "}
                {formatBRL(resumo.totalCents)}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
