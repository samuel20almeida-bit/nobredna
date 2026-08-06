/**
 * O que a assessoria faz.
 *
 * Este é o produto da casa — não os livros. Os títulos do acervo são obra dos
 * autores; o que a Nobre DNA vende é o trabalho de mesa que os levou até lá.
 *
 * Os preços não estão aqui de propósito: o custo de uma preparação depende do
 * estado e do tamanho do original, e um número fixo no site seria mentira ou
 * chute. O caminho é o diagnóstico, e ele é gratuito.
 */

export type Servico = {
  id: string;
  nome: string;
  linha: string;
  descricao: string;
  entrega: string;
};

export const servicos: Servico[] = [
  {
    id: "diagnostico",
    nome: "Diagnóstico",
    linha: "A primeira leitura, antes de qualquer orçamento.",
    descricao:
      "Lemos o original inteiro e devolvemos um parecer escrito: o que já está de pé, o que precisa de trabalho e quanto trabalho é. É a partir dele que se decide o resto — inclusive não continuar.",
    entrega: "Parecer escrito · sem custo",
  },
  {
    id: "preparacao",
    nome: "Preparação e copidesque",
    linha: "O trabalho de mesa propriamente dito.",
    descricao:
      "Estrutura, ritmo, cortes, repetições, consistência de tempo e de voz. É a etapa mais longa e a que mais muda o livro — o texto sai daqui diferente de como entrou, e ainda assim seu.",
    entrega: "Original preparado, com todas as alterações à vista",
  },
  {
    id: "revisao",
    nome: "Revisão",
    linha: "Duas passadas, por duas pessoas diferentes.",
    descricao:
      "Ortografia, gramática, padronização e conferência de nomes, datas e citações. A segunda passada acontece já no texto diagramado, onde aparecem os erros que a tela esconde.",
    entrega: "Revisão de texto e prova de página",
  },
  {
    id: "projeto",
    nome: "Projeto gráfico e capa",
    linha: "O livro vira objeto.",
    descricao:
      "Escolha de tipografia, mancha, entrelinha, papel e acabamento; diagramação completa; e a capa, desenhada para o título — nunca escolhida de um catálogo de modelos.",
    entrega: "Arquivos fechados para gráfica, em PDF/X",
  },
  {
    id: "registro",
    nome: "ISBN, ficha e registro",
    linha: "A papelada que ninguém quer fazer.",
    descricao:
      "ISBN, ficha catalográfica elaborada por bibliotecário, código de barras, depósito legal na Biblioteca Nacional e registro de direitos autorais em nome do autor.",
    entrega: "Livro apto a circular em qualquer livraria",
  },
  {
    id: "circulacao",
    nome: "Impressão e circulação",
    linha: "Do arquivo à estante.",
    descricao:
      "Cotação e acompanhamento de gráfica, prova impressa, tiragem, e a colocação do título em livrarias independentes, na loja desta casa e nas plataformas digitais.",
    entrega: "Tiragem entregue e título em circulação",
  },
];

/** As etapas na ordem em que acontecem, para a página de serviços. */
export const percurso = [
  {
    n: "01",
    titulo: "Você envia",
    texto:
      "O original completo, ou o que existe dele, por e-mail. Nenhum arquivo precisa ser anexado no primeiro contato.",
  },
  {
    n: "02",
    titulo: "A casa lê e responde",
    texto:
      "Parecer escrito em até 30 dias, sem custo, com o diagnóstico do texto e a proposta de trabalho — etapa a etapa, com prazo e valor de cada uma.",
  },
  {
    n: "03",
    titulo: "Vocês decidem juntos",
    texto:
      "O autor escolhe até onde quer ir. Dá para fazer só a preparação, só o projeto gráfico, ou o percurso inteiro até a livraria.",
  },
  {
    n: "04",
    titulo: "O livro fica pronto",
    texto:
      "E é do autor: os direitos, o ISBN, os arquivos e a decisão final sobre cada vírgula. A casa assina apenas o trabalho de mesa.",
  },
];
