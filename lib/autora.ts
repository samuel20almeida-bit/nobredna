/**
 * A autora da casa.
 *
 * PROVISÓRIO: nome, biografia e números abaixo são de exemplo. Estão reunidos
 * num arquivo só justamente para que a troca pelos dados reais seja uma edição
 * de texto, e não uma caçada por componentes.
 *
 * O nome também é usado como `author` dos livros dela em lib/books.ts.
 */

export const AUTORA_NOME = "Nome da Autora";

export const autora = {
  nome: AUTORA_NOME,
  /** como ela se apresenta em uma linha */
  linha: "Escritora de devocionais cristãos",
  /** a frase que abre a página Sobre */
  chamada: "Escrevo para quem precisa de Deus numa terça-feira comum.",

  /** a biografia, parágrafo a parágrafo */
  bio: [
    "Escrevo devocionais há mais de dez anos. Comecei por necessidade própria: precisava de textos curtos, honestos e sem fórmula para os dias em que a fé não vinha fácil, e não encontrava. Passei a escrever os que faltavam.",
    "Os livros nasceram assim — de cadernos, de cartas a amigas em crise, de manhãs em que a única oração possível era uma frase. Foram vendidos primeiro de mão em mão, depois por mensagem, um a um, para leitoras que voltavam pedindo o próximo.",
    "A Nobre DNA nasce desse percurso. Depois de aprender na prática o que é preparar, revisar, diagramar, registrar e vender um livro, a casa passa a fazer isso por outros autores — sem tomar deles o que é seu.",
  ],

  /** o que ela quer que fique claro para quem chega */
  principios: [
    {
      titulo: "Escrevo do lugar de quem também precisa",
      texto:
        "Nenhum destes livros foi escrito de cima para baixo. Todos saíram de um tempo em que eu mesma precisava lê-los.",
    },
    {
      titulo: "Texto curto, sem enfeite",
      texto:
        "Devocional que exige meia hora não é lido. Cada leitura cabe no tempo real de uma manhã de casa cheia.",
    },
    {
      titulo: "Sem promessa que não se cumpre",
      texto:
        "Não escrevo que a dor passa em quarenta dias. Escrevo que dá para atravessá-la acompanhada.",
    },
  ],
};
