"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { books, getBook, type Book } from "@/lib/books";

export type CartLine = { slug: string; qty: number };
export type CartItem = { book: Book; qty: number };

type CartContext = {
  lines: CartLine[];
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** true depois de reidratar do localStorage — evita divergência de SSR */
  ready: boolean;
  lastAdded: string | null;
};

const Ctx = createContext<CartContext | null>(null);
const STORAGE_KEY = "nobre-dna:sacola";

function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const known = new Set(books.map((b) => b.slug));
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { slug, qty } = entry as Partial<CartLine>;
    if (typeof slug !== "string" || !known.has(slug)) return [];
    const n = Math.min(12, Math.max(1, Math.floor(Number(qty) || 1)));
    return [{ slug, qty: n }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(sanitize(JSON.parse(raw)));
    } catch {
      // storage indisponível (modo privado) — a sacola só não persiste
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignora falha de escrita
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: Math.min(12, l.qty + qty) } : l,
        );
      }
      return [...prev, { slug, qty }];
    });
    setLastAdded(slug);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) =>
            l.slug === slug ? { ...l, qty: Math.min(12, qty) } : l,
          ),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContext>(() => {
    const items = lines.flatMap((line) => {
      const book = getBook(line.slug);
      return book ? [{ book, qty: line.qty }] : [];
    });
    return {
      lines,
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotalCents: items.reduce(
        (sum, i) => sum + i.book.priceCents * i.qty,
        0,
      ),
      add,
      setQty,
      remove,
      clear,
      ready,
      lastAdded,
    };
  }, [lines, add, setQty, remove, clear, ready, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
