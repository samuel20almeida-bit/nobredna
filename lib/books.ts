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

import { AUTORA_NOME } from "@/lib/autora";

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

const parcel = {
  weightKg: 0.48,
  widthCm: 16,
  heightCm: 23,
  lengthCm: 3,
};

export const books: Book[] = [
  /* ── A estante da autora ──────────────────────────────────────────────
     PROVISÓRIO. Títulos, textos, preços, ISBN e páginas são de exemplo,
     escritos só para a estrutura ficar de pé e navegável. Trocar por dados
     reais antes de qualquer divulgação — nada aqui foi escrito por ela.
     O nome sai de lib/autora.ts, então basta editar num lugar só. */
  {
    slug: "manhas-com-ele",
    avaliacao: { media: 4.8, total: 63 },
    depoimentos: [
      {
        texto:
          "Comprei achando que ia render uma semana e abandonar, como os outros. Estou no dia cinquenta e dois.",
        nome: "Priscila Andrade",
        cidade: "Goiânia",
        nota: 5,
      },
      {
        texto:
          "É curto de verdade. Isso parece pouco, mas foi exatamente o que fez eu conseguir manter.",
        nome: "Denise Rocha",
        cidade: "Santo André",
        nota: 5,
      },
    ],
    origem: "autora",
    title: "Manhãs com Ele",
    subtitle: "Devocional de sessenta dias",
    author: AUTORA_NOME,
    formato: "devocional",
    serie: "Manhãs",
    priceCents: 6900,
    pages: 168,
    year: 2024,
    isbn: "978-65-0000-101-2",
    binding: "Capa dura, costurada, papel pólen 80g, marcador em fita",
    line: "Sessenta manhãs para começar o dia com Ele antes de tudo.",
    synopsis: [
      "Sessenta leituras curtas, uma para cada manhã, pensadas para quem quer começar o dia na presença de Deus mas nunca encontra tempo.",
      "Cada entrada traz um versículo, uma reflexão de uma página e uma oração breve — o suficiente para caber antes da casa acordar.",
    ],
    excerpt:
      "Deus não pede a sua manhã inteira. Pede o primeiro pensamento dela.",
    amostra: {
      titulo: "Dia 1 · O primeiro pensamento",
      versiculo:
        "De manhã, ó Senhor, ouves a minha voz; de manhã te apresento a minha oração e fico esperando.",
      referencia: "Salmos 5:3",
      texto:
        "Há uma diferença entre acordar e despertar. A maioria de nós acorda com o celular na mão e desperta já devendo alguma coisa a alguém. Este devocional é um convite a inverter a ordem: antes da lista, antes da notícia, antes do primeiro pedido do dia, uma frase dirigida a Deus. Não precisa ser bonita. Precisa ser primeira.",
    },
    cover: { tone: "soft", ornament: "rule" },
    shipping: parcel,
  },
  {
    slug: "o-deserto-tambem-floresce",
    avaliacao: { media: 4.9, total: 41 },
    depoimentos: [
      {
        texto:
          "Perdi meu pai em março. Este foi o único livro que não tentou me consolar rápido demais.",
        nome: "Marta Queiroz",
        cidade: "Recife",
        nota: 5,
      },
      {
        texto:
          "Dei para três amigas e comprei outro para mim, porque o meu ficou todo grifado.",
        nome: "Cleide Nogueira",
        cidade: "Belo Horizonte",
        nota: 5,
      },
    ],
    origem: "autora",
    title: "O Deserto Também Floresce",
    subtitle: "Devocional para tempos de espera",
    author: AUTORA_NOME,
    formato: "devocional",
    priceCents: 7400,
    pages: 192,
    year: 2023,
    isbn: "978-65-0000-102-9",
    binding: "Brochura com orelhas, papel pólen 80g",
    line: "Para quem está no meio da travessia e ainda não vê a outra margem.",
    synopsis: [
      "Quarenta leituras escritas para o tempo em que a oração parece não ser respondida e a espera já dura mais do que se imaginava suportar.",
      "O livro não promete atalho: acompanha o deserto de dentro, com os textos bíblicos de quem também esperou muito antes de ver.",
    ],
    excerpt:
      "O deserto não é o desvio do caminho. Muitas vezes é o caminho, e é nele que se aprende a andar.",
    amostra: {
      titulo: "Dia 7 · O que cresce no seco",
      versiculo:
        "O deserto e a terra ressequida se alegrarão; o ermo exultará e florescerá como o açafrão.",
      referencia: "Isaías 35:1",
      texto:
        "Ninguém escolhe o deserto. Chegamos nele por perda, por demora, por uma porta que não abriu. E a primeira coisa que o deserto faz é calar as vozes que nos distraíam — inclusive as boas. É por isso que ele é lugar de encontro: sobra pouca coisa, e o pouco que sobra é o essencial.",
    },
    cover: { tone: "navy", ornament: "seal" },
    shipping: parcel,
  },
  {
    slug: "cartas-para-dias-dificeis",
    avaliacao: { media: 4.6, total: 28 },
    depoimentos: [
      {
        texto:
          "Cada carta cabe num intervalo de almoço. Levo na bolsa desde novembro.",
        nome: "Simone Vilela",
        cidade: "Curitiba",
        nota: 5,
      },
      {
        texto:
          "Esperava algo mais devocional e é mais literário do que imaginei. Gostei, mas vale saber antes.",
        nome: "Rosana Teixeira",
        cidade: "Sorocaba",
        nota: 4,
      },
    ],
    origem: "autora",
    title: "Cartas para Dias Difíceis",
    subtitle: "Trinta cartas de fé",
    author: AUTORA_NOME,
    formato: "integral",
    priceCents: 6400,
    pages: 144,
    year: 2022,
    isbn: "978-65-0000-103-6",
    binding: "Brochura, papel avena 90g",
    line: "Trinta cartas para ler quando faltar chão.",
    synopsis: [
      "Trinta cartas escritas ao longo de dois anos para mulheres que atravessavam luto, diagnóstico, separação ou desemprego.",
      "Publicadas com autorização das destinatárias, com os nomes trocados e o essencial mantido: a fé dita em voz baixa, no meio da dor, sem resposta pronta.",
    ],
    excerpt:
      "Não vou te dizer que Deus tem um propósito nisso. Vou te dizer que Ele está aí dentro com você, e isso eu sei porque já estive.",
    cover: { tone: "deep", ornament: "crown" },
    shipping: parcel,
  },
  /* ── A estante da assessoria: livros de outros autores ───────────────── */
  {
    slug: "heranca-invisivel",
    origem: "assessoria",
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
    origem: "assessoria",
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
    origem: "assessoria",
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
    origem: "assessoria",
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
    origem: "assessoria",
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
    origem: "assessoria",
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
    origem: "assessoria",
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
    origem: "assessoria",
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
