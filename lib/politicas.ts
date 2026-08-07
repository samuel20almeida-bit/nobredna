/**
 * Troca, devolução e prazos.
 *
 * O prazo de sete dias não é cortesia da casa: é o direito de arrependimento
 * do artigo 49 do Código de Defesa do Consumidor, que vale para toda compra
 * feita fora do estabelecimento — o site inclusive. Está escrito aqui como
 * direito, e não como concessão, porque prometer menos que a lei é ilegal e
 * prometer mais sem cumprir é pior.
 *
 * O texto vive num módulo só para que a página do livro, a de políticas e o
 * checkout digam exatamente a mesma coisa. Política de troca que muda de
 * palavra conforme a tela é a que ninguém acredita.
 */

export type Garantia = {
  id: string;
  titulo: string;
  texto: string;
};

/** As três linhas curtas que aparecem junto ao botão de compra. */
export const garantias: Garantia[] = [
  {
    id: "arrependimento",
    titulo: "Sete dias para desistir",
    texto:
      "Recebeu e não era o que esperava? Devolve em até sete dias corridos, sem precisar justificar, e o valor volta integral — frete incluído.",
  },
  {
    id: "defeito",
    titulo: "Exemplar com defeito, troca na hora",
    texto:
      "Página solta, corte torto, capa marcada no transporte: manda uma foto e a casa despacha outro exemplar, sem custo e sem devolver o primeiro.",
  },
  {
    id: "despacho",
    titulo: "Despacho em dois dias úteis",
    texto:
      "O pedido sai daqui em até dois dias úteis, com código de rastreio por e-mail. O prazo dos Correios aparece no checkout, antes de pagar.",
  },
];

/** O texto longo, para a página de políticas. */
export const politicaTroca = {
  titulo: "Troca e devolução",
  chamada:
    "Comprar um livro pela internet é comprar sem folhear. Por isso a lei dá sete dias para você mudar de ideia, e esta casa não cria nenhum obstáculo para você usá-los.",
  blocos: [
    {
      titulo: "Arrependimento — sete dias",
      itens: [
        "O prazo é de sete dias corridos contados do recebimento, conforme o artigo 49 do Código de Defesa do Consumidor.",
        "Não é preciso dar motivo. Basta escrever para contato@nobredna.com.br com o número do pedido.",
        "A devolução do valor é integral e inclui o frete que você pagou. O frete do retorno é por conta da casa.",
        "O reembolso sai pelo mesmo meio do pagamento em até dez dias úteis depois que o exemplar chegar de volta.",
      ],
    },
    {
      titulo: "Defeito ou avaria no transporte",
      itens: [
        "Se o exemplar chegar danificado, mande uma foto por e-mail em até trinta dias. A casa despacha outro sem custo.",
        "Nesse caso você não precisa devolver o exemplar com defeito — fique com ele, dê de presente, use como rascunho.",
        "Vale também para defeito de fabricação percebido depois: encadernação que solta, caderno faltando, impressão falha.",
      ],
    },
    {
      titulo: "Como devolver",
      itens: [
        "Escreva para contato@nobredna.com.br com o número do pedido e o motivo, se quiser dizer.",
        "A casa responde com uma etiqueta de postagem paga. É só levar à agência dos Correios.",
        "O livro precisa voltar em condição de leitura — pode ter sido lido, não pode ter sido rasgado ou molhado.",
      ],
    },
  ],
};
