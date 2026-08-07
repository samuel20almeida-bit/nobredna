import { Estrelas } from "@/components/estrelas";
import type { DepoimentoLeitora } from "@/lib/books";

/**
 * O que leitoras disseram deste livro.
 *
 * É prova social de venda, e por isso é diferente dos testemunhos da home:
 * lá são autores falando do trabalho de mesa, para quem pensa em contratar a
 * assessoria. Aqui é leitora falando do livro, para quem pensa em comprá-lo.
 * A trilha da loja não tinha nenhuma prova social antes disto.
 *
 * Sem depoimento, o componente não renderiza nada — bloco vazio com título
 * "o que dizem" é pior que silêncio.
 */
export function DepoimentosLeitoras({
  depoimentos,
  className = "",
}: {
  depoimentos?: DepoimentoLeitora[];
  className?: string;
}) {
  if (!depoimentos?.length) return null;

  return (
    <section className={className} aria-label="Depoimentos de leitoras">
      <p className="label">quem já leu</p>

      <ul className="mt-8 grid gap-x-10 gap-y-9 md:grid-cols-2">
        {depoimentos.map((d) => (
          <li key={d.nome} className="hairline border-t pt-6">
            {d.nota !== undefined && (
              <Estrelas nota={d.nota} size={14} className="mb-4" />
            )}

            <blockquote className="font-serif text-[1.2rem] leading-[1.6] text-ink/75 italic">
              “{d.texto}”
            </blockquote>

            <p className="mt-4 text-[0.85rem] text-ink/45">
              {d.nome}
              {d.cidade ? ` · ${d.cidade}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
