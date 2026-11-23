import Image from "next/image";

/** Recriação conceitual do selo, isolada em fundo transparente. */
export function BrandSeal({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`brand-seal ${className}`} style={{ width: size }} aria-hidden="true">
      <Image src="/brand/selo-nobredna.webp" alt="" width={660} height={603} unoptimized priority={size >= 100} />
    </span>
  );
}
