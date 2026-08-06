export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  collection: "Origem" | "Linhagem" | "Herança";
  /** preço em centavos — nunca em float */
  priceCents: number;
  pages: number;
  year: number;
  isbn: string;
  binding: string;
  /** frase curta de vitrine */
  line: string;
  /** o que a assessoria fez neste título — é o portfólio da casa */
  trabalho: string[];
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

const parcel = {
  weightKg: 0.48,
  widthCm: 16,
  heightCm: 23,
  lengthCm: 3,
};

export const books: Book[] = [
  {
    slug: "heranca-invisivel",
    title: "Herança Invisível",
    subtitle: "Sobre o que se transmite sem escritura",
    author: "Marina Vasconcelos",
    collection: "Origem",
    priceCents: 8900,
    pages: 244,
    year: 2024,
    isbn: "978-65-0000-001-4",
    binding: "Capa dura, costurada, papel pólen 80g",
    line: "O que uma família passa adiante antes de passar bens.",
    trabalho: ["Leitura crítica", "Preparação de texto", "Projeto gráfico", "Capa"],
    synopsis: [
      "Marina Vasconcelos parte de um inventário comum — três casas, um relógio, uma caligrafia — para investigar o que atravessa gerações sem nunca constar em documento.",
      "Ao longo de nove ensaios, o livro examina gestos herdados, silêncios repetidos e escolhas que se explicam melhor por linhagem do que por biografia.",
    ],
    excerpt:
      "Ninguém assina o recebimento de um temperamento. Ainda assim ele chega, pontual, na terceira geração.",
    cover: { tone: "navy", ornament: "helix" },
    shipping: parcel,
  },
  {
    slug: "o-nome-que-carregamos",
    title: "O Nome que Carregamos",
    subtitle: "Ensaio sobre pertencimento e peso",
    author: "Rui Belmonte",
    collection: "Linhagem",
    priceCents: 7900,
    pages: 198,
    year: 2023,
    isbn: "978-65-0000-002-1",
    binding: "Brochura com orelhas, papel pólen 80g",
    line: "Um sobrenome é um endereço — e também uma dívida.",
    trabalho: ["Diagnóstico", "Copidesque", "Revisão", "ISBN e ficha"],
    synopsis: [
      "Rui Belmonte escreve a partir de arquivos de cartório, cartas de imigração e conversas de cozinha para reconstruir o percurso de um nome ao longo de cinco gerações.",
      "O resultado é menos genealogia e mais retrato: como um sobrenome organiza expectativas, define lugares e cobra continuidade.",
    ],
    excerpt:
      "Meu avô não me deixou terras. Deixou a obrigação de responder por elas quando alguém perguntasse de onde eu vinha.",
    cover: { tone: "deep", ornament: "crown" },
    shipping: parcel,
  },
  {
    slug: "arquitetura-do-legado",
    title: "Arquitetura do Legado",
    subtitle: "Como instituições duram",
    author: "Helena Prado Cardim",
    collection: "Herança",
    priceCents: 11900,
    pages: 312,
    year: 2025,
    isbn: "978-65-0000-003-8",
    binding: "Capa dura, lombada quadrada, guardas em creme",
    line: "Nenhuma casa dura por acaso. Dura por método.",
    trabalho: ["Leitura crítica", "Preparação", "Projeto gráfico", "Impressão", "Lançamento"],
    synopsis: [
      "Helena Prado Cardim estuda casas centenárias — editoras, alfaiatarias, cartórios, vinícolas — para entender o desenho interno que as manteve de pé.",
      "O livro descreve os mecanismos concretos de continuidade: sucessão, arquivo, ofício e a decisão, sempre difícil, sobre o que não deve mudar.",
    ],
    excerpt:
      "Toda instituição longeva guarda uma lista curta do que nunca será negociado. É essa lista, e não o faturamento, que define sua idade.",
    cover: { tone: "navy", ornament: "rule" },
    shipping: { ...parcel, weightKg: 0.72, lengthCm: 4 },
  },
  {
    slug: "cartas-ao-herdeiro",
    title: "Cartas ao Herdeiro",
    subtitle: "Correspondência reunida, 1968–1994",
    author: "Antônio Meireles",
    collection: "Linhagem",
    priceCents: 9900,
    pages: 276,
    year: 2022,
    isbn: "978-65-0000-004-5",
    binding: "Capa dura, papel avena 90g, marcador em fita",
    line: "Vinte e seis anos de cartas de um pai que não sabia se seriam lidas.",
    trabalho: ["Organização do arquivo", "Preparação", "Projeto gráfico", "Capa"],
    synopsis: [
      "Reunião integral das cartas que Antônio Meireles escreveu ao filho mais velho entre 1968 e 1994, encontradas em 2019 dentro de um arquivo de escritório.",
      "A correspondência acompanha a formação de um herdeiro, mas também a lenta revisão de um pai sobre o que valia a pena transmitir.",
    ],
    excerpt:
      "Escrevo sem certeza de que você lerá. Escrevo porque, se não escrever, a versão que sobra é a dos outros.",
    cover: { tone: "soft", ornament: "seal" },
    shipping: parcel,
  },
  {
    slug: "materia-de-origem",
    title: "Matéria de Origem",
    subtitle: "Poemas reunidos",
    author: "Clarice Bandeira",
    collection: "Origem",
    priceCents: 6900,
    pages: 148,
    year: 2024,
    isbn: "978-65-0000-005-2",
    binding: "Brochura, papel avena 90g, tipografia em duas cores",
    line: "Poesia sobre o corpo como arquivo.",
    trabalho: ["Leitura crítica", "Revisão", "Projeto gráfico"],
    synopsis: [
      "Clarice Bandeira escreve a origem como matéria física: mãos, ossos, cheiro de casa, cicatriz que se repete no mesmo lugar em três mulheres da mesma família.",
      "São 62 poemas curtos, organizados em quatro séries, que tratam a herança como algo que se carrega no corpo antes de virar história.",
    ],
    excerpt:
      "Trago no pulso a mesma torção da mão da minha avó ao segurar a xícara. Não aprendi. Recebi.",
    cover: { tone: "soft", ornament: "helix" },
    shipping: { ...parcel, weightKg: 0.32, lengthCm: 2 },
  },
  {
    slug: "a-casa-e-o-sangue",
    title: "A Casa e o Sangue",
    subtitle: "Romance",
    author: "Joaquim Ferraz de Sá",
    collection: "Herança",
    priceCents: 8900,
    pages: 368,
    year: 2023,
    isbn: "978-65-0000-006-9",
    binding: "Capa dura, sobrecapa em creme, costura aparente",
    line: "Três irmãos, uma casa que nenhum deles quer vender.",
    trabalho: ["Diagnóstico", "Copidesque", "Revisão", "Capa", "Distribuição"],
    synopsis: [
      "Após a morte da matriarca, três irmãos voltam à casa de Guaratinguetá para decidir o destino do imóvel — e descobrem que o inventário é a menor das disputas.",
      "Joaquim Ferraz de Sá constrói um romance de família em que cada objeto da casa carrega uma versão diferente do mesmo passado.",
    ],
    excerpt:
      "A casa não valia o que pediam por ela. Valia o que cada um deles tinha deixado ali dentro sem perceber.",
    cover: { tone: "deep", ornament: "rule" },
    shipping: { ...parcel, weightKg: 0.66, lengthCm: 4 },
  },
  {
    slug: "vinte-geracoes",
    title: "Vinte Gerações",
    subtitle: "Uma investigação sobre continuidade",
    author: "Teresa Almendra",
    collection: "Linhagem",
    priceCents: 10900,
    pages: 288,
    year: 2025,
    isbn: "978-65-0000-007-6",
    binding: "Capa dura, papel pólen 80g, mapas em dobra dupla",
    line: "Quatro séculos de uma mesma família, lidos linha a linha.",
    trabalho: ["Leitura crítica", "Preparação", "Pesquisa de imagens", "Projeto gráfico"],
    synopsis: [
      "Teresa Almendra reconstrói vinte gerações de uma família portuguesa e brasileira a partir de registros paroquiais, listas de embarque e testamentos.",
      "O livro acompanha o que se mantém e o que se rompe: ofícios, nomes repetidos, escolhas de casamento e as duas vezes em que a linhagem quase terminou.",
    ],
    excerpt:
      "Em 1782, a continuidade dessa família dependeu de uma única decisão tomada por uma mulher de dezenove anos.",
    cover: { tone: "navy", ornament: "crown" },
    shipping: { ...parcel, weightKg: 0.68, lengthCm: 4 },
  },
  {
    slug: "o-peso-do-sobrenome",
    title: "O Peso do Sobrenome",
    subtitle: "Conversas com nove herdeiros",
    author: "Vicente Coutinho",
    collection: "Origem",
    priceCents: 7900,
    pages: 224,
    year: 2024,
    isbn: "978-65-0000-008-3",
    binding: "Brochura com orelhas, papel pólen 80g",
    line: "Nove entrevistas com quem recebeu uma casa pronta.",
    trabalho: ["Transcrição das entrevistas", "Preparação", "Revisão", "Capa"],
    synopsis: [
      "Vicente Coutinho entrevistou nove herdeiros de negócios familiares brasileiros com mais de sessenta anos de operação.",
      "As conversas tratam de sucessão, obrigação e do momento exato em que cada um deles decidiu ficar — ou decidiu sair.",
    ],
    excerpt:
      "Perguntei se ele havia escolhido aquele trabalho. Respondeu que havia escolhido não interrompê-lo, o que era diferente.",
    cover: { tone: "soft", ornament: "seal" },
    shipping: parcel,
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function relatedBooks(slug: string, limit = 3): Book[] {
  const current = getBook(slug);
  if (!current) return books.slice(0, limit);
  const sameCollection = books.filter(
    (b) => b.slug !== slug && b.collection === current.collection,
  );
  const rest = books.filter(
    (b) => b.slug !== slug && b.collection !== current.collection,
  );
  return [...sameCollection, ...rest].slice(0, limit);
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
