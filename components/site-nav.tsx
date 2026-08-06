"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bag, Close, HelixMark, Menu } from "@/components/icons";
import { useCart } from "@/lib/cart";

/* Uma entrada por porta, mais a página que costura as duas. A ordem é a da
   home: primeiro o que se compra, depois o que se contrata. */
/**
 * Rotas cujo topo é escuro.
 *
 * A nav é transparente antes de rolar, então ela empresta o fundo do hero. Com
 * a /livros em vinho, a tinta escura do logo e dos links praticamente sumia —
 * o preço de dar um chão profundo à trilha da leitora. Aqui a nav inverte para
 * o creme enquanto está no topo dessas rotas; assim que rola, ela ganha o
 * próprio fundo claro e volta ao normal.
 */
const topoEscuro = ["/livros"];

/**
 * Cada link carrega a cor da sua trilha, e o link ativo a exibe.
 *
 * Antes a nav não marcava a página atual de forma nenhuma: em /livros e em
 * /publique ela ficava idêntica, e era um dos motivos de não se saber em que
 * lado do site se estava. Agora o item ativo ganha um fio embaixo na cor do
 * seu chão — khaki para a loja, lavanda para a assessoria.
 */
const links = [
  { href: "/livros", label: "Livros", fio: "bg-khaki-ink" },
  { href: "/publique", label: "Publicar", fio: "bg-lavender-ink" },
  { href: "/sobre", label: "Sobre", fio: "bg-ink/40" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, ready, setDrawerOpen } = useCart();

  // no topo de uma rota de hero escuro, a nav transparente precisa de tinta clara
  const invertida =
    !scrolled && topoEscuro.some((r) => pathname.startsWith(r));

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
          ? "hairline border-b bg-almond/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className={`flex items-center gap-3 transition-opacity duration-500 hover:opacity-70 ${invertida ? "text-khaki" : "text-lavender-ink"}`}
        >
          <HelixMark size={22} />
          <span
            className={`font-serif text-[1.15rem] transition-colors duration-500 ${invertida ? "text-almond" : "text-ink"}`}
          >
            Nobre DNA
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => {
            const ativo = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={ativo ? "page" : undefined}
                className={`relative font-serif text-[1.08rem] transition-colors duration-500 ${
                  invertida
                    ? ativo
                      ? "text-almond hover:text-almond"
                      : "text-almond/60 hover:text-almond"
                    : ativo
                      ? "text-ink hover:text-ink"
                      : "text-ink/60 hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-500 ${invertida ? "bg-khaki" : link.fio} ${
                    ativo ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Abrir a sacola${ready && count ? ` — ${count} item(ns)` : ""}`}
            className={`tap relative flex items-center gap-2 transition-opacity duration-500 hover:opacity-70 ${invertida ? "text-khaki" : "text-lavender-ink"}`}
          >
            <Bag size={20} />
            {ready && count > 0 && (
              <span
                className={`font-serif text-[0.95rem] tabular-nums ${invertida ? "text-almond/80" : "text-ink/70"}`}
              >
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className={`tap md:hidden ${invertida ? "text-khaki" : "text-lavender-ink"}`}
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
            className="hairline overflow-hidden border-t bg-almond/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hairline border-b py-4 font-serif text-[1.15rem] text-ink/70 last:border-none"
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
