import Link from "next/link";
import { LiteraryShelf, EditorialCarousel } from "@/components/literary-interactions";

export function ProjetosReais() {
 return <section id="acervo" className="bg-almond py-16 lg:py-24">
  <div className="mx-auto max-w-[1180px] px-6 lg:px-10">
   <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="label">a estante da Casa</p><h2 className="mt-4 max-w-[22ch] text-[clamp(2.4rem,5vw,3.75rem)] leading-none">Histórias que se tornaram <em className="text-vinho">legado.</em></h2></div><a href="https://www.instagram.com/nobre_dna/" target="_blank" rel="noreferrer" className="inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Ver mais no Instagram</a></div>
   <LiteraryShelf/>
   <EditorialCarousel/>
   <p className="mt-5 text-sm text-ink/65">Projetos apresentados no perfil da Casa. As imagens acima são composições conceituais, não capas oficiais.</p>
   <Link href="/coautorias" className="mt-7 inline-block border-b border-vinho pb-1 font-serif text-xl text-vinho">Descubra também as coautorias</Link>
  </div>
 </section>;
}
