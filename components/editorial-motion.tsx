"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function EditorialMotion() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("conteudo");
    if (!main) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("editorial-enter");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    const elements = main.querySelectorAll("section h2, .editorial-card, .editorial-letter");
    elements.forEach(el => {
      if (el.getBoundingClientRect().top >= window.innerHeight * .8) observer.observe(el);
    });
    main.classList.remove("editorial-page-enter");
    const frame = requestAnimationFrame(() => main.classList.add("editorial-page-enter"));
    return () => { cancelAnimationFrame(frame); observer.disconnect(); main.classList.remove("editorial-page-enter"); };
  }, [pathname]);
  return null;
}
