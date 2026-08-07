import type { SVGProps } from "react";

/**
 * Line-icons finos, traço 1, sempre em currentColor (dourado).
 * Desenhados para este projeto — nada de ícone genérico de biblioteca.
 */

type IconProps = Omit<SVGProps<SVGSVGElement>, "size"> & {
  /** número em px ou qualquer unidade CSS ("100%") */
  size?: number | string;
};

function Icon({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 12h18" />
      <path d="M15 6.5 20.5 12 15 17.5" />
    </Icon>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 12H3" />
      <path d="M9 6.5 3.5 12 9 17.5" />
    </Icon>
  );
}

/** Pena — autoria */
export function Quill(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 3.5c-6.6.6-11 3.4-13.2 8.4-.8 1.9-1 3.8-.6 5.6" />
      <path d="M6.7 17.5c4.6.6 8-1 10.2-4.8 1.4-2.4 2.6-5.4 3.6-9.2" />
      <path d="M3 21c1.4-2 2.7-3.5 3.9-4.6" />
      <path d="M10.5 12.8c1.9-.4 3.6-1.3 5-2.7" />
    </Icon>
  );
}

/** Lápis — a mão que anota. A ponta fica no canto inferior esquerdo, que é
    onde o traço nasce quando ele atravessa a página. */
export function Lapis(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20l1.2-4.2L16.4 4.6a2 2 0 0 1 2.8 2.8L8.2 18.8 4 20z" />
      <path d="M14.6 6.4l3 3" />
    </Icon>
  );
}

/** Estrela — avaliação. `preenchida` a pinta em vez de só contorná-la. */
export function Estrela({
  preenchida = false,
  ...props
}: IconProps & { preenchida?: boolean }) {
  return (
    <Icon fill={preenchida ? "currentColor" : "none"} {...props}>
      <path d="M12 3.6l2.5 5.2 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" />
    </Icon>
  );
}

/** Escudo — garantia, compra protegida */
export function Escudo(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l7 2.6v5.6c0 4.2-2.9 7.6-7 9.2-4.1-1.6-7-5-7-9.2V5.6z" />
      <path d="M9 12.2l2.1 2.1 4.1-4.2" />
    </Icon>
  );
}

/** Seta em volta — troca, devolução */
export function Retorno(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 11a8 8 0 1 1 2.3 5.7" />
      <path d="M3.5 6.5V11H8" />
    </Icon>
  );
}

/** Lombadas na estante — acervo */
export function Spines(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="6" width="4" height="14" rx="0.6" />
      <rect x="9" y="3" width="4" height="17" rx="0.6" />
      <rect x="15" y="8" width="4" height="12" rx="0.6" />
      <path d="M4 9.5h2M10 6.5h2M16 11.5h2" />
    </Icon>
  );
}

/** Selo lacrado — convite */
export function Seal(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="7.5" strokeDasharray="1.6 2.1" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 9.4 13.1 11l1.8.3-1.3 1.3.3 1.8-1.9-.9-1.9.9.3-1.8L9.1 11.3l1.8-.3z" />
    </Icon>
  );
}

/** Coroa — nobreza */
export function Crown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8.5 6.8 13 12 6l5.2 7 3.3-4.5L19 18H5z" />
      <path d="M5 20.5h14" />
    </Icon>
  );
}

/** Marcador de página — coleção */
export function Bookmark(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" />
      <path d="M9.5 8.5h5" />
    </Icon>
  );
}

export function Bag(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 8h15l-1.1 12.5H5.6z" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    </Icon>
  );
}

/** Carimbo postal — assinatura / newsletter */
export function Stamp(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 6.5h17v11h-17z" strokeDasharray="2 2.4" />
      <path d="M7 10.5h6M7 13.5h4" />
      <circle cx="17" cy="12" r="1.6" />
    </Icon>
  );
}

/** Rota de entrega — frete */
export function Route(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="6.5" r="2.2" />
      <circle cx="18" cy="17.5" r="2.2" />
      <path d="M8.2 6.5H14a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h5.8" strokeDasharray="2.4 2.6" />
    </Icon>
  );
}

export function Lock(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4.5" y="10" width="15" height="10" rx="1.2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14v2.5" />
    </Icon>
  );
}

export function Plus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function Minus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />
    </Icon>
  );
}

export function Menu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8h17M3.5 16h17" />
    </Icon>
  );
}

/** Marca — hélice reduzida a glifo */
export function HelixMark({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M8 2c0 3.3 8 6.7 8 10s-8 6.7-8 10" />
      <path d="M16 2c0 3.3-8 6.7-8 10s8 6.7 8 10" opacity="0.55" />
      <path d="M9.4 6.5h5.2M8.2 12h7.6M9.4 17.5h5.2" opacity="0.7" />
    </svg>
  );
}
