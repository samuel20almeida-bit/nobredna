import type {SupabaseClient} from "@supabase/supabase-js";
import {whatsappUrl} from "@/lib/editorial-workspace";
import {AdminMutationForm,AdminSubmit} from "./admin-feedback";

async function supportSettings(client:SupabaseClient){
 return client.from("editorial_support_settings").select("editorial_whatsapp,technical_whatsapp").eq("singleton",true).maybeSingle();
}
export async function AdminSupportSettings({client}:{client:SupabaseClient}){
 const {data,error}=await supportSettings(client);
 const tech=whatsappUrl(data?.technical_whatsapp??null,"Olá, AURA! Preciso de suporte técnico com o painel da NobreDNA.");
 return <section id="suporte" className="admin-card p-6 scroll-mt-20"><p className="text-xs font-semibold uppercase tracking-widest text-khaki-ink">Atendimento</p><h2 className="mt-2 font-sans text-lg font-semibold">WhatsApp e suporte</h2>
 {error?<p role="alert" className="mt-3 text-sm text-vinho">Não foi possível carregar os canais.</p>:<AdminMutationForm operation="updateSupportNumber" className="mt-4 space-y-3"><label className="block text-sm font-medium">WhatsApp público da editora<input type="tel" name="editorial_whatsapp" defaultValue={data?.editorial_whatsapp??""} maxLength={40} placeholder="(41) 99999-9999" className="admin-input mt-2"/></label><p className="text-xs leading-relaxed text-ink/65">Este número ficará acessível ao público no botão de ajuda. Deixe em branco para desativar os links de WhatsApp. Os formulários continuam funcionando normalmente.</p><AdminSubmit>Salvar canal de atendimento</AdminSubmit></AdminMutationForm>}
 <div className="mt-6 border-t border-ink/10 pt-5"><h3 className="font-sans text-sm font-semibold">Suporte técnico da plataforma</h3><p className="mt-2 text-sm text-ink/65">Problemas com acesso, painel ou funcionamento do site? Fale com a AURA.</p>{tech?<a href={tech} target="_blank" rel="noopener noreferrer" className="admin-secondary mt-3">Conversar com a AURA ↗</a>:<p className="mt-3 text-xs text-ink/60">O canal técnico ainda precisa ser confirmado pela agência.</p>}</div></section>;
}
