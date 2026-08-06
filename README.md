# Nobre DNA Assessoria Editorial

Site da assessoria editorial: catálogo, página de livro, convite à publicação
e checkout com Mercado Pago e frete pelo Melhor Envio.

Next.js 15 (App Router) · Tailwind CSS 4 · Framer Motion · deploy na Vercel.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # opcional — o site roda sem credencial
npm run dev
```

Sem `MELHOR_ENVIO_TOKEN` o checkout usa uma tabela local de estimativa e
marca a resposta como simulada na interface. Sem `MERCADOPAGO_ACCESS_TOKEN`
o pedido é montado e conferido no servidor, mas nenhuma cobrança acontece —
a tela diz isso explicitamente em vez de fingir uma aprovação.

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | Criar a preferência de pagamento (server-side). |
| `MELHOR_ENVIO_TOKEN` | Cotar frete em `/api/v2/me/shipment/calculate`. |
| `MELHOR_ENVIO_BASE_URL` | `https://sandbox.melhorenvio.com.br` ou produção. |
| `MELHOR_ENVIO_USER_AGENT` | Exigido pela API — nome e e-mail de contato. |
| `ORIGEM_CEP` | CEP de expedição da editora. |
| `NEXT_PUBLIC_SITE_URL` | Base das `back_urls` do Mercado Pago. |

Em produção, `checkoutUrl` usa `init_point`; fora dela, `sandbox_init_point`.

## Desenho do sistema visual

**A hélice é o fio condutor.** `lib/helix.ts` gera a geometria e
`components/helix.tsx` a desenha; as três aparições são a mesma peça em
escalas diferentes — larga no hero, média no trilho da home
(`components/helix-rail.tsx`), fina na lateral da página de livro e mínima
no checkout. O movimento é translação no próprio eixo, que lê como rotação e
custa só um `transform`.

**O livro que abre é o motivo de revelação.** `components/opening.tsx` é o
primitivo: duas faces com dobradiça no centro e um miolo revelado. O hero o
usa como capa de livro; a página "Publique seu livro" o reusa como lacre que
se parte ao meio. Mesmo easing, mesma mecânica, superfície diferente.

**Ritmo por seção**, deliberadamente diferente:

| Seção | Tempo | Mecanismo |
| --- | --- | --- |
| Hero | lento, cinematográfico | delays escalonados de 0,35s a 2,7s |
| Acervo | rápido | 0,32s por item, 40ms de intervalo |
| Coleções | médio, editorial | revelação por corte horizontal (`clip-path`) |
| Testemunhos | lento, contemplativo | palavra a palavra, saindo de desfoque |
| Carta mensal | seco | troca de estado, sem contemplação |

**Sem foto de banco.** As capas são geradas em CSS/SVG
(`components/book-cover.tsx`), com tipografia em `cqw` — a mesma capa serve o
grid do acervo, a página do livro e a miniatura de 76px da sacola. Textura é
grão dourado em `feTurbulence`; ícones são line-art autoral
(`components/icons.tsx`).

**Sombras por hierarquia:** `--shadow-rule`, `--shadow-card`,
`--shadow-book`, `--shadow-seal`, `--shadow-panel` em `app/globals.css`.
Nenhuma é aplicada duas vezes em papéis diferentes.

## Integrações

- `POST /api/frete/cotacao` — recebe `{ cep, itens: [{slug, qty}] }`. Preço,
  peso e dimensões vêm do catálogo no servidor; o navegador só informa o que
  quer comprar.
- `POST /api/checkout/preferencia` — revalida a sacola, **recota o frete no
  servidor** (o valor escolhido no cliente nunca é aceito como verdade) e cria
  a preferência do Mercado Pago com `X-Idempotency-Key`.
- `POST /api/carta` e `POST /api/proposta` — validam e registram; o ponto de
  integração com provedor de e-mail/CRM está marcado no código.

## O que ainda falta para produção

- Webhook do Mercado Pago (`/api/checkout/webhook`) para confirmar pagamento
  de forma assíncrona — hoje o retorno depende das `back_urls`.
- Persistência de pedidos (nenhum banco está conectado).
- Compra da etiqueta no Melhor Envio após a aprovação do pagamento.
- Provedor de e-mail para a carta mensal e para as propostas de manuscrito.
