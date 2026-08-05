"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { helixGeometry } from "@/lib/helix";

type HelixProps = {
  /** largura do traçado no espaço do viewBox */
  width?: number;
  /** altura visível */
  viewHeight?: number;
  /** quantas alturas visíveis desenhar (folga para o translate) */
  overdraw?: number;
  turns?: number;
  rungsPerTurn?: number;
  strokeWidth?: number;
  /** deslocamento vertical em px do viewBox — normalmente vindo do scroll */
  y?: MotionValue<number> | number;
  className?: string;
  /** intensidade geral (0–1) */
  intensity?: number;
};

/**
 * Hélice de DNA em SVG — line-art dourado, sem preenchimento.
 * Usada em três escalas: hero (larga), trilho da home (média) e lateral da
 * página de produto (fina). É sempre o mesmo objeto, nunca um ornamento novo.
 */
export function Helix({
  width = 120,
  viewHeight = 800,
  overdraw = 2.4,
  turns = 6,
  rungsPerTurn = 9,
  strokeWidth = 1.25,
  y = 0,
  className,
  intensity = 1,
}: HelixProps) {
  const reduced = useReducedMotion();
  const drawnHeight = Math.round(viewHeight * overdraw);

  const geo = useMemo(
    () =>
      helixGeometry({
        width,
        height: drawnHeight,
        turns: Math.round(turns * overdraw),
        rungsPerTurn,
      }),
    [width, drawnHeight, turns, overdraw, rungsPerTurn],
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${viewHeight}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <motion.g style={{ y: reduced ? 0 : y }}>
        {/* fita traseira: mais apagada, cria profundidade sem sombra falsa */}
        <path
          d={geo.back}
          fill="none"
          stroke="#c9a24b"
          strokeOpacity={0.34 * intensity}
          strokeWidth={strokeWidth * 0.8}
          strokeLinecap="round"
        />

        {geo.rungs.map((rung, i) => (
          <line
            key={i}
            x1={rung.x1}
            y1={rung.y}
            x2={rung.x2}
            y2={rung.y}
            stroke="#e8d9a8"
            strokeOpacity={(0.1 + rung.depth * 0.42) * intensity}
            strokeWidth={strokeWidth * (0.45 + rung.depth * 0.3)}
            strokeLinecap="round"
          />
        ))}

        <path
          d={geo.front}
          fill="none"
          stroke="#c9a24b"
          strokeOpacity={0.85 * intensity}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </motion.g>
    </svg>
  );
}
