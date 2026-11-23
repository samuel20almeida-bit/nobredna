/**
 * A casa tem duas estantes, e elas não se misturam.
 *
 * A da autora é loja: são os livros dela, que o leitor compra. A da assessoria
 * é portfólio: são livros de outros autores, que passaram por esta mesa e estão
 * aqui para mostrar o trabalho — a venda acontece em nome de quem escreveu.
 *
 * A distinção é um union discriminado por `origem` de propósito. Os dois tipos
 * carregam campos que só fazem sentido de um lado (`trabalho` é portfólio,
 * `formato` é leitura), e o TypeScript recusa a mistura em vez de deixar passar
 * um devocional com etapa de copidesque ou um livro de cliente na vitrine dela.
 */


export type Colecao = "Origem" | "Linhagem" | "Herança";

type LivroBase = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  /** preço em centavos — nunca em float */
  priceCents: number;
  pages: number;
  year: number;
  isbn: string;
  binding: string;
  /** frase curta de vitrine */
  line: string;
  synopsis: string[];
  excerpt: string;
  /** variação de capa: define o tom e o ornamento gravado */
  cover: {
    tone: "navy" | "deep" | "soft";
    ornament: "helix" | "crown" | "seal" | "rule";
  };
  /** dados de expedição para cotação de frete */
  shipping: {
    weightKg: number;
    widthCm: number;
    heightCm: number;
    lengthCm: number;
  };
};

/**
 * O que uma leitora achou, e quantas disseram o mesmo.
 *
 * Os dois campos são opcionais de propósito. Um livro recém-lançado não tem
 * avaliação, e a página precisa saber ficar em silêncio nesse caso — nota
 * inventada ou "5,0 (0 avaliações)" custa mais confiança do que compra.
 * `media` é de 0 a 5 e só aparece com `total` maior que zero.
 */
export type AvaliacaoLeitoras = {
  media: number;
  total: number;
};

export type DepoimentoLeitora = {
  texto: string;
  nome: string;
  cidade?: string;
  /** nota que esta leitora deu, quando ela deu */
  nota?: number;
};

/** Livro da autora da casa — vai para a loja. */
export type LivroDaAutora = LivroBase & {
  origem: "autora";
  /** só existe depois que leitoras avaliaram de verdade */
  avaliacao?: AvaliacaoLeitoras;
  /** o que leitoras escreveram sobre este título */
  depoimentos?: DepoimentoLeitora[];
  /** série devocional a que pertence, quando houver */
  serie?: string;
  /**
   * Devocional se lê por dia, não do começo ao fim — e por isso a página
   * mostra uma leitura de amostra em vez de só sinopse e botão.
   */
  formato: "devocional" | "integral";
  /** amostra de leitura: uma entrada do devocional, para experimentar antes */
  amostra?: {
    titulo: string;
    versiculo: string;
    referencia: string;
    texto: string;
  };
};

/** Livro de autor atendido pela assessoria — vai para o portfólio. */
export type LivroDaAssessoria = LivroBase & {
  origem: "assessoria";
  collection: Colecao;
  /** o que a assessoria fez neste título — é o portfólio da casa */
  trabalho: string[];
};

export type Book = LivroDaAutora | LivroDaAssessoria;

/* ATENÇÃO — as avaliações e os depoimentos abaixo são INVENTADOS, assim como
   os títulos e o nome da autora. Servem para desenhar e conferir a página, e
   precisam ser substituídos pelos reais antes de o site receber visita de
   verdade. Depoimento fabricado com nome e cidade de pessoa que não existe é
   propaganda enganosa, não placeholder inofensivo. */

// O catálogo comercial será preenchido com títulos, preços e estoque validados pela Casa.
export const books: Book[] = [];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

/** A loja: os livros dela. */
export const livrosDaAutora = books.filter(
  (b): b is LivroDaAutora => b.origem === "autora",
);

/** O portfólio: os livros que passaram pela mesa. */
export const livrosDaAssessoria = books.filter(
  (b): b is LivroDaAssessoria => b.origem === "assessoria",
);

/**
 * Relacionados nunca cruzam as estantes: quem está lendo um devocional dela
 * não deve receber o romance de um cliente como sugestão, e vice-versa —
 * seriam duas ofertas diferentes disfarçadas de uma só.
 */
export function relatedBooks(slug: string, limit = 3): Book[] {
  const current = getBook(slug);
  if (!current) return livrosDaAutora.slice(0, limit);

  const mesmaEstante = books.filter(
    (b) => b.slug !== slug && b.origem === current.origem,
  );

  if (current.origem === "assessoria") {
    const mesmaLinha = mesmaEstante.filter(
      (b) => b.origem === "assessoria" && b.collection === current.collection,
    );
    const resto = mesmaEstante.filter((b) => !mesmaLinha.includes(b));
    return [...mesmaLinha, ...resto].slice(0, limit);
  }

  const mesmaSerie = mesmaEstante.filter(
    (b) => b.origem === "autora" && current.serie && b.serie === current.serie,
  );
  const resto = mesmaEstante.filter((b) => !mesmaSerie.includes(b));
  return [...mesmaSerie, ...resto].slice(0, limit);
}

/* A casa não tem catálogo próprio: tem especialidade. Estas são as três
   linhas de assunto que ela sabe acompanhar, e é por elas que os livros
   feitos aqui se agrupam. */
export const collections = [
  {
    name: "Origem" as const,
    line: "De onde vem o que você já era antes de decidir.",
    description:
      "Formação: o que chega pelo corpo, pela casa e pela repetição, antes de virar escolha. É onde a casa mais trabalha memória e primeira pessoa.",
  },
  {
    name: "Linhagem" as const,
    line: "O percurso de um nome através do tempo.",
    description:
      "Investigações longas sobre famílias, arquivos e continuidade. Aqui a assessoria costuma entrar cedo, ainda na organização do material bruto.",
  },
  {
    name: "Herança" as const,
    line: "O que se recebe pronto e precisa ser sustentado.",
    description:
      "Instituições, casas e ofícios que duraram. São livros de pesquisa densa, em que o trabalho de mesa pesa mais que o de escrita.",
  },
];
