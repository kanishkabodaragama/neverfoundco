alter table public.orders
add column if not exists country_code text,
add column if not exists coupon_code text,
add column if not exists discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('flat', 'percentage')),
  discount_value numeric(12,2) not null check (discount_value >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupon_products (
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (coupon_id, product_id)
);

create table if not exists public.shipping_countries (
  id uuid primary key default gen_random_uuid(),
  country_name text not null,
  country_code text not null unique,
  default_fee numeric(12,2) not null default 0 check (default_fee >= 0),
  currency text not null default 'LKR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipping_area_overrides (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.shipping_countries(id) on delete cascade,
  area_name text not null,
  fee numeric(12,2) not null check (fee >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_id, area_name)
);

create index if not exists coupons_code_idx on public.coupons(code);
create index if not exists coupons_is_active_idx on public.coupons(is_active);
create index if not exists coupon_products_product_id_idx on public.coupon_products(product_id);
create index if not exists shipping_countries_country_code_idx on public.shipping_countries(country_code);
create index if not exists shipping_area_overrides_country_id_idx on public.shipping_area_overrides(country_id);

drop trigger if exists set_coupons_updated_at on public.coupons;
create trigger set_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists set_shipping_countries_updated_at on public.shipping_countries;
create trigger set_shipping_countries_updated_at
before update on public.shipping_countries
for each row execute function public.set_updated_at();

drop trigger if exists set_shipping_area_overrides_updated_at on public.shipping_area_overrides;
create trigger set_shipping_area_overrides_updated_at
before update on public.shipping_area_overrides
for each row execute function public.set_updated_at();

alter table public.coupons enable row level security;
alter table public.coupon_products enable row level security;
alter table public.shipping_countries enable row level security;
alter table public.shipping_area_overrides enable row level security;

drop policy if exists "Admins manage coupons" on public.coupons;
create policy "Admins manage coupons"
on public.coupons for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage coupon products" on public.coupon_products;
create policy "Admins manage coupon products"
on public.coupon_products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active shipping countries" on public.shipping_countries;
create policy "Public can read active shipping countries"
on public.shipping_countries for select
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage shipping countries" on public.shipping_countries;
create policy "Admins manage shipping countries"
on public.shipping_countries for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read shipping area overrides" on public.shipping_area_overrides;
create policy "Public can read shipping area overrides"
on public.shipping_area_overrides for select
using (
  exists (
    select 1
    from public.shipping_countries
    where shipping_countries.id = shipping_area_overrides.country_id
      and (shipping_countries.is_active = true or public.is_admin())
  )
);

drop policy if exists "Admins manage shipping area overrides" on public.shipping_area_overrides;
create policy "Admins manage shipping area overrides"
on public.shipping_area_overrides for all
using (public.is_admin())
with check (public.is_admin());

insert into public.shipping_countries (country_name, country_code, default_fee, currency)
values ('Sri Lanka', 'LK', 400, 'LKR')
on conflict (country_code) do nothing;
