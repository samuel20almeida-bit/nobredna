"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type OpeningProps = {
  /** face esquerda (capa / metade do selo) */
  left: ReactNode;
  /** face direita */
  right: ReactNode;
  /** o que é revelado entre as faces */
  inner: ReactNode;
  open: boolean;
  /** ângulo de abertura em graus */
  angle?: number;
  duration?: number;
  delay?: number;
  className?: string;
  innerClassName?: string;
};

/**
 * Padrão de revelação do site: duas faces com dobradiça no centro que abrem e
 * revelam o conteúdo interno.
 *
 * É o motivo do livro do hero, reaproveitado como transição — no selo da página
 * "Publique seu livro" as faces viram meio-selo em vez de meia-capa, mas a
 * mecânica e o easing são os mesmos, para o gesto ficar reconhecível.
 */
export function Opening({
  left,
  right,
  inner,
  open,
  angle = 74,
  duration = 1.6,
  delay = 0,
  className = "",
  innerClassName = "",
}: OpeningProps) {
  const reduced = useReducedMotion();
  const swing = reduced ? 0 : angle;
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: 2000, perspectiveOrigin: "50% 45%" }}
    >
      {/* miolo revelado */}
      <motion.div
        className={`absolute inset-0 ${innerClassName}`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={
          open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }
        }
        transition={{
          duration: duration * 0.8,
          delay: delay + duration * 0.45,
          ease,
        }}
      >
        {inner}
      </motion.div>

      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 origin-left [backface-visibility:hidden]"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: open ? -swing : 0 }}
        transition={{ duration, delay, ease }}
      >
        {left}
      </motion.div>

      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 origin-right [backface-visibility:hidden]"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: open ? swing : 0 }}
        transition={{ duration, delay: delay + 0.12, ease }}
      >
        {right}
      </motion.div>
    </div>
  );
}
