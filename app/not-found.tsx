import Link from "next/link";
import { ArrowRight, HelixMark } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="relative z-10 flex min-h-[80vh] items-center bg-navy">
      <div className="mx-auto max-w-[640px] px-6 text-center">
        <span className="mx-auto block w-fit text-gold">
          <HelixMark size={30} />
        </span>
        <h1 className="mt-8 text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-cream">
          Esta página não está no catálogo.
        </h1>
        <p className="mt-5 text-[0.98rem] leading-[1.8] text-cream/50">
          O endereço mudou ou o título saiu de circulação.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 border border-gold/40 px-7 py-3.5 text-[0.75rem] tracking-[0.2em] uppercase text-gold-light transition-colors duration-500 hover:border-gold hover:bg-gold/8"
        >
          Voltar ao início
          <span className="transition-transform duration-500 group-hover:translate-x-1">
            <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </div>
  );
}
