import Link from "next/link";
import { BrandSeal } from "@/components/brand-seal";
import { DivisorPerola } from "@/components/perola";
import { institucional } from "@/lib/institucional";

const leitura = [
  { href: "/livros", label: "Todos os livros" },
  { href: "/sobre", label: "Sobre a autora" },
  { href: "/checkout", label: "Minha sacola" },
  { href: "/trocas", label: "Trocas e devoluções" },
  { href: "/#assine", label: "Acompanhe a Casa" },
];

const assessoria = [
  { href: "/publique", label: "Envie seu original" },
  { href: "/coautorias", label: "Coautorias" },
  { href: "/links", label: "Links da Casa" },
  { href: "/#acervo", label: "Livros feitos aqui" },
];

const grupos = [
  { titulo: "Para ler", items: leitura },
  { titulo: "Projetos", items: [{label:"Obras autorais",href:"/livros"},{label:"Coautorias",href:"/coautorias"},{label:"Projetos editoriais",href:"/publique"}] },
  { titulo: "Para publicar", items: assessoria },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-almond/15 bg-ink">
      <div className="mx-auto max-w-[1240px] px-6 py-12 md:py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-14">
          <div>
            <Link href="/" className="flex items-center gap-3 text-lavender">
              <BrandSeal size={54} />
              <span className="font-serif text-[1.2rem] text-almond">
                NobreDNA
              </span>
            </Link>
            <p className="mt-6 max-w-[24rem] text-sm leading-[1.8] text-almond/80">
              NobreDNA · Casa de Legados. Histórias reais em livros memoráveis.
            </p>
            <address className="mt-5 space-y-2 text-sm leading-relaxed not-italic text-almond/80">
              <p>CNPJ: {institucional.cnpj}</p>
              <p>{institucional.endereco}<br/>{institucional.cidade} · CEP {institucional.cep}</p>
              <a href={`mailto:${institucional.email}`} className="block break-words text-khaki underline underline-offset-4">{institucional.email}</a>
              <a href={`tel:${institucional.telefoneE164}`} className="block text-khaki underline underline-offset-4">{institucional.telefone}</a>
            </address>
            <a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="mt-5 inline-block text-khaki underline">@nobre_dna</a>
          </div>

          <div className="md:hidden">
            {grupos.map(grupo => <details key={grupo.titulo} className="group border-t border-almond/20">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-serif text-xl italic text-khaki [&::-webkit-details-marker]:hidden">{grupo.titulo}<span aria-hidden="true" className="text-xl not-italic group-open:rotate-45">+</span></summary>
              <ul className="pb-3">{grupo.items.map(item => <li key={item.label}><Link href={item.href} className="flex min-h-11 items-center text-sm text-almond/85">{item.label}</Link></li>)}</ul>
            </details>)}
          </div>
          <nav aria-label="Para ler" className="hidden md:block">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Para ler
            </h4>
            <ul className="mt-5 space-y-3">
              {leitura.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-almond/80 transition-colors duration-500 hover:text-almond"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Projetos" className="hidden md:block">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Projetos
            </h4>
            <ul className="mt-5 space-y-3">
              {[{name:"Obras autorais",href:"/livros"},{name:"Coautorias",href:"/coautorias"},{name:"Projetos editoriais",href:"/publique"}].map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="text-sm text-almond/80 transition-colors duration-500 hover:text-almond"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Para publicar" className="hidden md:block">
            <h4 className="font-serif text-[1rem] italic text-lavender">
              Para publicar
            </h4>
            <ul className="mt-5 space-y-3">
              {assessoria.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-almond/80 transition-colors duration-500 hover:text-almond"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* o ornamento da base do logo, no lugar onde ele nasceu */}
        <DivisorPerola tone="dark" className="mt-8 md:mt-16" width="min(18rem,50%)" />

        <div className="mt-10 flex flex-col gap-4 border-t border-almond/12 pt-8 text-[0.8rem] text-almond/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NobreDNA Editorial · Curitiba</p>
          <p>Versão de apresentação · catálogo e pagamentos em validação</p>
        </div>
      </div>
    </footer>
  );
}
