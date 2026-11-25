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

O ambiente padrão é consulta: a livraria e a sacola encaminham o cliente
ao WhatsApp. A demonstração em `/checkout/demonstracao` utiliza dados ilustrativos;
não envia pedidos, não cobra e não depende das credenciais comerciais.
Os endpoints comerciais rejeitam compras fora da Vercel de produção e enquanto
`ENABLE_LIVE_CHECKOUT` não estiver ativo e configurado integralmente.

```bash
npm test
npm run build
```

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | Criar a preferência de pagamento (server-side). |
| `MERCADOPAGO_WEBHOOK_SECRET` | Verificar assinatura da notificação no servidor. |
| `MERCADOPAGO_MODE` | Deve ser `production` somente depois do teste real isolado. |
| `MELHOR_ENVIO_TOKEN` | Cotar frete em `/api/v2/me/shipment/calculate`. |
| `MELHOR_ENVIO_BASE_URL` | `https://sandbox.melhorenvio.com.br` ou produção. |
| `MELHOR_ENVIO_USER_AGENT` | Exigido pela API — nome e e-mail de contato. |
| `ORIGEM_CEP` | CEP de expedição da editora. |
| `NEXT_PUBLIC_SITE_URL` | Base das `back_urls` do Mercado Pago. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Projeto exclusivo da Casa e acesso sujeito a RLS. |
| `SUPABASE_SECRET_KEY` | Acesso de backend, nunca no navegador; precisa ser limitado ao projeto dedicado. |
| `STORE_RATE_LIMIT_SECRET` | Segredo para pseudonimizar buckets de limitação de requisições. |
| `RESEND_API_KEY`, `STORE_EMAIL_FROM`, `STORE_EMAIL_REPLY_TO` | E-mail transacional com remetente verificado. |
| `ENABLE_LIVE_CHECKOUT` | Padrão `false`: só modificar após aprovação e checklist. |

O modo de testes locais não faz chamadas externas. Credenciais de sandbox
devem ser usadas num ambiente isolado, nunca compartilhado com o banco real.

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
  servidor**, reserva estoque em transação e cria a preferência do Mercado Pago.
- `POST /api/checkout/webhook` — verifica a assinatura e consulta o pagamento
  na API oficial, reconcilia valor, moeda e referência sem confiar no retorno do
  navegador. O banco mantém o histórico de eventos e evita processamento duplicado.
- `/admin` — catálogo, publicação, estoque, pedidos, expedição e fila de e-mails.
- `POST /api/carta` e `POST /api/proposta` — validam e registram; o ponto de
  integração com provedor de e-mail/CRM está marcado no código.

## O que ainda falta para produção

- Aplicar migrações pendentes no banco exclusivo e configurar a conexão.
- Contas comerciais, catálogo oficial, administradora, endereço de origem e políticas.
- Testar a API de frete, pagamentos e envios em ambiente isolado com as credenciais reais de teste.
- Programar conciliação de reservas pendentes, rotina de e-mails e compra de etiquetas no Melhor Envio (a expedição e o rastreio manual estão preparados).
- Fazer compra piloto supervisionada antes de abrir o checkout ao público.
- Provedor de e-mail para a carta mensal e para as propostas de manuscrito (fora da etapa de checkout).

Consulte [o checklist comercial](docs/checkout-readiness.md) e [o guia de banco](supabase/README.md).
