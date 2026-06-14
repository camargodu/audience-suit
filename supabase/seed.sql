-- =============================================================================
-- Audience Suite — Seed de exemplo (apenas para testes locais)
--
-- Cria um tenant de exemplo com perfil, links sociais e status de runtime,
-- para testar GET /api/v1/tenants/exemplo/runtime-config
-- =============================================================================

insert into tenants (id, name, slug, plan, status)
values ('00000000-0000-0000-0000-000000000001', 'Canal Exemplo', 'exemplo', 'pro', 'active')
on conflict (slug) do nothing;

insert into creator_profiles (tenant_id, display_name, description, primary_color, secondary_color)
values (
  '00000000-0000-0000-0000-000000000001',
  'Canal Exemplo',
  'Canal de exemplo para testes do Audience Suite.',
  '#4f46e5',
  '#ffffff'
)
on conflict (tenant_id) do nothing;

insert into social_links (tenant_id, platform, label, url, is_active, sort_order)
values
  ('00000000-0000-0000-0000-000000000001', 'youtube', 'YouTube', 'https://youtube.com/@exemplo', true, 1),
  ('00000000-0000-0000-0000-000000000001', 'instagram', 'Instagram', 'https://instagram.com/exemplo', true, 2),
  ('00000000-0000-0000-0000-000000000001', 'whatsapp', 'Comunidade', 'https://wa.me/000000000', true, 3)
on conflict do nothing;

insert into tenant_runtime_status (tenant_id, billing_status, app_status, show_official_links)
values ('00000000-0000-0000-0000-000000000001', 'active', 'active', true)
on conflict (tenant_id) do nothing;

-- Para testar o estado "suspenso", rode:
-- update tenant_runtime_status
-- set billing_status = 'suspended', app_status = 'suspended',
--     public_message = 'Este app está temporariamente indisponível.'
-- where tenant_id = '00000000-0000-0000-0000-000000000001';
