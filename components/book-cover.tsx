import { Crown, HelixMark, Seal } from "@/components/icons";
import type { Book } from "@/lib/books";

/* As capas deixam de ser objetos escuros e lacados: agora são papel.
   Cada coleção tem seu tom, os três dentro da paleta. */
const tones: Record<Book["cover"]["tone"], { fundo: string; tinta: string; fio: string }> = {
  navy: {
    fundo: "linear-gradient(168deg,#003249 0%,#012238 60%,#011638 100%)",
    tinta: "text-almond",
    fio: "rgb(198 172 143 / .3)",
  },
  deep: {
    fundo: "linear-gradient(168deg,#8f9cc0 0%,#7f8cb5 55%,#6a769c 100%)",
    tinta: "text-ink",
    fio: "rgb(1 22 56 / .22)",
  },
  soft: {
    fundo: "linear-gradient(168deg,#d3bda2 0%,#c6ac8f 55%,#b2977a 100%)",
    tinta: "text-ink",
    fio: "rgb(1 22 56 / .22)",
  },
};

function Ornament({ kind }: { kind: Book["cover"]["ornament"] }) {
  if (kind === "helix") return <HelixMark size="100%" />;
  if (kind === "crown") return <Crown size="100%" />;
  if (kind === "seal") return <Seal size="100%" />;
  return (
    <svg
      viewBox="0 0 34 12"
      width="100%"
      fill="none"
      aria-hidden="true"
      className="translate-y-[35%]"
    >
      <path d="M0 6h11M23 6h11" stroke="currentColor" strokeWidth={1} />
      <path
        d="M17 1.6 18.9 5l3.4.9-3.4.9L17 10.4 15.1 6.8 11.7 5.9l3.4-.9z"
        stroke="currentColor"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Capa gerada em CSS/SVG — still-life do objeto, nunca foto de banco.
 * Lombada à esquerda e miolo de papel à direita dão volume real.
 *
 * Toda a tipografia é medida em `cqw` (largura do próprio contêiner), então a
 * mesma capa funciona no grid do acervo, na página do livro e na miniatura de
 * 76px da sacola, sem variante nem ajuste manual.
 */
export function BookCover({
  book,
  className = "",
}: {
  book: Book;
  className?: string;
}) {
  const tom = tones[book.cover.tone];

  return (
    <div
      className={`relative aspect-[2/3] w-full select-none @container ${className}`}
      style={{ filter: "drop-shadow(var(--shadow-book))" }}
    >
      <div
        className="grain absolute inset-0 overflow-hidden rounded-[2px]"
        style={{ background: tom.fundo }}
      >
        {/* miolo: as folhas aparecem como uma faixa estreita na borda direita */}
        <div
          className="absolute inset-y-[1.5%] right-0 w-[2.2%]"
          style={{
            background:
              "repeating-linear-gradient(to right,#eae0d5 0px,#eae0d5 1px,#c3b6a6 1px,#c3b6a6 2px)",
            boxShadow: "inset 4px 0 6px -3px rgb(1 22 56 / .55)",
          }}
        />
        {/* lombada */}
        <div
          className="absolute inset-y-0 left-0 w-[7%]"
          style={{
            background:
              "linear-gradient(to right,rgb(1 22 56 / .3) 0%,rgb(1 22 56 / .1) 45%,transparent 100%)",
          }}
        />

        {/* luz rasante vinda do alto à esquerda */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(122deg,rgb(255 255 255 / .16) 0%,transparent 40%)",
          }}
        />

        {/* moldura: um fio só, sem metal e sem gravação */}
        <div
          className="absolute inset-[8%] left-[12%]"
          style={{ border: `1px solid ${tom.fio}` }}
        />

        <div className="relative flex h-full flex-col items-center justify-between py-[13cqw] pr-[13cqw] pl-[20cqw] text-center">
          <span className={`block w-[12cqw] opacity-70 ${tom.tinta}`}>
            <Ornament kind={book.cover.ornament} />
          </span>

          <div className="flex flex-col gap-[0.55em]">
            <h3 className={`font-serif text-[8.6cqw] leading-[1.12] font-light ${tom.tinta}`}>
              {book.title}
            </h3>
            <span className={`font-serif text-[3.9cqw] italic opacity-65 ${tom.tinta}`}>
              {book.author}
            </span>
          </div>

          <span className={`font-serif text-[3.4cqw] italic opacity-45 ${tom.tinta}`}>
            {book.origem === "assessoria"
              ? `coleção ${book.collection}`
              : book.serie
                ? `série ${book.serie}`
                : book.formato === "devocional"
                  ? "devocional"
                  : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
