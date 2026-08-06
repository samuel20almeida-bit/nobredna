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
  const fio =
    tone === "dark"
      ? "linear-gradient(to right,transparent,rgb(198 172 143 / .8))"
      : "linear-gradient(to right,transparent,rgb(1 22 56 / .22))";

  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex items-center justify-center gap-4 ${className}`}
      style={{ width }}
    >
      <span className="h-px flex-1" style={{ background: fio }} />
      <Perola size={11} />
      <span
        className="h-px flex-1"
        style={{ background: fio, transform: "scaleX(-1)" }}
      />
    </div>
  );
}
