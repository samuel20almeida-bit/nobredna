import { catalogoConsulta } from "./catalogo-consulta.ts";

export const journeyBase = [
  { titulo:"Que tipo de história deseja compartilhar?", opcoes:["Minha trajetória e testemunho","Fé e reflexões","Memórias e histórias de família","Ainda estou descobrindo"] },
  { titulo:"Onde você está nessa jornada?", opcoes:["Tenho apenas uma ideia","Já comecei a escrever","Tenho um manuscrito pronto"] },
  { titulo:"Como gostaria de publicar?", opcoes:["Uma obra autoral","Uma coautoria","Quero entender as possibilidades"] }
];
export function journeyQuestions(coautoria=false) {
  return coautoria ? [...journeyBase.slice(0,2),{titulo:"O que procura em uma coautoria?",opcoes:["Compartilhar meu testemunho","Escrever com apoio de outras autoras","Conhecer os próximos projetos"]}] : journeyBase;
}

export const leadSources = ["editorial","coautoria","livros"] as const;
export type LeadSource = typeof leadSources[number];
export const leadSourceLabels: Record<LeadSource,string> = {editorial:"Projeto editorial",coautoria:"Coautoria",livros:"Consulta de livros"};
export const leadStatuses = ["new","contacted","proposal_sent","negotiating","closed","lost"] as const;
export type LeadStatus = typeof leadStatuses[number];
export const leadStatusLabels: Record<LeadStatus,string> = {new:"Novo",contacted:"Em atendimento",proposal_sent:"Proposta enviada",negotiating:"Em negociação",closed:"Concluído",lost:"Encerrado sem avanço"};
export const leadProtocol = (id:string) => "ND-"+id.replace(/-/g,"").toUpperCase();
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text=(value:unknown,max:number)=>typeof value==="string"&&value.trim().length<=max?value.trim():null;
export type LeadInsert={id:string;source:LeadSource;customer_name:string;email:string|null;phone:string|null;details:Record<string,unknown>;consent:boolean};

export function validateEditorialLead(raw:unknown):LeadInsert|null {
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
  const b=raw as Record<string,unknown>;
  if(typeof b.requestId!=="string"||!uuidPattern.test(b.requestId)||!leadSources.includes(b.source as LeadSource)||b.consentimento!==true)return null;
  if(b.website!==undefined&&b.website!=="")return null;
  const nome=text(b.nome,100),emailRaw=text(b.email??"",160),phoneRaw=text(b.telefone??"",30);
  if(!nome||nome.length<2||emailRaw===null||phoneRaw===null)return null;
  const email=emailRaw.toLowerCase()||null,phone=phoneRaw.replace(/\D/g,"")||null;
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)||phone&&!/^\d{10,13}$/.test(phone)||!email&&!phone)return null;
  const source=b.source as LeadSource;
  let details:Record<string,unknown>;
  if(source==="livros"){
    if(!Array.isArray(b.itens)||b.itens.length<1||b.itens.length>catalogoConsulta.length)return null;
    const cep=text(b.cep??"",12)?.replace(/\D/g,"");
    if(cep===undefined||cep!==""&&!/^\d{8}$/.test(cep))return null;
    const seen=new Set<string>();const items=[];
    for(const line of b.itens){
      if(!line||typeof line!=="object"||typeof line.slug!=="string"||!Number.isInteger(line.qty)||line.qty<1||line.qty>12||seen.has(line.slug))return null;
      const book=catalogoConsulta.find(x=>x.slug===line.slug);if(!book)return null;
      seen.add(line.slug);items.push({slug:book.slug,titulo:book.titulo,quantidade:line.qty});
    }
    details={itens:items,cep:cep||null};
  }else{
    const questions=journeyQuestions(source==="coautoria");
    if(!Array.isArray(b.respostas)||b.respostas.length!==questions.length)return null;
    const respostas=questions.map((question,index)=>({pergunta:question.titulo,resposta:(b.respostas as unknown[])[index]}));
    if(respostas.some((r,i)=>typeof r.resposta!=="string"||!questions[i].opcoes.includes(r.resposta)))return null;
    details={respostas};
  }
  return {id:b.requestId,source,customer_name:nome,email,phone,details,consent:true};
}
