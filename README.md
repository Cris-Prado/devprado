# DevPrado

Workspace Angular 21 com autenticação Supabase, cadastro por e-mail, entrada com senha e Google, dashboard protegido e logout. Anotações e configurações ainda não estão implementadas.

## Executar

Use Node.js 24 e npm. Instale as dependências e inicie:

```bash
npm ci
npm start
```

Abra http://localhost:4200. As configurações estão em `src/environments/environment.ts` (produção) e `environment.development.ts` (desenvolvimento).

## Configuração do Supabase

A aplicação utiliza apenas a URL do projeto e uma chave **publishable**, destinada ao navegador. Nunca coloque chaves `service_role`, secret keys, senha do banco ou credenciais do Google no frontend.

No painel do Supabase:

1. Para a etapa local, configure Authentication → URL Configuration com Site URL `http://localhost:4200`. Atualize esse valor quando publicar.
2. Autorize `http://localhost:4200/auth/callback` em Redirect URLs. Adicione o callback do domínio real quando publicar.
3. Habilite e-mail/senha e configure a confirmação por e-mail. O cadastro usa o link de confirmação padrão; modelos personalizados de OTP precisam de uma interface específica.
4. Para Google, ative o provedor em Authentication → Providers e configure o Client ID/Secret **somente no painel**. No Google Cloud, use o callback do provedor informado pelo Supabase.
5. Ative RLS e crie políticas apropriadas antes de conectar tabelas com dados de usuários. O guard Angular controla a navegação; as políticas do banco controlam o acesso aos dados.

O fluxo PKCE exige abrir o link de confirmação no mesmo navegador em que o cadastro foi iniciado. Após confirmar, a aplicação troca o código por uma sessão e abre o dashboard. Sem confirmação automática, o usuário recebe uma orientação para conferir o e-mail.

## Testar o login com Google em localhost:4200

O botão **Continuar com Google** está disponível no login e no cadastro e não exige preencher o formulário. Ele inicia OAuth pelo Supabase; o retorno para `/auth/callback` troca o código PKCE por uma sessão e abre `/dashboard`.

| Onde configurar                               | Campo                         | Valor nesta etapa                                           |
| --------------------------------------------- | ----------------------------- | ----------------------------------------------------------- |
| Supabase → Authentication → URL Configuration | Site URL                      | `http://localhost:4200`                                     |
| Supabase → Authentication → URL Configuration | Redirect URLs                 | `http://localhost:4200/auth/callback`                       |
| Google Auth Platform → cliente OAuth Web      | Authorized JavaScript origins | `http://localhost:4200`                                     |
| Google Auth Platform → cliente OAuth Web      | Authorized redirect URIs      | `https://mrwduatwasepqzfxbwmb.supabase.co/auth/v1/callback` |

O endereço de callback no Google é o do Supabase; o callback local é configurado no Supabase. O provedor Google deve estar habilitado com as credenciais do cliente Web correspondente. Se o aplicativo Google estiver em modo de teste, inclua a conta que utilizará como usuário de teste quando essa configuração for exigida pela audiência do aplicativo.

Execute `npm start`, abra `http://localhost:4200/login`, clique no botão e conclua a seleção da conta Google. Confira o perfil no dashboard, recarregue a página e teste **Sair da conta**. Use `localhost` durante todo o fluxo; não alterne com `127.0.0.1`.

Referências: [Google com Supabase](https://supabase.com/docs/guides/auth/social-sign-in/auth-google) e [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## Estrutura

- `core/services`: cliente Supabase e estado da autenticação.
- `core/guards`: proteção das rotas internas.
- `features/auth`: callback de autenticação.
- `pages`: login, cadastro e dashboard.
- `shared/components`: ícones e inputs compatíveis com Reactive Forms.
- `components`: navbar e sidebar.
- `styles/variables.css`: variáveis de estilo globais.

## Validar

```bash
npm run build
npm test -- --watch=false
```

O GitHub Actions executa os dois comandos em pull requests e alterações na main. Os testes usam mocks e não criam usuários reais.

Antes de publicar, valide manualmente cadastro e confirmação por e-mail, senha incorreta, login correto, Google, recarregamento do dashboard e logout. Esses cenários dependem das configurações reais do Supabase.

## Hospedagem

Publique o conteúdo de `dist/devprado/browser`. Configure o servidor para retornar `index.html` nas rotas da aplicação, inclusive `/auth/callback`, e servir os arquivos estáticos normalmente. Sem esse fallback, abrir ou atualizar uma rota diretamente pode retornar 404.
