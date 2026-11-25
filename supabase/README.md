# Fundação comercial — NobreDNA

1. Criar um projeto Supabase exclusivo da editora na organização confirmada pelo responsável.
2. Revisar e testar `setup.sql`, `checkout.sql`, `commerce.sql`, `fulfillment.sql`, `maintenance.sql`, `editorial-leads.sql` e `editorial-crm.sql`, nessa ordem, antes de aplicar ao projeto dedicado. Não executar em projetos de outras marcas.
3. Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` na Vercel. Não usar chave secreta ou `service_role` no navegador.
4. Desabilitar cadastros públicos no Auth, convidar a administradora com o e-mail confirmado e conceder acesso a seu UUID na tabela `store_admins` usando o painel administrativo do Supabase. Nunca cadastrar uma senha no código.
5. Testar login autorizado, usuário sem permissão, logout, cadastro, edição e restrições do banco. Conferir os avisos de segurança do Supabase. Não liberar compras até concluir essa validação.

O painel `/admin` está disponível após a conexão. Sem configuração, apenas informa que está em preparação. O catálogo é interno; os pedidos são somente de leitura. Não existe cadastro público, acesso anônimo aos dados ou alteração manual de pagamentos.

## Operação editorial

- O painel possui visão geral, interessados, coautorias, catálogo, pedidos/entregas e configurações. Os indicadores são derivados dos registros reais.
- A extensão CRM mantém as solicitações antigas e amplia o funil com proposta, negociação e encerramento sem avanço; anotações internas só podem ser acessadas por administradores autorizados.
- Em Configurações, o administrador autenticado pode estabelecer sua própria senha; o login também mantém a alternativa por link/código. Para a entrega definitiva, configurar SMTP dedicado e testar recuperação de acesso.
- Os formulários públicos registram pedidos de contato e fornecem protocolo, sem redirecionar para WhatsApp. A consulta de livros não efetua pagamento.

## Dados necessários para a primeira carga

- Títulos autorizados para venda, autores, sinopses e capas oficiais;
- ISBN, quando houver;
- Preço de venda, estoque e peso/dimensões (incluindo embalagem quando necessário para expedição);
- CEP e endereço de origem, política de envio e dados da editora;
- E-mail confirmado da administradora e endereço de envio de notificações.

## Reserva de pedidos

`checkout.sql` prepara funções transacionais exclusivas do backend para reservar o estoque, registrar itens e preços, controlar tentativas repetidas, e devolver estoque em reservas que nunca foram encaminhadas ao provedor. `lib/store-commerce.ts` prepara a leitura de preços e pesos diretamente do banco. Não conecta ainda à sacola pública nem abre pagamentos. Qualquer liberação de estoque após o início de um pagamento deverá ser conciliada com o provedor; expiração local não implica que o pagamento foi cancelado. A limpeza agendada de reservas expiradas ainda deverá ser configurada.

## Integração comercial

`commerce.sql` restringe o catálogo público a títulos ativos expressamente publicados pela administradora e adiciona conciliação de pagamento exclusiva do backend. A rota de checkout recota frete, reserva estoque, envia o valor verificado ao Mercado Pago; o webhook valida assinatura e consulta o estado na API do provedor. O retorno não confia no status da URL. Nenhuma cobrança fica habilitada sem a configuração de produção e `ENABLE_LIVE_CHECKOUT=true`.

Antes da ativação: configurar chave secreta do Supabase e tokens da editora nos segredos do ambiente de produção; conta Mercado Pago e webhook (evento `payment`), Melhor Envio, endereço e CEP de origem reais. Testar com ambiente de pagamento e banco isolados antes de mudar o flag. O checkout de produção valida o modo `production` e nunca aceita estimativa de frete.

## Próximas etapas, ainda não implementadas

- Validar a integração com as credenciais reais/sandbox e catálogo oficial. A limitação de requisições exige `STORE_RATE_LIMIT_SECRET`; só ativar após validação em Vercel.
- A manutenção do painel libera apenas reservas expiradas sem tentativa de pagamento (via `maintenance.sql`). As reservas encaminhadas ao provedor precisam ser conciliadas antes de liberar estoque. Configurar rotina agendada, alertas e procedimento de conciliação antes de ativar vendas.
- A expedição já tem registro de rastreio e fila de notificações em `fulfillment.sql`. Configurar remetente/domínio verificado e chave restrita de envio no Resend; validar confirmação, rastreio e recuperação de falhas. A fila permite tentativa manual pelo painel enquanto não houver rotina agendada.
- Validar políticas de privacidade, trocas e retenção de dados com a editora; realizar compra de teste antes de ativar a produção.

## Validação técnica

- `npm test` valida bloqueios de produção, dados de entrega, preço e resposta simulada do provedor; `npm run build` verifica compilação e tipagem.
- Os SQLs de teste em `supabase/tests` usam transações e terminam em rollback. Executar somente em banco dedicado de teste ou vazio e sem vendas habilitadas.
- Prévias Vercel não permitem checkout real, processamento de pagamentos, envios de e-mail nem acesso ao banco comercial mesmo com valores herdados do ambiente. Não adicionar credenciais comerciais reais em Preview.
- Antes de publicar a versão comercial, aplicar as migrações ainda pendentes, configurar um acesso backend exclusivo para a editora, validar RLS e confirmar a configuração de produção e os dados oficiais. Só então realizar o teste de ponta a ponta e avaliar mudar `ENABLE_LIVE_CHECKOUT`.
