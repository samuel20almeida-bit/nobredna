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
    q: "Quanto custa?",
    a: "Depende do original: preparar um romance de 400 páginas escrito com pressa não custa o mesmo que revisar 140 páginas de poesia já maduras. Por isso o valor só aparece depois da leitura, discriminado por etapa, e você escolhe quais contratar. O diagnóstico que gera esse orçamento é gratuito.",
  },
  {
    id: "pronto",
    q: "Preciso ter o original terminado?",
    a: "Não. Trabalhamos com originais concluídos e também com projetos em andamento — nesse caso o parecer trata do plano da obra tanto quanto do que já está escrito, e às vezes a conversa começa antes de existir capítulo nenhum.",
  },
  {
    id: "prazo",
    q: "Quanto tempo até uma resposta?",
    a: "O parecer de diagnóstico sai em até 30 dias do envio do original. O prazo do trabalho em si vai na proposta, etapa a etapa: uma preparação leva de seis a doze semanas, um projeto gráfico de quatro a oito.",
  },
  {
    id: "direitos",
    q: "Quem fica com os direitos da obra?",
    a: "O autor, integralmente e desde sempre. O ISBN sai no nome dele, os arquivos fechados são entregues a ele e não há cessão de direitos em nenhuma etapa. A casa presta serviço; não vira sócia do seu livro.",
  },
  {
    id: "genero",
    q: "Vocês atendem ficção, poesia, primeiro livro?",
    a: "Os três. Já passaram por aqui ensaio, romance, poesia e correspondência reunida, e metade era estreia. O que a casa sabe fazer bem é assunto de origem, linhagem e herança — se o seu livro é de outro território, dizemos isso no diagnóstico em vez de aceitar o trabalho.",
  },
  {
    id: "tiragem",
    q: "E depois de pronto, como o livro circula?",
    a: "A tiragem é decisão da autora — em geral entre 300 e 3.000 exemplares. A casa cota a gráfica, acompanha a prova e, se contratada para isso, coloca o título em livrarias independentes, nas plataformas digitais e nesta loja, repassando à autora o valor de cada venda menos a comissão combinada em contrato.",
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
