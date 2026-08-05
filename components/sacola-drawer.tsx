"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { ArrowRight, Close, Minus, Plus, Route } from "@/components/icons";
import { useDrawer } from "@/components/ui/drawer";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";

const LARGURA = 428;

/**
 * Painel lateral da sacola.
 *
 * A mecânica (scroll lock, focus trap, arraste para dispensar) vem do hook
 * headless em components/ui/drawer.tsx; tudo o que se vê aqui é do sistema da
 * casa — fio dourado na borda, capas geradas, serifada só no total.
 */
export function SacolaDrawer() {
  const { items, subtotalCents, setQty, remove, count, drawerOpen, setDrawerOpen } =
    useCart();
  const pathname = usePathname();
  const [host, setHost] = useState<HTMLElement | null>(null);

  const drawer = useDrawer({
    open: drawerOpen,
    onOpenChange: setDrawerOpen,
    side: "right",
    width: LARGURA,
  });

  useEffect(() => setHost(document.body), []);

  // navegar fecha o painel — inclusive ao seguir para o checkout
  useEffect(() => setDrawerOpen(false), [pathname, setDrawerOpen]);

  if (!host) return null;

  return createPortal(
    <div
      ref={drawer.rootRef}
      className={`fixed inset-0 z-[60] overflow-hidden ${
        drawerOpen ? "" : "pointer-events-none"
      }`}
    >
      <motion.div
        aria-hidden
        style={{ opacity: drawer.veil }}
        onClick={drawer.close}
        className="absolute inset-0 bg-navy-deep/70 backdrop-blur-[2px]"
      />

      <motion.div
        ref={drawer.panelRef}
        aria-label="Sua sacola"
        style={{
          x: drawer.x,
          width: LARGURA,
          maxWidth: "calc(100% - 32px)",
          touchAction: "pan-y",
          boxShadow: "var(--shadow-panel)",
        }}
        className={`absolute inset-y-0 right-0 flex flex-col border-l border-gold/25 bg-navy outline-none ${
          drawer.dragging ? "select-none" : ""
        }`}
        {...drawer.panelProps}
      >
        <header
          onPointerDown={drawer.gripProps.onPointerDown}
          className={`flex select-none items-center justify-between gap-4 border-b border-gold/15 px-7 py-6 ${
            drawer.dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div>
            <p className="eyebrow">Sua sacola</p>
            <p className="mt-2 text-[0.82rem] text-cream/40">
              {count === 0
                ? "nenhum exemplar"
                : `${count} ${count === 1 ? "exemplar" : "exemplares"}`}
            </p>
          </div>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={drawer.close}
            aria-label="Fechar sacola"
            className="text-cream/40 transition-colors duration-300 hover:text-gold"
          >
            <Close size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <p className="font-serif text-[1.3rem] text-cream/75">
                Ainda vazia.
              </p>
              <p className="max-w-[24ch] text-[0.88rem] leading-relaxed text-cream/40">
                O catálogo tem oito títulos, e cada um responde a uma pergunta
                diferente.
              </p>
              <Link
                href="/#acervo"
                onClick={drawer.close}
                className="mt-2 text-[0.7rem] tracking-[0.22em] uppercase text-gold underline decoration-gold/30 underline-offset-[7px] transition-colors duration-300 hover:text-gold-light"
              >
                Ver o acervo
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gold/10">
              {items.map(({ book, qty }) => (
                <li key={book.slug} className="flex gap-5 py-6">
                  <Link
                    href={`/livro/${book.slug}`}
                    onClick={drawer.close}
                    className="w-[62px] shrink-0"
                  >
                    <BookCover book={book} />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/livro/${book.slug}`}
                          onClick={drawer.close}
                          className="block truncate text-[0.95rem] text-cream transition-colors duration-300 hover:text-gold-light"
                        >
                          {book.title}
                        </Link>
                        <p className="mt-1 truncate text-[0.76rem] text-cream/40">
                          {book.author}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(book.slug)}
                        aria-label={`Remover ${book.title}`}
                        className="shrink-0 text-cream/25 transition-colors duration-300 hover:text-gold"
                      >
                        <Close size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center border border-gold/20">
                        <button
                          type="button"
                          onClick={() => setQty(book.slug, qty - 1)}
                          aria-label="Diminuir"
                          className="px-2.5 py-1.5 text-gold transition-colors duration-300 hover:bg-gold/10"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-[0.8rem] tabular-nums text-cream">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(book.slug, qty + 1)}
                          disabled={qty >= 12}
                          aria-label="Aumentar"
                          className="px-2.5 py-1.5 text-gold transition-colors duration-300 hover:bg-gold/10 disabled:opacity-30"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-[0.88rem] tabular-nums text-gold">
                        {formatBRL(book.priceCents * qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold/15 px-7 py-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.66rem] tracking-[0.24em] uppercase text-cream/45">
                Subtotal
              </span>
              <span className="font-serif text-[1.5rem] tabular-nums text-gold-light">
                {formatBRL(subtotalCents)}
              </span>
            </div>

            <p className="mt-3 flex items-start gap-2.5 text-[0.74rem] leading-relaxed text-cream/35">
              <span className="mt-0.5 shrink-0 text-gold/70">
                <Route size={14} />
              </span>
              Frete calculado pelo CEP no passo seguinte.
            </p>

            <Link
              href="/checkout"
              onClick={drawer.close}
              className="group mt-6 flex items-center justify-center gap-3 border border-gold bg-gold/10 px-6 py-4 text-[0.74rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-500 hover:bg-gold/20"
            >
              Finalizar pedido
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>,
    host,
  );
}
