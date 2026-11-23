/**
 * Conta e divisor de conta.
 *
 * O logo termina num ornamento simples: fio fino, pérola, fio fino. É o
 * detalhe mais reconhecível da marca depois do monograma, e não existia no
 * site. Aqui ele vira o separador entre seções — o mesmo papel que a hélice
 * cumpre na vertical, cumprido na horizontal.
 */

export function Perola({
  size = 12,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 rounded-full bg-khaki ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/** Fio · pérola · fio. `tone` acompanha o fundo da seção. */
export function DivisorPerola({
  tone = "dark",
  width = "min(22rem, 60%)",
  className = "",
}: {
  tone?: "dark" | "light";
  width?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pearl-divider mx-auto ${tone === "dark" ? "pearl-divider-dark" : ""} ${className}`}
      style={{ width }}
    >
      {/* Ornamento decorativo: não entra na leitura de tela. */}
      <img src="/brand/divisor-perolas.webp" width={700} height={80} alt="" draggable={false} className="block h-auto w-full"/>
    </div>
  );
}

export function PearlSectionDivider() {
  return <div aria-hidden="true" className="pearl-divider-band"><DivisorPerola tone="light" width="min(340px, 76%)"/></div>;
}
