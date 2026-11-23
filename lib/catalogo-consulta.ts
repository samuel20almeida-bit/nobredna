/** Obras apresentadas pela Casa. Preço, disponibilidade e autoria comercial
 * precisam de validação antes de entrarem no catálogo transacional. */
export const catalogoConsulta = [
  {slug:"ave-mulher",titulo:"Ave Mulher",categoria:"Devocional",descricao:"Liderança feminina à luz da Bíblia. Um lançamento celebrado pela Casa.",imagem:"/brand/ave-mulher.webp",href:"https://instagram.com/p/DRULXj2jnX6"},
  {slug:"noiva-apaixonada",titulo:"Noiva Apaixonada",categoria:"Lançamento editorial",descricao:"Uma ideia que se tornou livro. Conheça o registro desse lançamento da Casa.",imagem:"/brand/noiva-apaixonada.webp",href:"https://instagram.com/p/Dd4MhDqtZJV"},
] as const;
export type ObraConsulta = (typeof catalogoConsulta)[number];
export function getObra(slug:string){return catalogoConsulta.find(obra=>obra.slug===slug)}
export const whatsappCasa = "554188335400";
