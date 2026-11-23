import Link from "next/link";
import { HelixMark } from "@/components/icons";
import { DivisorPerola } from "@/components/perola";
import { autora } from "@/lib/autora";

const leitura = [
  { href: "/livros", label: "Todos os livros" },
  { href: "/sobre", label: "Sobre a autora" },
  { href: "/checkout", label: "Prévia da loja" },
  { href: "/#assine", label: "Acompanhe a Casa" },
];

const assessoria = [
  { href: "/publique", label: "Envie seu original" },
  { href: "/coautorias", label: "Coautorias" },
  { href: "/links", label: "Links da Casa" },
  { href: "/#acervo", label: "Livros feitos aqui" },
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
                NobreDNA
              </span>
            </Link>
            <p className="mt-6 max-w-[24rem] text-sm leading-[1.8] text-almond/50">
              {/* o logradouro que estava aqui era inventado, e endereço de rua
                  fictício é pior que cidade fictícia: pode ser o de alguém.
                  Fica só a cidade até haver um endereço real para publicar. */}
              NobreDNA · Casa de Legados. Histórias reais em livros memoráveis. {autora.cidade}.
            </p>
            <a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="mt-5 inline-block text-khaki underline">@nobre_dna</a>
          </div>

          <nav aria-label="Para ler">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Para ler
            </h4>
            <ul className="mt-5 space-y-3">
              {leitura.map((item) => (
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

          <nav aria-label="Projetos">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Projetos
            </h4>
            <ul className="mt-5 space-y-3">
              {[{name:"Obras autorais",href:"/livros"},{name:"Coautorias",href:"/coautorias"},{name:"Projetos editoriais",href:"/publique"}].map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="text-sm text-almond/55 transition-colors duration-500 hover:text-almond"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Para publicar">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Para publicar
            </h4>
            <ul className="mt-5 space-y-3">
              {assessoria.map((item) => (
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
          <p>© {new Date().getFullYear()} NobreDNA Editorial · Curitiba</p>
          <p>Versão de apresentação · catálogo e pagamentos em validação</p>
        </div>
      </div>
    </footer>
  );
}
