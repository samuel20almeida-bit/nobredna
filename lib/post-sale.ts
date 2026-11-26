export const supportCategories = ["withdrawal","defect","wrong_item","delivery","other"] as const;
export type SupportCategory = typeof supportCategories[number];
export const supportCategoryLabels:Record<SupportCategory,string> = {
  withdrawal:"Cancelamento por arrependimento", defect:"Defeito ou avaria",
  wrong_item:"Livro diferente do pedido", delivery:"Entrega fora do prazo", other:"Outra dúvida sobre meu pedido",
};
export const supportStatuses = ["new","reviewing","waiting_customer","resolved"] as const;
export type SupportStatus = typeof supportStatuses[number];
export const supportStatusLabels:Record<SupportStatus,string> = {
  new:"Novo", reviewing:"Em análise", waiting_customer:"Aguardando cliente", resolved:"Resolvido",
};
export const supportProtocol=(id:string)=>"ND-S-"+id.replace(/-/g,"").toUpperCase();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const safeText=(v:unknown,max:number)=>typeof v==="string"&&v.trim().length<=max&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)?v.trim():null;
export function validateSupportRequest(raw:unknown){
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
  const f=raw as Record<string,unknown>;
  if(typeof f.requestId!=="string"||!uuid.test(f.requestId)||!supportCategories.includes(f.category as SupportCategory)||f.consentimento!==true||(f.website!==undefined&&f.website!==""))return null;
  const name=safeText(f.nome,100),email=safeText(f.email,160)?.toLowerCase(),phoneRaw=safeText(f.telefone??"",30),ref=safeText(f.pedido??"",100),book=safeText(f.livro??"",160),description=safeText(f.descricao??"",2000);
  if(!name||name.length<2||!email||!(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))||phoneRaw===null||ref===null||book===null||description===null)return null;
  const phone=phoneRaw.replace(/\D/g,"")||null;
  if(phoneRaw&&!phone||phone&&!/^\d{10,13}$/.test(phone))return null;
  // The consumer can exercise withdrawal without a reason or order number.
  return {id:f.requestId,category:f.category as SupportCategory,customer_name:name,email,phone,order_reference:ref,book_title:book,description,consent:true};
}
export function supportDeadlineLabel(due:string,response:string|null,now=Date.now()){
  const deadline=Date.parse(due);
  if(response)return Date.parse(response)<=deadline?"Resposta registrada":"Resposta após o prazo";
  if(deadline<=now)return "Resposta atrasada";
  if(deadline-now<=24*60*60*1000)return "Responder em até 24h";
  return "Aguardando primeira resposta";
}
