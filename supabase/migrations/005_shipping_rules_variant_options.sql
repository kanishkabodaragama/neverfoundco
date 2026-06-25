create table if not exists public.variant_options (
  id uuid primary key default gen_random_uuid(),
  option_type text not null check (option_type in ('color', 'size', 'gender')),
  name text not null,
  color_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (option_type, name)
);

create table if not exists public.shipping_regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.shipping_countries(id) on delete cascade,
  region_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_id, region_name)
);

create table if not exists public.shipping_rules (
  id uuid primary key default gen_random_uuid(),
  rule_type text not null check (rule_type in ('international_default', 'country_default', 'country_region_override')),
  country_id uuid references public.shipping_countries(id) on delete cascade,
  region_ids jsonb not null default '[]'::jsonb,
  fee numeric(10, 2) not null default 0 check (fee >= 0),
  currency text not null default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists shipping_rules_one_international_default_idx
on public.shipping_rules(rule_type)
where rule_type = 'international_default' and is_active = true;

create unique index if not exists shipping_rules_country_default_idx
on public.shipping_rules(country_id)
where rule_type = 'country_default' and is_active = true;

create index if not exists shipping_regions_country_id_idx on public.shipping_regions(country_id);
create index if not exists shipping_rules_country_id_idx on public.shipping_rules(country_id);

drop trigger if exists set_variant_options_updated_at on public.variant_options;
create trigger set_variant_options_updated_at
before update on public.variant_options
for each row execute function public.set_updated_at();

drop trigger if exists set_shipping_regions_updated_at on public.shipping_regions;
create trigger set_shipping_regions_updated_at
before update on public.shipping_regions
for each row execute function public.set_updated_at();

drop trigger if exists set_shipping_rules_updated_at on public.shipping_rules;
create trigger set_shipping_rules_updated_at
before update on public.shipping_rules
for each row execute function public.set_updated_at();

alter table public.variant_options enable row level security;
alter table public.shipping_regions enable row level security;
alter table public.shipping_rules enable row level security;

drop policy if exists "Public can read variant options" on public.variant_options;
create policy "Public can read variant options"
on public.variant_options for select
using (true);

drop policy if exists "Admins manage variant options" on public.variant_options;
create policy "Admins manage variant options"
on public.variant_options for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active shipping regions" on public.shipping_regions;
create policy "Public can read active shipping regions"
on public.shipping_regions for select
using (
  exists (
    select 1
    from public.shipping_countries
    where shipping_countries.id = shipping_regions.country_id
      and shipping_countries.is_active = true
  ) or public.is_admin()
);

drop policy if exists "Admins manage shipping regions" on public.shipping_regions;
create policy "Admins manage shipping regions"
on public.shipping_regions for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active shipping rules" on public.shipping_rules;
create policy "Public can read active shipping rules"
on public.shipping_rules for select
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage shipping rules" on public.shipping_rules;
create policy "Admins manage shipping rules"
on public.shipping_rules for all
using (public.is_admin())
with check (public.is_admin());

insert into public.variant_options (option_type, name, color_value)
values
  ('color', 'Black', '#111111'),
  ('color', 'Blue', '#bfd0e4'),
  ('color', 'Blush', '#f4c6ca'),
  ('color', 'Brown', '#9b754d'),
  ('color', 'Cream', '#f3efe6'),
  ('color', 'Dark Navy Blue', '#03063a'),
  ('color', 'Green', '#2fdc65'),
  ('color', 'Ivory', '#f3efe6'),
  ('color', 'Mint', '#9af6d7'),
  ('color', 'Navy Blue', '#2f6da8'),
  ('color', 'Purple', '#a883ef'),
  ('color', 'Sage Green', '#b4d8cf'),
  ('color', 'Stone', '#d7d2c7'),
  ('color', 'White', '#ffffff'),
  ('color', 'Yellow', '#ffe842'),
  ('size', 'XS', null),
  ('size', 'S', null),
  ('size', 'M', null),
  ('size', 'L', null),
  ('size', 'XL', null),
  ('size', 'XXL', null),
  ('size', 'One Size', null),
  ('gender', 'Male', null),
  ('gender', 'Female', null),
  ('gender', 'Unisex', null)
on conflict (option_type, name) do nothing;

insert into public.shipping_rules (rule_type, country_id, fee, currency)
select 'country_default', id, default_fee, 'USD'
from public.shipping_countries
where is_active = true
on conflict do nothing;

insert into public.shipping_regions (country_id, region_name)
select country_id, area_name
from public.shipping_area_overrides
on conflict do nothing;
