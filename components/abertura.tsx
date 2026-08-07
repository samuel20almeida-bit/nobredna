import { HelixMark } from "@/components/icons";

/**
 * A capa que se abre quando o site carrega.
 *
 * Mesmo gesto do lacre da página /publique: duas faces com dobradiça no centro.
 * Aqui a superfície é a própria janela — o visitante entra pelo livro.
 *
 * Sem `"use client"` e sem estado: o movimento inteiro está em globals.css, e o
 * elemento sai de cena por `visibility: hidden` no fim da animação. Ver o
 * comentário lá para o porquê de não ser JS.
 */
export function Abertura() {
  return (
    <div className="abertura" aria-hidden="true">
      <div className="abertura-face abertura-esq" />
      <div className="abertura-face abertura-dir" />
      <span className="abertura-marca">
        <HelixMark size={34} />
        <span className="abertura-nome">
          Nobre
          <br />
          DNA
        </span>
        <span className="abertura-linha">Casa editorial</span>
      </span>
    </div>
  );
}
