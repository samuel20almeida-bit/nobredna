import Image from "next/image";

/** Selo fotografado fornecido pela cliente. Sem traçado ou alteração da marca. */
export function BrandSeal({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`brand-seal ${className}`} style={{ width: size }} aria-hidden="true">
      <Image src="/brand/nobredna-seal.png" alt="" width={187} height={144} unoptimized priority={size >= 100} />
    </span>
  );
}
