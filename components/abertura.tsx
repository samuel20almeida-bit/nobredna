"use client";

import { useEffect, useRef, useState } from "react";
import { BrandSeal } from "@/components/brand-seal";

const SESSION_KEY = "nobredna:abertura-v2";

export function Abertura() {
  const [visible, setVisible] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (window.location.pathname !== "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (!started.current && sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch { /* a navegação continua mesmo sem storage */ }
    started.current = true;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="abertura" aria-hidden="true" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget) setVisible(false);
    }}>
      <div className="abertura-pagina">
        <div className="abertura-pagina-miolo">
          <span className="abertura-ornamento">✧</span>
          <span className="abertura-capitulo">O primeiro capítulo</span>
          <span className="abertura-fio" />
        </div>
      </div>
      <div className="abertura-capa">
        <div className="abertura-moldura" />
        <div className="abertura-moldura abertura-moldura-interna" />
        <div className="abertura-marca">
          <span className="abertura-ornamento">✦</span>
          <BrandSeal size={156} />
          <span className="abertura-nome">NobreDNA</span>
          <span className="abertura-linha">Casa de Legados</span>
          <span className="abertura-fio" />
        </div>
        <div className="abertura-reflexo" />
      </div>
    </div>
  );
}
