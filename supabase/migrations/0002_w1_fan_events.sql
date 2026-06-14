-- =============================================================================
-- Audience Suite — Migration 0002: W1 — eventos, fãs e consentimento LGPD
--
-- Ver docs/creator-hub-master.md, seção 42 (W1).
--
-- Esta migration cria:
--   - events          : agenda/eventos do criador
--   - fans            : fãs cadastrados no PWA de cada tenant
--   - fan_consents    : consentimentos LGPD granulares por finalidade
-- =============================================================================

-- -----------------------------------------------------------------------------
-- events — agenda pública do criador
-- -----------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_tenant on events (tenant_id);
create index if not exists idx_events_starts_at on events (tenant_id, starts_at);

comment on table events is 'Eventos e agenda pública do criador (seção W1).';

-- -----------------------------------------------------------------------------
-- fans — fãs cadastrados no PWA público
-- -----------------------------------------------------------------------------
create table if not exists fans (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  email text not null,
  name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create index if not exists idx_fans_tenant on fans (tenant_id);

comment on table fans is 'Fãs cadastrados no PWA de cada tenant. Nunca compartilhado entre tenants.';

-- -----------------------------------------------------------------------------
-- fan_consents — consentimentos LGPD granulares
--
-- Um registro por (fan_id, purpose). O fã pode aceitar push mas recusar
-- e-mail de patrocinador — cada finalidade é independente.
-- Finalidades previstas: terms, email_marketing, push_notification, sponsor_offers
-- -----------------------------------------------------------------------------
create table if not exists fan_consents (
  id uuid primary key default uuid_generate_v4(),
  fan_id uuid not null references fans (id) on delete cascade,
  tenant_id uuid not null references tenants (id) on delete cascade,
  purpose text not null
    check (purpose in ('terms', 'email_marketing', 'push_notification', 'sponsor_offers')),
  granted boolean not null default false,
  ip_address text,
  user_agent text,
  granted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fan_id, purpose)
);

create index if not exists idx_fan_consents_fan on fan_consents (fan_id);
create index if not exists idx_fan_consents_tenant on fan_consents (tenant_id);

comment on table fan_consents is 'Consentimentos LGPD granulares por finalidade. Ver doc-mestre seção W1.';

-- -----------------------------------------------------------------------------
-- Triggers updated_at para novas tabelas
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  for t in select unnest(array['events', 'fans', 'fan_consents'])
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
-- -----------------------------------------------------------------------------
alter table events enable row level security;
alter table fans enable row level security;
alter table fan_consents enable row level security;

-- events: criador vê/gerencia apenas os eventos do próprio tenant
create policy events_all_own_tenant on events
  for all using (tenant_id = auth_tenant_id())
  with check (tenant_id = auth_tenant_id());

-- fans: criador vê os fãs do próprio tenant (somente leitura via RLS de usuário)
create policy fans_select_own_tenant on fans
  for select using (tenant_id = auth_tenant_id());

-- fan_consents: criador vê consentimentos do próprio tenant
create policy fan_consents_select_own_tenant on fan_consents
  for select using (tenant_id = auth_tenant_id());

-- Nota: insert/update em fans e fan_consents é feito via service role (rota pública
-- do PWA do fã não tem sessão autenticada). As políticas acima são para o
-- dashboard do criador visualizar os fãs cadastrados.
