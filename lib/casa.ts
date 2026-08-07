/**
 * A Casa, nas palavras dela.
 *
 * Tudo neste arquivo sai de "Entre Pérolas e Legados — A Filosofia de uma Casa
 * de Legados" (Nanda Almeida, NobreDNA Editorial, Curitiba, 2026), o livro de
 * marca que ela escreveu. Não é texto de site inventado por terceiro: é a voz
 * da fundadora, transcrita e recortada.
 *
 * Três decisões de vocabulário vêm dali e valem para o site inteiro:
 *
 *   Casa, não assessoria.  Ela tem um capítulo chamado "Uma Casa, não apenas
 *   uma editora", e a palavra "assessoria" não aparece nenhuma vez em 1116
 *   parágrafos. "Casa" aparece 56. Vai com maiúscula, como ela escreve.
 *
 *   NobreDNA, sem espaço.  42 ocorrências no livro, nenhuma da grafia com
 *   espaço no meio que o site usava até aqui.
 *
 *   Autora, no feminino.  "autora/autoras" aparece 23 vezes contra 9 de
 *   "autor/autores". Quem chega a esta Casa é, na esmagadora maioria, mulher.
 */

export const CASA_NOME = "NobreDNA";
export const CASA_LINHA = "Casa editorial";

/** A epígrafe que abre o livro dela. */
export const epigrafe = {
  texto: "Se o Senhor não edificar a casa, em vão trabalham os que a edificam.",
  referencia: "Salmo 127:1",
};

/**
 * O manifesto, na íntegra e na ordem em que ela escreveu.
 * Onze linhas, todas começando por "Acreditamos".
 */
export const manifesto = [
  "toda história possui valor",
  "escrever também é servir",
  "livros preservam legados",
  "excelência é uma forma de honra",
  "pessoas sempre virão antes dos processos",
  "nenhuma voz deve ser substituída, apenas fortalecida",
  "beleza comunica cuidado",
  "servir é um privilégio",
  "a verdade nunca perde seu valor",
  "Deus continua escrevendo histórias através de pessoas comuns",
  "esta Casa permanecerá viva enquanto permanecer fiel à sua essência",
];

/**
 * Os sete pilares, na ordem do livro — e a ordem importa: a fé vem primeiro
 * porque, nas palavras dela, "antes de qualquer planejamento existiu uma
 * oração".
 */
export type Pilar = {
  id: string;
  nome: string;
  linha: string;
  texto: string;
};

export const pilares: Pilar[] = [
  {
    id: "fe",
    nome: "Fé",
    linha: "Antes de qualquer planejamento existiu uma oração.",
    texto:
      "A fé não ocupa um espaço secundário nem aparece só na dificuldade: orienta decisões, define prioridades e ensina limites. Somos administradores de uma missão, não proprietários de um legado.",
  },
  {
    id: "verdade",
    nome: "Verdade",
    linha: "Nenhuma confiança permanece onde a verdade é negociável.",
    texto:
      "Falamos com clareza, explicamos processos, reconhecemos limitações e assumimos erros. Preferimos a conversa difícil ao problema escondido atrás de um discurso confortável.",
  },
  {
    id: "excelencia",
    nome: "Excelência",
    linha: "Excelência não é perfeccionismo. É cuidado.",
    texto:
      "Quando alguém confia sua história às nossas mãos, recebemos algo precioso. Cada revisão merece atenção, cada detalhe gráfico merece intenção, cada escolha editorial merece reflexão.",
  },
  {
    id: "beleza",
    nome: "Beleza",
    linha: "A beleza comunica antes que qualquer palavra seja lida.",
    texto:
      "Não buscamos beleza por vaidade, mas porque ela prepara o coração para receber a mensagem. Assim como um jardim bem cuidado convida alguém a permanecer, um livro belo convida a entrar na história.",
  },
  {
    id: "cuidado",
    nome: "Cuidado",
    linha: "Aquilo que Deus coloca em nossas mãos nunca é apenas um livro.",
    texto:
      "O cuidado transforma processos em relacionamentos: a reunião vira encontro, e a revisão vira gesto de respeito pela voz da autora. É decidir que ninguém será tratado como mais um projeto na agenda.",
  },
  {
    id: "legado",
    nome: "Legado",
    linha: "Não escreva apenas para hoje. Escreva para quem ainda virá.",
    texto:
      "Um livro não termina quando é publicado — é ali que sua caminhada começa. Ele visitará casas que jamais conheceremos e consolará pessoas cujas lágrimas nunca veremos. As palavras deixam de ser expressão e passam a ser herança.",
  },
  {
    id: "servico",
    nome: "Serviço",
    linha: "Competências impressionam. O cuidado permanece.",
    texto:
      "Servimos quando escutamos com atenção, quando respeitamos o tempo de uma autora, quando celebramos sua conquista como se fosse nossa e quando permanecemos presentes depois da entrega do livro.",
  },
];

/**
 * A pergunta que abre um projeto nesta Casa.
 *
 * Está no capítulo "Por que existimos" e reorganiza sozinha a página de
 * publicação: o primeiro contato não é o envio de um arquivo, é uma conversa.
 */
export const perguntaFundadora = {
  errada: "Que livro você deseja escrever?",
  certa: "Que legado Deus deseja preservar através da sua história?",
};

/** Como ela descreve o primeiro encontro. */
export const primeiroEncontro = {
  titulo: "O primeiro encontro",
  linhas: [
    "Toda história possui um primeiro capítulo. Na maioria das vezes, ele não começa com um manuscrito. Começa com uma conversa.",
    "Nesse momento, nossa primeira responsabilidade não é oferecer respostas. É oferecer escuta.",
    "Não acreditamos em encontros apressados. Acreditamos em conversas que constroem vínculos — porque projetos terminam e relacionamentos permanecem.",
  ],
};

/** O que ela chama de "Uma Casa, não apenas uma editora". */
export const porQueCasa = [
  "Casas acolhem.",
  "Casas escutam.",
  "Casas preservam memórias.",
  "Casas celebram conquistas.",
  "Casas oferecem abrigo durante as tempestades.",
];
