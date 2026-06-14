-- =============================================================================
-- Audience Suite — Migration 0001: fundação multi-tenant (Onda W0)
--
-- Ver docs/creator-hub-master.md, seções 11, 19, 20 e 42 (W0).
--
-- Esta migration cria:
--   - tenants
--   - users (perfis internos, ligados a auth.users do Supabase)
--   - creator_profiles
--   - social_links
--   - subscriptions
--   - billing_events
--   - tenant_entitlements
--   - tenant_runtime_status
--
-- Todas as tabelas de domínio têm tenant_id e RLS habilitada.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensões necessárias
-- -----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- tenants
-- -----------------------------------------------------------------------------
create table if not exists tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  plan text not null default 'starter'
    check (plan in ('starter', 'pro', 'business', 'enterprise')),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table tenants is 'Cada linha representa um criador/canal/cliente (seção 19.1).';

-- -----------------------------------------------------------------------------
-- users — perfis internos da plataforma, ligados a auth.users
-- -----------------------------------------------------------------------------
create table if not exists users (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null references tenants (id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'owner'
    check (role in ('platform_admin', 'owner', 'editor', 'analyst')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table users is 'Usuários internos (painel do criador). Papéis em seção 21.';

-- -----------------------------------------------------------------------------
-- creator_profiles — dados públicos do app do criador
-- -----------------------------------------------------------------------------
create table if not exists creator_profiles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null unique references tenants (id) on delete cascade,
  display_name text,
  description text,
  logo_url text,
  banner_url text,
  primary_color text default '#111827',
  secondary_color text default '#ffffff',
  app_icon_url text,
  custom_domain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- social_links
-- -----------------------------------------------------------------------------
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  platform text not null
    check (platform in (
      'youtube', 'instagram', 'tiktok', 'discord',
      'whatsapp', 'telegram', 'website', 'store', 'other'
    )),
  label text,
  url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_social_links_tenant on social_links (tenant_id);

-- -----------------------------------------------------------------------------
-- subscriptions — assinatura do tenant (placeholder até a Onda W2 / Stripe real)
-- -----------------------------------------------------------------------------
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  plan_id text not null default 'starter',
  billing_provider text not null default 'manual'
    check (billing_provider in ('stripe', 'manual')),
  provider_customer_id text,
  provider_subscription_id text,
  status text not null default 'trialing'
    check (status in (
      'trialing', 'active', 'past_due', 'limited', 'suspended', 'canceled'
    )),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_tenant on subscriptions (tenant_id);

-- -----------------------------------------------------------------------------
-- billing_events — log de eventos do provedor de billing (seção 11.12)
-- -----------------------------------------------------------------------------
create table if not exists billing_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants (id) on delete cascade,
  subscription_id uuid references subscriptions (id) on delete set null,
  event_type text not null,
  provider_event_id text,
  payload jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_billing_events_tenant on billing_events (tenant_id);

-- -----------------------------------------------------------------------------
-- tenant_entitlements — feature flags por plano/tenant (seção 11.10)
-- -----------------------------------------------------------------------------
create table if not exists tenant_entitlements (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default true,
  limit_value integer,
  used_value integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, feature_key)
);

create index if not exists idx_entitlements_tenant on tenant_entitlements (tenant_id);

-- -----------------------------------------------------------------------------
-- tenant_runtime_status — o que o runtime-config retorna (seção 11.12)
-- -----------------------------------------------------------------------------
create table if not exists tenant_runtime_status (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null unique references tenants (id) on delete cascade,
  billing_status text not null default 'trialing'
    check (billing_status in (
      'trialing', 'active', 'past_due', 'limited', 'suspended', 'canceled'
    )),
  app_status text not null default 'active'
    check (app_status in ('active', 'limited', 'suspended', 'archived')),
  suspension_reason text,
  public_message text,
  show_official_links boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Trigger genérica para updated_at
-- -----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'tenants', 'users', 'creator_profiles', 'social_links',
    'subscriptions', 'tenant_entitlements', 'tenant_runtime_status'
  ])
  loop
    execute format(
      'create trigger trg_set_updated_at before update on %I
       for each row execute function set_updated_at();',
      t
    );
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- Princípio (seção 20): "Usuário autenticado só vê dados do tenant ao qual
-- pertence." A função abaixo lê o tenant_id do usuário autenticado a partir
-- da tabela `users`.
-- -----------------------------------------------------------------------------
create or replace function auth_tenant_id()
returns uuid as $$
  select tenant_id from users where id = auth.uid();
$$ language sql stable security definer;

alter table tenants enable row level security;
alter table users enable row level security;
alter table creator_profiles enable row level security;
alter table social_links enable row level security;
alter table subscriptions enable row level security;
alter table billing_events enable row level security;
alter table tenant_entitlements enable row level security;
alter table tenant_runtime_status enable row level security;

-- tenants: usuário vê apenas o próprio tenant
create policy tenants_select_own on tenants
  for select using (id = auth_tenant_id());

-- users: usuário vê apenas usuários do próprio tenant
create policy users_select_own_tenant on users
  for select using (tenant_id = auth_tenant_id());

-- Tabelas de domínio: select/insert/update/delete restritos ao próprio tenant
create policy creator_profiles_all_own_tenant on creator_profiles
  for all using (tenant_id = auth_tenant_id())
  with check (tenant_id = auth_tenant_id());

create policy social_links_all_own_tenant on social_links
  for all using (tenant_id = auth_tenant_id())
  with check (tenant_id = auth_tenant_id());

create policy subscriptions_select_own_tenant on subscriptions
  for select using (tenant_id = auth_tenant_id());

create policy billing_events_select_own_tenant on billing_events
  for select using (tenant_id = auth_tenant_id());

create policy entitlements_select_own_tenant on tenant_entitlements
  for select using (tenant_id = auth_tenant_id());

create policy runtime_status_select_own_tenant on tenant_runtime_status
  for select using (tenant_id = auth_tenant_id());

-- Observação: o endpoint público runtime-config (rota de API) usa a
-- service role key (que ignora RLS) e filtra explicitamente por slug/tenant_id
-- no código da aplicação — ver src/app/api/v1/tenants/[slug]/runtime-config/route.ts.
-- Políticas de acesso do "platform_admin" (acesso a todos os tenants) serão
-- adicionadas na Onda W5 (painel admin orientado a exceções).
