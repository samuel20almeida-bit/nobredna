"use client";

import { useState } from "react";
import { Bag, Minus, Plus } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/format";
import type { Book } from "@/lib/books";

export function BookPurchase({ book }: { book: Book }) {
  const { add, setDrawerOpen } = useCart();
  const [qty, setQty] = useState(1);

  function onAdd() {
    add(book.slug, qty);
    // o painel lateral é a confirmação: mostra a sacola inteira, não um aviso
    setDrawerOpen(true);
  }

  return (
    <div className="mt-10 border-t border-ink/15 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.6rem] font-serif italic text-ink/35">
            Preço
          </p>
          <p className="mt-2 font-serif text-[2rem] tabular-nums">
            {formatBRL(book.priceCents)}
          </p>
          <p className="mt-1 text-[0.78rem] text-ink/40">
            em até 6x sem juros · frete calculado no checkout
          </p>
        </div>

        <div className="flex items-center gap-1 border border-ink/25">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Diminuir quantidade"
            className="grid h-11 w-11 place-items-center text-lavender-ink transition-colors duration-300 hover:bg-lavender/10 disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-[0.95rem] tabular-nums text-ink">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(12, q + 1))}
            disabled={qty >= 12}
            aria-label="Aumentar quantidade"
            className="grid h-11 w-11 place-items-center text-lavender-ink transition-colors duration-300 hover:bg-lavender/10 disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-serif text-[1.1rem] text-almond transition-colors duration-500 hover:bg-ink-soft"
      >
        <Bag size={17} />
        Levar este exemplar
      </button>
    </div>
  );
}
