import { Estrela } from "@/components/icons";
import type { AvaliacaoLeitoras } from "@/lib/books";

/**
 * A nota das leitoras, em estrelas.
 *
 * As cinco estrelas cheias ficam sob um recorte de largura proporcional à
 * nota, por cima das cinco vazadas — assim 4,6 desenha meia estrela de
 * verdade, em vez de arredondar para 5 e prometer mais do que as leitoras
 * disseram.
 *
 * O componente é o único lugar do site que sabe traduzir nota em desenho, e
 * ele não decide se deve aparecer: quem chama é que checa se há avaliação.
 * Um livro sem leitora avaliando não mostra estrela nenhuma.
 */
export function Estrelas({
  nota,
  size = 15,
  className = "",
}: {
  nota: number;
  size?: number;
  className?: string;
}) {
  const proporcao = (Math.max(0, Math.min(5, nota)) / 5) * 100;

  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      aria-hidden="true"
    >
      <span className="flex gap-1 text-khaki/30">
        {Array.from({ length: 5 }, (_, i) => (
          <Estrela key={i} size={size} />
        ))}
      </span>

      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${proporcao}%` }}
      >
        <span className="flex w-max gap-1 text-khaki">
          {Array.from({ length: 5 }, (_, i) => (
            <Estrela key={i} size={size} preenchida />
          ))}
        </span>
      </span>
    </span>
  );
}

/** Estrelas + a conta por extenso, que é o que dá credibilidade à nota. */
export function NotaLeitoras({
  avaliacao,
  size = 15,
  className = "",
}: {
  avaliacao: AvaliacaoLeitoras;
  size?: number;
  className?: string;
}) {
  const media = avaliacao.media.toFixed(1).replace(".", ",");
  const plural = avaliacao.total === 1 ? "avaliação" : "avaliações";

  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <Estrelas nota={avaliacao.media} size={size} />
      <span className="font-serif text-[1rem] text-ink/55">
        {media} · {avaliacao.total} {plural} de leitoras
      </span>
    </p>
  );
}
