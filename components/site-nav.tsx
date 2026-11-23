"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bag, Close, Menu, Spines, Quill, Seal } from "@/components/icons";
import { BrandSeal } from "@/components/brand-seal";
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
  { href: "/coautorias", label: "Coautorias", fio: "bg-lavender-ink" },
  { href: "/sobre", label: "Sobre", fio: "bg-ink/40" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, ready } = useCart();

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
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <><header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700 ${
        scrolled
          ? "hairline border-b bg-almond/85 backdrop-blur-md"
          : invertida ? "border-b border-almond/15 bg-vinho" : "border-b border-ink/10 bg-almond/95"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:h-[72px] md:px-6 lg:px-10">
        <Link
          href="/"
          className={`flex items-center gap-3 transition-opacity duration-500 hover:opacity-70 ${invertida ? "text-khaki" : "text-lavender-ink"}`}
        >
          <BrandSeal size={44} />
          <span
            className={`font-serif text-[1.15rem] transition-colors duration-500 ${invertida ? "text-almond" : "text-ink"}`}
          >
            NobreDNA<span className={`block font-sans text-[0.58rem] uppercase tracking-[0.16em] ${invertida ? "text-khaki" : "text-khaki-ink"}`}>Casa de Legados</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex lg:gap-9">
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

        <div className="flex items-center gap-1 md:gap-5">
          <Link href="/publique" className={`hidden min-h-11 items-center px-4 text-sm font-medium lg:inline-flex ${invertida ? "bg-almond text-vinho" : "bg-vinho text-almond"}`}>Quero publicar</Link>
          <Link
            href="/checkout"
            aria-label="Conhecer a experiência de compra demonstrativa"
            className={`relative flex min-h-11 min-w-11 items-center justify-center gap-1 transition-opacity duration-500 hover:opacity-70 ${invertida ? "text-khaki" : "text-lavender-ink"}`}
          >
            <Bag size={20} />
            {ready && count > 0 && (
              <span
                className={`font-serif text-[0.95rem] tabular-nums ${invertida ? "text-almond/80" : "text-ink/70"}`}
              >
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`grid min-h-11 min-w-11 place-items-center md:hidden ${invertida ? "text-khaki" : "text-lavender-ink"}`}
          >
            {menuOpen ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
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
                  onClick={() => setMenuOpen(false)}
                  className="hairline border-b py-4 font-serif text-[1.15rem] text-ink/70 last:border-none"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/publique" onClick={() => setMenuOpen(false)} className="mt-4 min-h-12 bg-vinho px-5 py-3 text-center text-almond">Quero publicar minha história</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <nav aria-label="Navegação rápida" className="mobile-dock fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-khaki-ink/25 bg-almond/95 backdrop-blur-md md:hidden">
      {[
        { href: "/", label: "Início", icon: <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10"/></svg> },
        { href: "/livros", label: "Livros", icon: <Spines size={24}/> },
        { href: "/publique", label: "Publicar", icon: <Quill size={24}/> },
        { href: "/sobre", label: "Sobre", icon: <Seal size={24}/> },
      ].map(item => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${active ? "bg-vinho/5 text-vinho" : "text-ink/70"}`}>
          {active && <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 bg-vinho"/>}{item.icon}{item.label}
        </Link>;
      })}
    </nav></>
  );
}
