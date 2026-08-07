import Link from "next/link";
import { Escudo, Retorno, Route } from "@/components/icons";
import { garantias } from "@/lib/politicas";

const icones = [Retorno, Escudo, Route];

/**
 * As garantias, ao lado do botão de compra.
 *
 * Ficam aqui e não numa página distante porque a dúvida que trava a compra
 * — "e se não for o que eu espero?" — acontece no instante do clique. Levar
 * a resposta para outro lugar é perder quem já estava com a mão no botão.
 *
 * O link para o texto completo existe para quem quer conferir a letra miúda;
 * as três linhas acima bastam para quem só precisava saber que ela existe.
 */
export function Garantias({ className = "" }: { className?: string }) {
  return (
    <div className={`hairline border-t pt-7 ${className}`}>
      <ul className="space-y-5">
        {garantias.map((g, i) => {
          const Icon = icones[i];
          return (
            <li key={g.id} className="flex gap-4">
              <span className="mt-0.5 shrink-0 text-khaki-ink" aria-hidden="true">
                <Icon size={19} />
              </span>
              <div>
                <p className="font-serif text-[1.08rem] text-ink">{g.titulo}</p>
                <p className="mt-1 text-[0.9rem] leading-[1.75] text-ink/55">
                  {g.texto}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <Link
        href="/trocas"
        className="mt-6 inline-block font-serif text-[1rem] text-lavender-ink italic underline decoration-lavender-ink/30 underline-offset-4 transition-colors duration-500 hover:text-ink"
      >
        ler a política completa
      </Link>
    </div>
  );
}
