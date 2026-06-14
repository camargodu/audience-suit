# Creator Hub

Plataforma SaaS multi-tenant para criadores de conteúdo criarem seu app/PWA oficial: hub de
audiência, CRM e organização de links oficiais.

Documento de referência completo: [`docs/creator-hub-master.md`](./docs/creator-hub-master.md).
Contexto para o Claude Code: [`CLAUDE.md`](./CLAUDE.md).

## Status

Esqueleto inicial da **Onda 0 (W0)** — fundação: multi-tenant, autenticação, runtime-config e
landing mínima em inglês. Veja a seção 42 do documento-mestre para o plano completo (W0–W7).

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com/) (Postgres, Auth, Storage, RLS)
- [next-intl](https://next-intl-docs.vercel.app/) para internacionalização
- Deploy recomendado: [Vercel](https://vercel.com/)

## Pré-requisitos

- Node.js 18+
- Conta no Supabase (projeto criado)
- Conta na Vercel (para deploy, opcional nesta fase)
- Claude Code instalado (`npm install -g @anthropic-ai/claude-code`)

## Setup local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha com as credenciais do seu projeto
   Supabase (Project Settings → API):

   ```bash
   cp .env.example .env.local
   ```

3. Rode as migrations no seu projeto Supabase. Você pode colar o conteúdo de
   `supabase/migrations/0001_init.sql` no SQL Editor do Supabase, ou usar o Supabase CLI:

   ```bash
   supabase db push
   ```

4. Rode o projeto localmente:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000/en` para ver a landing mínima.

6. Teste o runtime-config (depois de criar um tenant via SQL/seed):

   ```bash
   curl http://localhost:3000/api/v1/tenants/<slug>/runtime-config
   ```

## Próximos passos

Abra este projeto no Claude Code e use o prompt da seção 31 do documento-mestre
(`docs/creator-hub-master.md`) para continuar a implementação a partir da Onda 0, seguindo o
plano de ondas da seção 42.
