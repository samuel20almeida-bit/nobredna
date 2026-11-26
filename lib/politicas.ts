import { institucional } from "./institucional.ts";

export type Garantia = {
  id: string;
  titulo: string;
  texto: string;
};

/** Resumo da política oficial, sem promessas comerciais não confirmadas. */
export const garantias: Garantia[] = [
  {
    id: "arrependimento",
    titulo: "Sete dias para desistir",
    texto: "Você pode desistir em até sete dias corridos após receber o livro. A devolução é gratuita e a restituição inclui o frete.",
  },
  {
    id: "defeito",
    titulo: "Apoio em caso de defeito ou avaria",
    texto: "Se houver um problema com o exemplar, fale com a Casa. Cobrimos os custos de envio necessários para resolver o problema, conforme a política.",
  },
  {
    id: "despacho",
    titulo: "Entrega com condições informadas",
    texto: "O valor do frete e a previsão de entrega serão informados antes da confirmação da compra.",
  },
];

/** Política fornecida pela Casa de Legados. */
export const politicaTroca = {
  titulo: "Política de Trocas e Devoluções",
  chamada: "Esta política vale para os livros físicos comprados no site da Nobre DNA — Casa de Legados. Se você quiser cancelar uma compra ou se houver algum problema com seu pedido, entre em contato com a nossa equipe.",
  blocos: [
    {
      titulo: "1. Devolução por arrependimento",
      itens: [
        "Você pode desistir da compra em até 7 dias corridos a partir do recebimento do livro, sem precisar informar o motivo. Se o pedido ainda estiver a caminho, você já pode solicitar o cancelamento.",
        "A devolução é gratuita. Nossa equipe enviará as instruções de postagem e providenciará de imediato a restituição integral dos valores pagos pela compra cancelada, incluindo o frete de entrega. Se o pagamento foi feito por cartão, comunicaremos imediatamente o cancelamento à administradora. O lançamento do crédito na fatura segue o calendário da operadora.",
      ],
    },
    {
      titulo: "2. Livro com defeito ou avaria",
      itens: [
        "Se o livro chegar danificado ou apresentar problemas como páginas faltando, falhas de impressão ou encadernação solta, você pode registrar uma reclamação em até 90 dias a partir da entrega. Se o defeito só puder ser percebido mais tarde, o prazo começa quando o problema ficar evidente.",
        "Cobrimos os custos de envio necessários para resolver o problema. Se o defeito não for resolvido em até 30 dias, você poderá escolher entre a substituição por um exemplar equivalente em perfeitas condições, a restituição do valor pago ou o abatimento proporcional do preço. Nas hipóteses previstas no Código de Defesa do Consumidor, essa escolha pode ser feita imediatamente.",
      ],
    },
    {
      titulo: "3. Livro diferente do pedido ou entrega fora do prazo",
      itens: [
        "Se você receber um título ou uma edição diferente do que comprou, ou se o pedido não for entregue no prazo informado, poderá escolher entre receber o que foi contratado, aceitar um produto equivalente ou cancelar a compra com restituição integral dos valores pagos, incluindo o frete. Caso seja necessário devolver um exemplar enviado por engano, o custo da devolução é nosso.",
      ],
    },
    {
      titulo: "4. Como solicitar atendimento",
      itens: [
        `Envie sua solicitação pelo canal oficial de atendimento da Nobre DNA: ${institucional.email} ou ${institucional.telefone}. Informe o número do pedido ou outro dado que ajude a localizar a compra, o título do livro e o que você deseja solicitar. Em caso de defeito, avaria ou item incorreto, fotos podem ajudar a identificar o problema, se você puder enviá-las.`,
        "Você também pode exercer o direito de arrependimento pela mesma ferramenta usada para a compra. Confirmaremos imediatamente o recebimento da solicitação e enviaremos uma resposta em até 5 dias, observados os prazos legais aplicáveis à solução de cada caso.",
      ],
    },
  ],
};
