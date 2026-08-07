import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { BookPurchase } from "@/components/book-purchase";
import { HelixRail } from "@/components/helix-rail";
import { Anotacao } from "@/components/anotacao";
import { DivisorPerola } from "@/components/perola";
import { NotaLeitoras } from "@/components/estrelas";
import { Garantias } from "@/components/garantias";
import { DepoimentosLeitoras } from "@/components/depoimentos-leitoras";
import { ArrowLeft, Route } from "@/components/icons";
import { books, getBook, relatedBooks } from "@/lib/books";
import { AUTORA_CIDADE } from "@/lib/autora";
import { formatBRL } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Título não encontrado" };
  return {
    title: `${book.title} — ${book.author}`,
    description: book.line,
    openGraph: { title: book.title, description: book.line },
  };
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const relacionados = relatedBooks(slug);
  const daAutora = book.origem === "autora";

  const ficha = [
    { k: "Autoria", v: book.author },
    daAutora
      ? {
          k: "Formato",
          v: book.formato === "devocional" ? "Devocional" : "Leitura corrida",
        }
      : { k: "Coleção", v: book.collection },
    { k: "Publicação", v: String(book.year) },
    { k: "Páginas", v: String(book.pages) },
    { k: "Acabamento", v: book.binding },
    { k: "ISBN", v: book.isbn },
  ];

  return (
    <>
      {/* hélice fina na lateral: o mesmo fio do hero, em escala de leitura */}
      <HelixRail side="left" width={34} fadeIn={0.04} from={0.85} />

      <article className="relative z-10 bg-almond pt-32 pb-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <Link
            href={daAutora ? "/livros" : "/#acervo"}
            className="group inline-flex items-center gap-3 font-serif text-[1.05rem] italic text-ink/40 transition-colors duration-500 hover:text-ink"
          >
            <span className="transition-transform duration-500 group-hover:-translate-x-1">
              <ArrowLeft size={15} />
            </span>
            {daAutora ? "todos os livros" : "livros feitos aqui"}
          </Link>

          <div className="mt-12 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="mx-auto w-[min(74vw,330px)] lg:w-full">
                <BookCover book={book} />
              </div>
              <p className="mt-8 text-center text-[0.68rem] leading-relaxed text-ink/30 lg:text-left">
                {book.binding}
              </p>
            </div>

            <div>
              <p className="label">
                {daAutora
                  ? book.serie
                    ? `Série ${book.serie}`
                    : book.formato === "devocional"
                      ? "Devocional"
                      : "Livro"
                  : `Coleção ${book.collection}`}
              </p>
              <h1 className="mt-5 text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.08] text-balance text-ink">
                {book.title}
              </h1>
              <p className="mt-4 font-serif text-[1.25rem] text-ink/55 italic">
                {book.subtitle}
              </p>
              <p className="mt-6 font-serif text-[1rem] italic text-lavender-ink">
                {book.author}
              </p>

              {/* a nota vem antes do preço de propósito: quem decide comprar
                  quer saber o que acharam antes de saber quanto custa */}
              {book.origem === "autora" && book.avaliacao && (
                <NotaLeitoras avaliacao={book.avaliacao} className="mt-7" />
              )}

              <BookPurchase book={book} />

              {/* as garantias ficam coladas no botão, onde nasce a dúvida */}
              <Garantias className="mt-12 max-w-[34rem]" />

              <div className="mt-14 max-w-[38rem] space-y-6">
                {book.synopsis.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-[1.02rem] leading-[1.85] text-ink/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <blockquote className="mt-14 max-w-[34rem] border-l border-ink/40 pl-7">
                <p className="font-serif text-[clamp(1.2rem,2.4vw,1.7rem)] leading-[1.5] text-ink/90">
                  “{book.excerpt}”
                </p>
                <cite className="mt-4 block font-serif text-[1rem] not-italic text-ink/35">
                  Trecho · {book.title}
                </cite>
              </blockquote>

              {/* Um devocional não se decide pela sinopse: se decide lendo um
                  dia inteiro e vendo se a voz serve. A amostra é a vitrine. */}
              {book.origem === "autora" && book.amostra && (
                <section
                  aria-label="Leitura de amostra"
                  className="mt-16 max-w-[38rem] border border-ink/12 bg-almond-lift/70 px-7 py-9 sm:px-9"
                >
                  <p className="label">leia um dia antes de levar</p>
                  <h2 className="mt-4 font-serif text-[1.45rem] leading-snug font-light text-ink">
                    {book.amostra.titulo}
                  </h2>

                  {/* o versículo é riscado na margem quando entra em cena —
                      o gesto de quem marca a passagem do dia na própria
                      Bíblia, que é exatamente o que este bloco simula */}
                  <Anotacao marca="margem" className="mt-6">
                    <p className="font-serif text-[1.12rem] leading-[1.6] text-lavender-ink italic">
                      “{book.amostra.versiculo}”
                    </p>
                    <p className="mt-2 font-serif text-[1rem] text-khaki-ink italic">
                      {book.amostra.referencia}
                    </p>
                  </Anotacao>

                  <DivisorPerola
                    tone="light"
                    className="my-7"
                    width="min(12rem,60%)"
                  />

                  <p className="text-[1rem] leading-[1.9] text-ink/70">
                    {book.amostra.texto}
                  </p>
                </section>
              )}

              <dl className="mt-16 grid max-w-[38rem] grid-cols-1 gap-px border border-ink/12 bg-lavender/12 sm:grid-cols-2">
                {ficha.map((item) => (
                  <div key={item.k} className="bg-almond px-6 py-5">
                    <dt className="font-serif text-[1rem] italic text-ink/35">
                      {item.k}
                    </dt>
                    <dd className="mt-2 text-[0.92rem] leading-snug text-ink/80">
                      {item.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {book.origem === "autora" && (
                <DepoimentosLeitoras
                  depoimentos={book.depoimentos}
                  className="mt-20 max-w-[46rem]"
                />
              )}

              {/* o portfólio da casa vive aqui: o que foi feito neste título.
                  Só existe do lado da assessoria — na estante da autora não há
                  cliente a creditar, e a página não deve fingir que há. */}
              {book.origem === "assessoria" && (
                <div className="hairline mt-12 max-w-[38rem] border-t pt-8">
                  <p className="label">o que a casa fez neste livro</p>
                  <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                    {book.trabalho.map((etapa) => (
                      <li
                        key={etapa}
                        className="rounded-full bg-khaki/25 px-4 py-1.5 font-serif text-[1rem] text-ink/75"
                      >
                        {etapa}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 max-w-[34rem] text-[0.9rem] leading-[1.8] text-ink/50">
                    Os direitos e o ISBN são de {book.author}. A Nobre DNA
                    assinou o trabalho de mesa e cuida da venda deste exemplar
                    em nome do autor.
                  </p>
                </div>
              )}

              <p className="mt-8 flex items-start gap-3 text-[0.85rem] leading-relaxed text-ink/45">
                <span className="mt-0.5 shrink-0 text-lavender-ink">
                  <Route size={18} />
                </span>
                Expedição em até 2 dias úteis a partir de {AUTORA_CIDADE}. O frete é
                calculado pelo CEP no checkout, com as transportadoras do Melhor
                Envio.
              </p>
            </div>
          </div>

          <section className="mt-28 border-t border-ink/15 pt-14">
            <h2 className="text-[clamp(1.3rem,2.6vw,1.9rem)] text-ink">
              Da mesma linha
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
              {relacionados.map((related) => (
                <li key={related.slug}>
                  <Link href={`/livro/${related.slug}`} className="group block">
                    <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
                      <BookCover book={related} />
                    </div>
                    <h3 className="mt-5 text-[0.98rem] text-ink transition-colors duration-200 group-hover:text-ink">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-[0.78rem] text-ink/45">
                      {related.author}
                    </p>
                    <p className="mt-2 text-[0.82rem] tabular-nums text-lavender-ink">
                      {formatBRL(related.priceCents)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
