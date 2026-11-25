"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bag, Close, Menu } from "@/components/icons";
import { BrandSeal } from "@/components/brand-seal";
import { useCart } from "@/lib/cart";
import { useConsultationCart } from "@/lib/consultation-cart";
import { useStoreCart } from "@/lib/store-cart";

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

function DockIcon({kind}:{kind:"home"|"books"|"publish"|"about"}) {
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {kind==="home" && <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.8v10.4h4.2v-6h4.6v6h4.2V9.8"/></>}
    {kind==="books" && <><path d="M12 6.5C9 4.5 5.7 4.5 3 5.3v13c3.4-1 6.6-.6 9 1.2 2.4-1.8 5.6-2.2 9-1.2v-13c-2.7-.8-6-.8-9 1.2Z"/><path d="M12 7v12.5"/></>}
    {kind==="publish" && <><path d="M5 19.5l2.1-6.7L17 3a2.3 2.3 0 0 1 3.2 3.2l-9.9 9.9L5 19.5Z"/><path d="m15.5 4.5 4 4M4 21h16"/></>}
    {kind==="about" && <><circle cx="12" cy="8" r="3.7"/><path d="M4.5 20v-1.1a7.5 7.5 0 0 1 15 0V20"/></>}
  </svg>;
}

const mobileTabs = [
  {href:"/",label:"Início",kind:"home",matches:["/"]},
  {href:"/livros",label:"Livros",kind:"books",matches:["/livros","/livro","/checkout","/trocas"]},
  {href:"/publique",label:"Publicar",kind:"publish",matches:["/publique","/coautorias"]},
  {href:"/sobre",label:"Sobre",kind:"about",matches:["/sobre"]},
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { count, ready } = useCart();
  const consultation = useConsultationCart();
  const store = useStoreCart();
  const cartCount = store.enabled ? store.count : consultation.count + count;
  const cartReady = store.enabled ? store.ready : ready && consultation.ready;

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
                      : "text-almond/85 hover:text-almond"
                    : ativo
                      ? "text-ink hover:text-ink"
                      : "text-ink/75 hover:text-ink"
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
          <Link href="/publique" className={`hidden min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors lg:inline-flex ${invertida ? "bg-almond text-vinho hover:bg-almond-deep" : "bg-vinho text-almond hover:bg-vinho-soft"}`}>Quero publicar</Link>
          <Link
            href="/checkout"
            aria-label={`Sua sacola, ${cartCount} exemplares`}
            className={`relative flex min-h-11 min-w-11 items-center justify-center gap-1 transition-opacity duration-500 hover:opacity-70 ${invertida ? "text-khaki" : "text-lavender-ink"}`}
          >
            <Bag size={20} />
            {cartReady && cartCount > 0 && (
              <span
                className={`font-serif text-[0.95rem] tabular-nums ${invertida ? "text-almond/80" : "text-ink/70"}`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`grid min-h-11 min-w-11 place-items-center rounded-xl border md:hidden ${invertida ? "border-almond/25 text-almond" : "border-khaki-ink/20 bg-almond-lift/60 text-vinho"}`}
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
            transition={{ duration: reduced?0:0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu-sheet overflow-hidden border-t border-khaki-ink/20 bg-almond md:hidden"
          >
            <div className="px-5 py-5">
              <p className="label mb-3">Explore a Casa</p>
              <div className="grid grid-cols-2 gap-2.5">
              {[{href:"/",label:"Início",detail:"Conheça a Casa"},{href:"/livros",label:"Livros",detail:"Explore o acervo"},{href:"/publique",label:"Publicar",detail:"Conte sua história"},{href:"/coautorias",label:"Coautorias",detail:"Escreva em conjunto"},{href:"/sobre",label:"Sobre",detail:"Conheça a Nanda"},{href:"/links",label:"Links da Casa",detail:"Encontre nossos canais"}].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname===link.href?"page":undefined}
                  className={`flex min-h-[74px] flex-col justify-center rounded-xl border px-4 py-3 ${pathname===link.href?"border-vinho/30 bg-vinho/5":"border-khaki-ink/20 bg-almond-lift"}`}
                >
                  <span className="font-serif text-xl leading-tight text-vinho">{link.label}</span><span className="mt-1 text-xs leading-snug text-ink/70">{link.detail}</span>
                </Link>
              ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <nav aria-label="Navegação rápida" className="mobile-dock fixed z-40 grid grid-cols-4 md:hidden">
      {mobileTabs.map(item => {
        const active = item.matches.some(route => route==="/"?pathname==="/":pathname===route||pathname.startsWith(route+"/"));
        return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? (pathname===item.href?"page":"location") : undefined} data-active={active} className="mobile-dock-tab">
          <span className="mobile-dock-icon"><DockIcon kind={item.kind}/></span><span>{item.label}</span>
        </Link>;
      })}
    </nav></>
  );
}
