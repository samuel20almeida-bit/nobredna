# Fundação comercial — NobreDNA

1. Criar um projeto Supabase exclusivo da editora na organização confirmada pelo responsável.
2. Revisar e testar `setup.sql` em ambiente de teste antes de aplicar ao projeto dedicado. Não executar em projetos de outras marcas.
3. Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` na Vercel. Não usar chave secreta ou `service_role` no navegador.
4. Desabilitar cadastros públicos no Auth, convidar a administradora com o e-mail confirmado e conceder acesso a seu UUID na tabela `store_admins` usando o painel administrativo do Supabase. Nunca cadastrar uma senha no código.
5. Testar login autorizado, usuário sem permissão, logout, cadastro, edição e restrições do banco. Conferir os avisos de segurança do Supabase. Não liberar compras até concluir essa validação.

O painel `/admin` está disponível após a conexão. Sem configuração, apenas informa que está em preparação. O catálogo é interno; os pedidos são somente de leitura. Não existe cadastro público, acesso anônimo aos dados ou alteração manual de pagamentos.

## Dados necessários para a primeira carga

- Títulos autorizados para venda, autores, sinopses e capas oficiais;
- ISBN, quando houver;
- Preço de venda, estoque e peso/dimensões (incluindo embalagem quando necessário para expedição);
- CEP e endereço de origem, política de envio e dados da editora;
- E-mail confirmado da administradora e endereço de envio de notificações.

## Próximas etapas, ainda não implementadas

- Expor uma projeção pública somente de livros ativos; integrar sacola com dados reais.
- Criar pedidos, calcular valores no servidor e reservar estoque de forma atômica; liberar reservas expiradas ou canceladas.
- Integrar cotação de frete real, preferência Mercado Pago e confirmação verificada via webhook idempotente. Não confiar no retorno do navegador como confirmação de pagamento.
- Após pagamento confirmado, preparar pedido, registrar rastreio e enviar notificações. Validar fluxos de falha, cancelamento e reembolso.
- Validar políticas de privacidade, trocas e retenção de dados com a editora; realizar compra de teste antes de ativar a produção.
