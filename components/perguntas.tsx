"use client";

import { useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useAccordion,
  useAutoHeight,
  type AccordionHeaderProps,
  type AccordionPanelProps,
} from "@/components/ui/accordion";

type Pergunta = { id: string; q: string; a: string };

const perguntas: Pergunta[] = [
  {
    id: "custo",
    q: "Publicar com a casa tem algum custo para o autor?",
    a: "Nenhum. A editora assume impressão, edição, projeto gráfico e distribuição do que aceita. Se em algum momento aparecer uma proposta de pacote pago com o nosso nome, não é nossa.",
  },
  {
    id: "pronto",
    q: "Preciso ter o manuscrito terminado?",
    a: "Não necessariamente. Aceitamos originais concluídos e também projetos com estrutura fechada e ao menos um terço escrito — nesse caso, o parecer trata do plano da obra tanto quanto do texto existente.",
  },
  {
    id: "prazo",
    q: "Quanto tempo até uma resposta?",
    a: "Até 60 dias corridos, contados do envio do manuscrito completo. Toda proposta recebe parecer escrito de dois pareceristas, inclusive quando a resposta é não — é a parte do trabalho que leva mais tempo e a que nos parece inegociável.",
  },
  {
    id: "direitos",
    q: "Quem fica com os direitos da obra?",
    a: "O autor. O contrato é de cinco anos, com direitos revertendo integralmente ao fim do período. Direitos autorais são de 12% sobre o preço de capa nas vendas diretas e 10% nas livrarias, pagos semestralmente.",
  },
  {
    id: "genero",
    q: "Vocês publicam ficção, poesia, primeiro livro?",
    a: "Os três. O catálogo reúne ensaio, romance, poesia e correspondência, e metade dos títulos é de estreia. O que orienta a escolha é o assunto — origem, linhagem, continuidade, herança — e não o gênero nem o currículo.",
  },
  {
    id: "tiragem",
    q: "Qual é a tiragem e como o livro circula?",
    a: "Primeira tiragem entre 1.500 e 3.000 exemplares, conforme o título. A distribuição é em livrarias independentes, na loja da casa e no catálogo digital, sempre acompanhada da carta mensal aos leitores.",
  },
];

const DISCLOSE = { type: "spring", stiffness: 480, damping: 40, mass: 0.6 } as const;

function Linha({
  item,
  open,
  header,
  panel,
  index,
}: {
  item: Pergunta;
  open: boolean;
  header: AccordionHeaderProps;
  panel: AccordionPanelProps;
  index: number;
}) {
  const { ref, height, ready } = useAutoHeight();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current as (HTMLElement & { inert?: boolean }) | null;
    if (!el) return;
    el.inert = !open;
    return () => {
      el.inert = false;
    };
  }, [ref, open]);

  return (
    <div className="border-b border-almond/12">
      <div role="heading" aria-level={3}>
        <button
          {...header}
          className="flex w-full items-start gap-6 py-7 text-left outline-none"
        >
          <span className="mt-1 font-serif text-[0.85rem] tabular-nums text-khaki">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className={`flex-1 font-serif text-[clamp(1.1rem,2.1vw,1.4rem)] leading-snug transition-colors duration-500 ${
              open ? "text-almond" : "text-almond/85"
            }`}
          >
            {item.q}
          </span>

          {/* o mesmo gesto de abrir do resto do site, reduzido a um traço */}
          <motion.span
            aria-hidden="true"
            className="relative mt-2 block h-3 w-3 shrink-0 text-lavender"
            initial={false}
            animate={{ rotate: open ? 45 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
            <motion.span
              className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current"
              initial={false}
              animate={{ opacity: open ? 0.55 : 1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.span>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={ready ? { height: open ? height : 0 } : {}}
        transition={reduced ? { duration: 0 } : DISCLOSE}
        style={{ overflow: "hidden", height: ready ? undefined : open ? "auto" : 0 }}
      >
        <div {...panel} ref={ref}>
          <motion.p
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: open ? 0.5 : 0.2, ease: "easeOut" }}
            className="max-w-[54ch] pr-10 pb-8 pl-[3.1rem] text-[0.97rem] leading-[1.85] text-almond/55"
          >
            {item.a}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Ritmo da seção: resposta imediata ao toque, texto que se abre com peso.
 * O indicador é um traço que vira cruz — a mesma ideia de "abrir" do livro e
 * do lacre, no menor tamanho possível.
 */
export function Perguntas() {
  const entries = useMemo(() => perguntas.map(({ id }) => ({ id })), []);
  const { isOpen, headerProps, panelProps } = useAccordion({
    items: entries,
    type: "single",
    defaultOpen: ["custo"],
  });

  return (
    <div className="border-t border-almond/12">
      {perguntas.map((item, i) => (
        <Linha
          key={item.id}
          item={item}
          index={i}
          open={isOpen(item.id)}
          header={headerProps(item.id)}
          panel={panelProps(item.id)}
        />
      ))}
    </div>
  );
}
