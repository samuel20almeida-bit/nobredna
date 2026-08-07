/**
 * A fundadora da Casa.
 *
 * Nome, cidade e biografia saem de "Entre Pérolas e Legados" — o livro de
 * marca dela. A bio é recorte da Carta da Fundadora e do capítulo "Como nasceu
 * a NobreDNA", não texto de site escrito por terceiro.
 *
 * Ela assina "Nanda Almeida", e é assim que aparece na folha de rosto, no
 * copyright e ao fim da carta. `AUTORA_NOME` é usado como `author` dos livros
 * dela em lib/books.ts; `AUTORA_CIDADE` assina rodapé, selo do convite,
 * manuscrito do hero e a origem da expedição.
 */

export const AUTORA_NOME = "Nanda Almeida";
export const AUTORA_CIDADE = "Curitiba";

export const autora = {
  nome: AUTORA_NOME,
  cidade: AUTORA_CIDADE,
  /** como ela se apresenta em uma linha */
  linha: "Fundadora da NobreDNA",
  /** a frase que abre a página Sobre — dela, do capítulo de abertura */
  chamada:
    "Poucas pessoas precisam apenas de uma editora. A maioria precisa, primeiro, de alguém que acredite nelas.",

  /** a biografia, recortada da Carta da Fundadora */
  bio: [
    "Durante muito tempo pensei que a NobreDNA fosse apenas uma editora. Com o passar dos anos, compreendi que ela era muito mais do que isso: havia se tornado uma Casa. Uma Casa onde pessoas encontravam coragem para compartilhar suas histórias, onde manuscritos deixavam de ser arquivos para se tornarem testemunhos.",
    "Ela começou no dia em que Deus colocou em meu coração um profundo respeito pelas histórias das pessoas. Naquela época eu ainda não enxergava uma editora — apenas percebia que existiam homens e mulheres carregando testemunhos preciosos que, por diferentes motivos, permaneciam escondidos.",
    "Foi assim que entendi minha verdadeira missão. Antes de editar livros, eu precisava aprender a cuidar de pessoas. Antes de revisar palavras, precisava aprender a ouvir silêncios. Antes de organizar capítulos, precisava compreender histórias. A técnica poderia ser aprendida; o cuidado deveria nascer do coração.",
  ],

  /** o que ela quer que fique claro para quem chega — do próprio livro */
  principios: [
    {
      titulo: "Antes de existir um livro, existe uma vida",
      texto:
        "Nenhuma história chega pequena e nenhum testemunho é comum. Tratamos cada história como um patrimônio — não porque seja perfeita, mas porque pertence a alguém criado à imagem de Deus.",
    },
    {
      titulo: "Nenhuma voz é substituída, apenas fortalecida",
      texto:
        "A revisão não é correção: é gesto de respeito pela voz da autora. O livro sai daqui mais forte, e continua sendo dela do começo ao fim.",
    },
    {
      titulo: "Escutar também é editar",
      texto:
        "Não acreditamos em encontros apressados. A primeira responsabilidade não é oferecer respostas, é oferecer escuta — porque projetos terminam e relacionamentos permanecem.",
    },
  ],
};
