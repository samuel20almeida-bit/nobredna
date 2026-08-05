"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Helix } from "@/components/helix";

/**
 * Trilho da hélice: fica fixo na lateral e acompanha o scroll da página inteira,
 * costurando as seções umas nas outras. É a continuação do fio que nasce no hero
 * — por isso vive do mesmo lado da tela e usa o mesmo desenho, só mais fino.
 */
export function HelixRail({
  side = "right",
  width = 54,
  /** ponto do scroll (0–1) em que o trilho termina de aparecer */
  fadeIn = 0.12,
  /** opacidade no topo da página — 0 quando o hero já tem a sua própria hélice */
  from = 0,
}: {
  side?: "left" | "right";
  width?: number;
  fadeIn?: number;
  from?: number;
}) {
  const { scrollY, scrollYProgress } = useScroll();

  const raw = useTransform(scrollY, (v) => -v * 0.42);
  const y = useSpring(raw, { stiffness: 80, damping: 26, restDelta: 0.5 });
  const opacity = useTransform(
    scrollYProgress,
    [0, fadeIn, 0.9, 1],
    [from, 1, 1, 0.35],
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, [side]: 0, width }}
      className="pointer-events-none fixed inset-y-0 z-30 hidden lg:block"
    >
      <Helix
        className="h-full w-full"
        width={width}
        viewHeight={900}
        overdraw={3}
        turns={7}
        rungsPerTurn={8}
        strokeWidth={0.9}
        intensity={0.55}
        y={y}
      />
    </motion.div>
  );
}
