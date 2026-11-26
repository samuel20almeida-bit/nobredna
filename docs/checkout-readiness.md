# NobreDNA — preparação comercial, novembro de 2026

O modo público de consulta permanece ativo. As vendas reais ficam bloqueadas;
nenhuma credencial de pagamento, endereço oficial ou dado comercial foi inventado.

## Resultado da revisão técnica — 25/11/2026

- Build Next.js e TypeScript: exitosos (20 páginas geradas).
- Seis testes unitários/mocks: aprovados, incluindo payload e resposta do Mercado Pago simulado, bloqueios de configuração e conferência de totais.
- Quatro scripts de teste SQL (checkout, commerce, fulfillment, maintenance): aprovados em transações revertidas no projeto dedicado. Reserva, idempotência, valor/moeda, reembolso, permissões, expedição e fila foram exercitados.
- Oito verificações HTTP: cinco páginas responderam 200 e os três endpoints comerciais responderam 503 em preview.
- O teste automatizado de navegador está em `tests/browser-smoke.mjs` (1440×900 e 390×844). Não foi concluído neste ambiente porque o executável do Chromium não estava disponível.
- Nenhuma migração adicional foi persistida no banco existente; ele continuou sem livros, pedidos e administradores após o rollback. A versão publicada permanece em consulta e sem cobranças reais.

## Entrega técnica

| Área | Implementação |
| --- | --- |
| Catálogo | Livros publicados explicitamente no banco, busca por título/autoria, disponibilidade, sacola persistente, controle de quantidade. |
| Checkout | CEP, endereço, cotação, total revalidado no servidor, tentativa idempotente, reserva atômica de estoque. |
| Pagamento | Criação de preferência, URL de retorno confiável, assinatura de webhook, consulta à API oficial, reconciliação de eventos e revisão de divergências. |
| Frete | Adapter Melhor Envio, recotação antes de cobrar, timeout, validação de respostas; estimativas não são aceitas para cobrança. |
| Administração | Cadastro, publicação, edição com controle de concorrência, pedidos, rastreio e expedição após pagamento confirmado. |
| Central comercial | Indicadores por data de pagamento confirmado, ranking de livros, estoque publicado e fila de pedidos com ficha de expedição, histórico e pós-venda. Intenções de compra ficam em área separada. |
| Notificações | Confirmação de compra e despacho, fila transacional, tentativas e idempotência; não enviar para pedidos não pagos ou sob revisão. |
| Manutenção | Limpeza manual de reservas expiradas que nunca chegaram ao provedor; preserva reservas com pagamento iniciado. |
| Proteção | RLS, rotas restritas ao backend, limitação de requisições, segredos não expostos, bloqueio de cobrança em previews e recusa a conexão com outro projeto Supabase. |

## Checklist antes da ativação

- [ ] Aprovar a implantação das migrações `fulfillment.sql` e `maintenance.sql` no projeto dedicado. Não aplicar em projetos Aura ou outros clientes.
- [ ] Conectar o banco à Vercel e confirmar login da administradora autorizada; proibir cadastro público. Validar acesso negado a não administradores.
- [ ] Confirmar livros vendáveis, autoria, ISBN, capa, descrição, preço, estoque e dimensões com embalagem.
- [x] Receber CNPJ, endereço comercial, e-mail, telefone e política de trocas/devoluções (25/11/2026). Razão social completa ainda precisa ser confirmada.
- [ ] Confirmar se o endereço comercial também é o de expedição e confirmar o prazo de postagem; configurar origem de envio e remetente.
- [ ] Configurar contas comerciais e credenciais em segredos do ambiente correto; webhook Mercado Pago do tópico payment, preferências e Melhor Envio.
- [ ] Usar conta de teste do Mercado Pago, sandbox de frete e banco de testes segregado; validar sucesso, recusa, Pix/boleto, notificações duplicadas, interrupção, estoque concorrente e reembolso.
- [ ] Confirmar regra de expiração de pagamentos assíncronos, conciliar reservas iniciadas antes de liberar estoque e programar manutenção periódica.
- [ ] Configurar domínio verificado e caixa de resposta do Resend. Testar aceitação/entrega e tratamento de falhas, sem enviar a clientes fictícios.
- [ ] Revisar política de privacidade, retenção de pedidos e validar emissão fiscal e processo de postagem conforme o negócio.
- [x] Implementar a central inicial de pós-venda no próprio site, com protocolo imediato e painel privado de acompanhamento, separado da fila editorial e de intenções de compra.
- [ ] Antes de habilitar pagamentos, validar o fluxo real de resposta da equipe em até cinco dias, a entrega de e-mails após verificar o domínio e a execução de cancelamento/estorno e logística reversa no provedor; o painel não executa estornos.
- [ ] Definir compra de etiquetas e rastreamento com a equipe; a integração atual cota frete e registra código manualmente.
- [ ] Validar logs de produção, alertas de pagamentos em revisão e filas pendentes. Acompanhar a primeira compra real.
- [ ] Somente com aprovação, habilitar `ENABLE_LIVE_CHECKOUT=true` e os modos de produção, após os testes.

## Riscos que não podem ser ignorados

- Aprovação de pagamento não pode ser inferida pela URL do navegador.
- Liberação de reserva após tentativa de pagamento exige conciliação, não simplesmente o vencimento local.
- Não compartilhar a chave secreta do banco ou tokens de pagamento/entrega. Usar o projeto exclusivo e credenciais restritas quando suportadas.
- O aceite do e-mail pelo Resend não comprova entrega ao destinatário; configurar monitoramento antes de comercializar.
- As rotas de compra permanecem bloqueadas na prévia e por padrão, mesmo que algumas credenciais estejam presentes.
