import { Hero } from "@/components/hero";
import { HelixRail } from "@/components/helix-rail";
import { Portas } from "@/components/portas";
import { VitrineAutora } from "@/components/vitrine-autora";
import { Servicos } from "@/components/servicos";
import { Acervo } from "@/components/acervo";
import { Colecoes } from "@/components/colecoes";
import { Testemunhos } from "@/components/testemunhos";
import { Newsletter } from "@/components/newsletter";

/**
 * A ordem da home segue as duas portas.
 *
 * Logo depois do hero vem a bifurcação, e então cada lado tem seu turno: os
 * livros dela primeiro (é o que já vende e o que traz quem chega por
 * indicação), a assessoria em seguida. Sem isso, a página inteira falava para
 * autores e não tinha onde vender um exemplar.
 */
export default function HomePage() {
  return (
    <>
      {/* o trilho continua a hélice do hero e costura as seções abaixo dele */}
      <HelixRail side="right" />
      <div className="relative z-10">
        <Hero />
        <Portas />
        <VitrineAutora />
        <Servicos />
        <Acervo />
        <Colecoes />
        <Testemunhos />
        <Newsletter />
      </div>
    </>
  );
}
