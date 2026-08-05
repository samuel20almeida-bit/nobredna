"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bag, Close, HelixMark, Menu } from "@/components/icons";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/#acervo", label: "Acervo" },
  { href: "/#colecoes", label: "Coleções" },
  { href: "/publique", label: "Publique seu livro" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, ready, setDrawerOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700 ${
        scrolled
          ? "border-b border-gold/12 bg-navy/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-gold transition-opacity duration-500 hover:opacity-80"
        >
          <HelixMark size={22} />
          <span
            className="text-[0.7rem] text-cream"
            style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
          >
            Nobre DNA
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.72rem] tracking-[0.22em] uppercase text-cream/60 transition-colors duration-500 hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Abrir a sacola${ready && count ? ` — ${count} item(ns)` : ""}`}
            className="relative flex items-center gap-2 text-gold transition-opacity duration-500 hover:opacity-80"
          >
            <Bag size={20} />
            {ready && count > 0 && (
              <span className="text-[0.7rem] tabular-nums text-cream/75">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="text-gold md:hidden"
          >
            {menuOpen ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gold/12 bg-navy/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-gold/10 py-4 text-[0.78rem] tracking-[0.22em] uppercase text-cream/70 last:border-none"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
