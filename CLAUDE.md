# Audience Suite — Contexto do projeto para o Claude Code
<!-- v1.9 — 2026-06-13: W1 iniciada — migration 0002, onboarding wizard, edição de perfil, CRUD de links, cadastro de fã LGPD -->

Este arquivo é o ponto de entrada de contexto para qualquer sessão de Claude Code neste
repositório. Leia também `docs/creator-hub-master.md` (documento-mestre v1.7) antes de
implementar qualquer funcionalidade nova — ele é a fonte de verdade do produto.

> **Versão deste arquivo: v1.9** — atualize o número de versão e o comentário do cabeçalho
> sempre que modificar este arquivo.

## O que é o projeto

Audience Suite é uma plataforma SaaS multi-tenant, white-label e global, que permite a criadores de
conteúdo criar seu app/PWA oficial: um hub de audiência, CRM e organização de links oficiais para
YouTube, Instagram, TikTok, Discord, WhatsApp e Telegram. O produto **não** substitui essas redes
— ele organiza a audiência e direciona o fã para os canais oficiais.

## Estado atual — W0 concluída

A Onda 0 (W0) está completa. Foram entregues:

- Next.js (App Router) + TypeScript + Tailwind
- Roteamento i18n com next-intl, idioma padrão `en`, locales: en, pt-br, es, ja-jp (apenas `en`
  com conteúdo real nesta onda)
- Schema inicial do Supabase (`supabase/migrations/0001_init.sql`): tenants, users,
  creator_profiles, social_links, subscriptions, billing_events, tenant_entitlements,
  tenant_runtime_status — com RLS habilitada por tenant_id
- Endpoint público `GET /api/v1/tenants/{slug}/runtime-config` (seção 11.8 do doc-mestre)
- Supabase Auth: signup cria tenant + user + creator_profile + tenant_runtime_status
  atomicamente via service role, com rollback completo em caso de falha em qualquer etapa
- Dashboard protegido do criador em `/[locale]/dashboard`
- PWA público do fã em `/[locale]/app/[slug]` — consome runtime-config; exibe tela neutra se
  `app_status = suspended` (nunca um erro técnico)
- Callback de confirmação de e-mail em `/api/auth/callback`
- Middleware combinado: refresh de sessão Supabase + proteção de rotas + roteamento i18n
- Identidade visual Audience Suite: cores navy `#1e293b` e teal `#0d9488` em `tailwind.config.js`;
  logos em `public/brand/` (`logo-icon.svg`, `logo-light.svg`, `logo-dark.svg`)

### Pendências do lado do usuário (não automatizáveis)

1. Rodar `npm install` no terminal
2. Preencher `.env.local` com as credenciais reais do Supabase
3. Aplicar `supabase/migrations/0001_init.sql` e `supabase/seed.sql` no painel do Supabase
4. Para dev local: desabilitar confirmação de e-mail em Supabase → Auth → Settings
   (**reabilitar antes de ir para produção**)

## Regras estruturais que NÃO podem ser quebradas

1. **Multi-tenant sempre.** Toda tabela de domínio tem `tenant_id`. Nunca consultar dados sem
   filtrar por tenant (RLS deve garantir isso no banco, não só na aplicação).
2. **O app/PWA nunca tem conteúdo fixo no código.** Agenda, links, patrocinadores, tema e
   feature flags vêm sempre do `runtime-config`.
3. **billing_status e app_status são independentes** (ver seção 11.3 do documento-mestre).
   `billing_status` reflete a situação financeira; `app_status` reflete o que o fã vê.
4. **Suspensão nunca é um erro técnico.** Se `app_status = suspended`, o PWA mostra uma tela
   neutra ("Este app está temporariamente indisponível") com links oficiais, nunca um 500 ou
   tela branca.
5. **billing_provider é uma abstração.** Mesmo usando Stripe, código de domínio nunca deve
   assumir Stripe diretamente — sempre passar por essa camada (`stripe` | `manual`).

## Ordem de trabalho recomendada

Siga as ondas da seção 42 do documento-mestre (W0 → W7). Ao final de cada onda, resuma o que foi
feito e o que falta antes de seguir para a próxima. Não pule para billing (W2) ou i18n completo
(W4) antes de a fundação (W0) estar sólida e publicada.

**W1 em andamento** — itens entregues:
- `supabase/migrations/0002_w1_fan_events.sql`: tabelas `events`, `fans`, `fan_consents` com RLS
- `/[locale]/onboarding`: wizard 3 passos (perfil → cor → primeiro link), rota protegida
- `/[locale]/dashboard/profile`: edição de `creator_profiles` (display_name, description, cores, logos)
- `/[locale]/dashboard/links`: CRUD de `social_links` (add, toggle active, delete)
- `/api/v1/tenants/[slug]/fans`: cadastro de fã público com consentimento LGPD granular
- PWA: formulário de cadastro de fã com checkboxes `terms` (obrigatório) + `email_marketing`
- Signup agora redireciona para `/onboarding` em vez de `/dashboard`
- Dashboard mostra banner "Complete setup" se bio ou links estiverem vazios

**Próxima onda: W2** — Stripe billing (Checkout, Webhooks, Customer Portal).

## Stack

- Frontend/Backend: Next.js (App Router), TypeScript, Tailwind, deploy na Vercel
- Banco/Auth: Supabase (Postgres, Auth, Storage, RLS, Edge Functions)
- Billing: Stripe (Checkout, Billing, Customer Portal, Tax, Webhooks) — a partir da W2
- i18n: next-intl
- Push: OneSignal — a partir da W3
- E-mail transacional: Resend ou Postmark — a partir da W5
- Monitoramento: Sentry, PostHog, Better Uptime — a partir da W5

## Notas de implementação importantes

- O middleware (`src/middleware.ts`) importa `createServerClient` **diretamente** de `@supabase/ssr`
  (não de `@/lib/supabase/ssr`) porque o Edge Runtime não suporta `next/headers`.
- Clientes Supabase: `src/lib/supabase/ssr.ts` (cookie-based, Server Components/Actions),
  `src/lib/supabase/browser.ts` (Client Components), `src/lib/supabase/server.ts` (service role).
- Confirmação de e-mail: se desabilitada no Supabase, `data.session` estará presente após
  `signUp()` e o usuário é redirecionado direto para o dashboard. Se habilitada, a tela de
  "verifique seu e-mail" é exibida e o callback `/api/auth/callback` troca o code pela sessão.

## Nomes de coluna reais do schema (migration é a fonte de verdade)

O doc-mestre v1.7 contém nomes de coluna incorretos em algumas seções. Sempre usar:

- `creator_profiles`: `display_name`, `description`, `logo_url`, `banner_url`, `primary_color`,
  `secondary_color`, `app_icon_url`, `custom_domain` — **não** `bio` nem `avatar_url`.
- `social_links`: `is_active` (boolean), `sort_order` (integer) — **não** `active` nem `position`.
- `tenant_runtime_status.billing_status`: `trialing | active | past_due | limited | suspended | canceled`
  — **não** tem `manual`. O valor `manual` pertence a `subscriptions.billing_provider`.

## W1 — modelo de consentimento do fã (v1.7)

Usar **duas tabelas** separadas: `fans` + `fan_consents`. Não usar `fan_subscriptions`.
`fan_consents` armazena um registro por finalidade de consentimento (`terms`, `email_marketing`,
`push_notification`, `sponsor_offers`) para atender granularidade LGPD.
