"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bag, Minus, Plus } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";
import type { Book } from "@/lib/books";

export function BookPurchase({ book }: { book: Book }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  function onAdd() {
    add(book.slug, qty);
    setAdicionado(true);
    window.setTimeout(() => setAdicionado(false), 4500);
  }

  return (
    <div className="mt-10 border-t border-gold/15 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.6rem] tracking-[0.28em] uppercase text-cream/35">
            Preço
          </p>
          <p className="mt-2 font-serif text-[2rem] tabular-nums text-gold-light">
            {formatBRL(book.priceCents)}
          </p>
          <p className="mt-1 text-[0.78rem] text-cream/40">
            em até 6x sem juros · frete calculado no checkout
          </p>
        </div>

        <div className="flex items-center gap-1 border border-gold/25">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Diminuir quantidade"
            className="px-3 py-3 text-gold transition-colors duration-300 hover:bg-gold/10 disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-[0.95rem] tabular-nums text-cream">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(12, q + 1))}
            disabled={qty >= 12}
            aria-label="Aumentar quantidade"
            className="px-3 py-3 text-gold transition-colors duration-300 hover:bg-gold/10 disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onAdd}
          className="group inline-flex items-center gap-3 border border-gold bg-gold/10 px-8 py-4 text-[0.78rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-400 hover:bg-gold/20"
        >
          <Bag size={17} />
          Levar este exemplar
        </button>

        <AnimatePresence>
          {adicionado && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span className="text-[0.8rem] text-cream/55">Na sacola.</span>
              <Link
                href="/checkout"
                className="group inline-flex items-center gap-2 text-[0.72rem] tracking-[0.2em] uppercase text-gold underline decoration-gold/30 underline-offset-[6px] transition-colors duration-300 hover:text-gold-light"
              >
                Finalizar
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
