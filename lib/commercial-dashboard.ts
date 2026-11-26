export const commercialPeriods=["month","7d","30d","all"] as const;
export type CommercialPeriod=typeof commercialPeriods[number];
export const commercialPeriodLabels:Record<CommercialPeriod,string>={month:"Este mês","7d":"Últimos 7 dias","30d":"Últimos 30 dias",all:"Todo o período"};
export const orderStages=["pending","preparing","shipped","delivered","review","closed"] as const;
export type OrderStage=typeof orderStages[number];
export const orderStageLabels:Record<OrderStage,string>={pending:"Aguardando pagamento",preparing:"A preparar",shipped:"Enviados",delivered:"Entregues",review:"Em revisão",closed:"Encerrados"};
export const paymentLabels:Record<string,string>={pending:"Aguardando pagamento",paid:"Pago",failed:"Falhou",refunded:"Estornado",cancelled:"Cancelado"};
export const fulfillmentLabels:Record<string,string>={pending:"Não iniciado",preparing:"Em preparação",shipped:"Enviado",delivered:"Entregue",cancelled:"Cancelado"};
export function orderStage(order:{payment_status:string;payment_review:boolean;fulfillment_status:string}):OrderStage{
 if(["refunded","failed","cancelled"].includes(order.payment_status))return "closed";
 if(order.payment_review)return "review";
 if(order.payment_status==="pending")return "pending";
 if(order.payment_status==="paid"&&["preparing","shipped","delivered"].includes(order.fulfillment_status))return order.fulfillment_status as OrderStage;
 return "review";
}
export function canShipOrder(order:{payment_status:string;payment_review:boolean;fulfillment_status:string}){
 return order.payment_status==="paid"&&!order.payment_review&&["preparing","shipped"].includes(order.fulfillment_status);
}
export function orderTimeline(order:{created_at:string;paid_at?:string|null;shipped_at?:string|null;delivered_at?:string|null;refunded_at?:string|null;cancelled_at?:string|null}){
 return ([{label:"Pedido registrado",at:order.created_at},{label:"Pagamento confirmado",at:order.paid_at},{label:"Envio registrado",at:order.shipped_at},{label:"Entrega confirmada",at:order.delivered_at},{label:"Estorno confirmado",at:order.refunded_at},{label:"Pedido cancelado",at:order.cancelled_at}] as {label:string;at:string|null|undefined}[]).filter((entry):entry is {label:string;at:string}=>Boolean(entry.at)).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
}
