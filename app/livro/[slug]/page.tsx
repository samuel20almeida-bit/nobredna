import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { BookPurchase } from "@/components/book-purchase";
import { HelixRail } from "@/components/helix-rail";
import { ArrowLeft, Route } from "@/components/icons";
import { books, getBook, relatedBooks } from "@/lib/books";
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

  const ficha = [
    { k: "Autoria", v: book.author },
    { k: "Coleção", v: book.collection },
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
            href="/#acervo"
            className="group inline-flex items-center gap-3 font-serif text-[1rem] italic text-ink/40 transition-colors duration-500 hover:text-ink"
          >
            <span className="transition-transform duration-500 group-hover:-translate-x-1">
              <ArrowLeft size={15} />
            </span>
            Acervo
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
              <p className="label">Coleção {book.collection}</p>
              <h1 className="mt-5 text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.08] text-balance text-ink">
                {book.title}
              </h1>
              <p className="mt-4 font-serif text-[1.25rem] text-ink/55 italic">
                {book.subtitle}
              </p>
              <p className="mt-6 font-serif text-[1rem] italic text-lavender-ink">
                {book.author}
              </p>

              <BookPurchase book={book} />

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
                <cite className="mt-4 block text-[0.7rem] font-serif italic not-italic text-ink/35">
                  Trecho · {book.title}
                </cite>
              </blockquote>

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

              <p className="mt-8 flex items-start gap-3 text-[0.85rem] leading-relaxed text-ink/45">
                <span className="mt-0.5 shrink-0 text-lavender-ink">
                  <Route size={18} />
                </span>
                Expedição em até 2 dias úteis a partir de São Paulo. O frete é
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
