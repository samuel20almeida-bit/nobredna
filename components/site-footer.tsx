import Link from "next/link";
import { HelixMark } from "@/components/icons";
import { DivisorPerola } from "@/components/perola";
import { collections } from "@/lib/books";

const catalogo = [
  { href: "/#servicos", label: "O que a casa faz" },
  { href: "/#acervo", label: "Livros feitos aqui" },
  { href: "/#testemunhos", label: "Quem passou por aqui" },
];

const casa = [
  { href: "/publique", label: "Envie seu original" },
  { href: "/#assine", label: "Carta mensal" },
  { href: "mailto:contato@nobredna.com.br", label: "contato@nobredna.com.br" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-almond/15 bg-ink">
      <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 text-lavender">
              <HelixMark size={24} />
              <span className="font-serif text-[1.2rem] text-almond">
                Nobre DNA
              </span>
            </Link>
            <p className="mt-6 max-w-[24rem] text-sm leading-[1.8] text-almond/50">
              Assessoria editorial dedicada a livros sobre origem,
              continuidade e legado. Rua Bela Cintra, 1200 — Consolação,
              São Paulo.
            </p>
          </div>

          <nav aria-label="A assessoria">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              A assessoria
            </h4>
            <ul className="mt-5 space-y-3">
              {catalogo.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-almond/55 transition-colors duration-500 hover:text-almond"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Coleções">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Linhas
            </h4>
            <ul className="mt-5 space-y-3">
              {collections.map((c) => (
                <li key={c.name}>
                  <Link
                    href="/#colecoes"
                    className="text-sm text-almond/55 transition-colors duration-500 hover:text-almond"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="A casa">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              A casa
            </h4>
            <ul className="mt-5 space-y-3">
              {casa.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-almond/55 transition-colors duration-500 hover:text-almond"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* o ornamento da base do logo, no lugar onde ele nasceu */}
        <DivisorPerola tone="dark" className="mt-16" width="min(18rem,50%)" />

        <div className="mt-10 flex flex-col gap-4 border-t border-almond/12 pt-8 text-[0.7rem] text-almond/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nobre DNA Assessoria Editorial · CNPJ 00.000.000/0001-00</p>
          <p>Os livros à venda são de seus autores · Pagamentos por Mercado Pago</p>
        </div>
      </div>
    </footer>
  );
}
