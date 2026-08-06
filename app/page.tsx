import { Hero } from "@/components/hero";
import { HelixRail } from "@/components/helix-rail";
import { Servicos } from "@/components/servicos";
import { Acervo } from "@/components/acervo";
import { Colecoes } from "@/components/colecoes";
import { Testemunhos } from "@/components/testemunhos";
import { Newsletter } from "@/components/newsletter";

export default function HomePage() {
  return (
    <>
      {/* o trilho continua a hélice do hero e costura as seções abaixo dele */}
      <HelixRail side="right" />
      <div className="relative z-10">
        <Hero />
        <Servicos />
        <Acervo />
        <Colecoes />
        <Testemunhos />
        <Newsletter />
      </div>
    </>
  );
}
