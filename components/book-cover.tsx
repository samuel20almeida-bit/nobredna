import { Crown, HelixMark, Seal } from "@/components/icons";
import type { Book } from "@/lib/books";

const tones: Record<Book["cover"]["tone"], string> = {
  navy: "linear-gradient(168deg,#18243a 0%,#101a2c 52%,#0b1223 100%)",
  deep: "linear-gradient(168deg,#101a2c 0%,#0a1220 55%,#070c16 100%)",
  soft: "linear-gradient(168deg,#212f49 0%,#18243a 58%,#101a2c 100%)",
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
  return (
    <div
      className={`relative aspect-[2/3] w-full select-none @container ${className}`}
      style={{ filter: "drop-shadow(var(--shadow-book))" }}
    >
      <div
        className="grain absolute inset-0 overflow-hidden rounded-[3px]"
        style={{ background: tones[book.cover.tone] }}
      >
        {/* miolo: as folhas aparecem como uma faixa estreita na borda direita */}
        <div
          className="absolute inset-y-[1.5%] right-0 w-[2.2%]"
          style={{
            background:
              "repeating-linear-gradient(to right,#b6ac95 0px,#b6ac95 1px,#7d7460 1px,#7d7460 2px)",
            boxShadow: "inset 4px 0 6px -3px rgb(6 11 22 / .9)",
          }}
        />
        {/* lombada */}
        <div
          className="absolute inset-y-0 left-0 w-[7%]"
          style={{
            background:
              "linear-gradient(to right,rgb(6 11 22 / .85) 0%,rgb(6 11 22 / .35) 45%,transparent 100%)",
          }}
        />
        <div className="absolute inset-y-0 left-[7%] w-px bg-gold/20" />

        {/* luz rasante vinda do alto à esquerda */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(122deg,rgb(232 217 168 / .13) 0%,transparent 38%)",
          }}
        />

        {/* moldura gravada */}
        <div className="absolute inset-[7.5%] left-[12%] rounded-[1px] border border-gold/25" />

        <div className="relative flex h-full flex-col items-center justify-between py-[13cqw] pr-[13cqw] pl-[20cqw] text-center">
          <span className="block w-[13cqw] text-gold/85">
            <Ornament kind={book.cover.ornament} />
          </span>

          <div className="flex flex-col gap-[0.55em]">
            <h3 className="font-serif text-[8.4cqw] leading-[1.14] text-gold-light">
              {book.title}
            </h3>
            <span
              className="text-[3.1cqw] text-gold/70"
              style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              {book.author}
            </span>
          </div>

          <span
            className="text-[2.9cqw] text-gold/55"
            style={{ letterSpacing: "0.26em", textTransform: "uppercase" }}
          >
            Coleção {book.collection}
          </span>
        </div>
      </div>
    </div>
  );
}
