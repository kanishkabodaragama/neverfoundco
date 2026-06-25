alter table public.products
add column if not exists unit_cost numeric(12, 2) check (unit_cost is null or unit_cost >= 0);

alter table public.product_variants
add column if not exists price numeric(12, 2) check (price is null or price >= 0),
add column if not exists sale_price numeric(12, 2) check (sale_price is null or sale_price >= 0),
add column if not exists unit_cost numeric(12, 2) check (unit_cost is null or unit_cost >= 0);

alter table public.order_items
add column if not exists unit_cost numeric(12, 2) not null default 0,
add column if not exists profit numeric(12, 2) not null default 0;

create table if not exists public.payment_gateways (
  id uuid primary key default gen_random_uuid(),
  gateway_key text not null unique,
  name text not null,
  description text,
  is_integrated boolean not null default true,
  is_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_payment_gateways_updated_at on public.payment_gateways;
create trigger set_payment_gateways_updated_at
before update on public.payment_gateways
for each row execute function public.set_updated_at();

alter table public.payment_gateways enable row level security;

drop policy if exists "Admins manage payment gateways" on public.payment_gateways;
create policy "Admins manage payment gateways"
on public.payment_gateways for all
using (public.is_admin())
with check (public.is_admin());

insert into public.payment_gateways (gateway_key, name, description, is_integrated, is_enabled)
values
  ('payhere', 'PayHere', 'Card payments through the existing PayHere integration.', true, true),
  ('manual_bank', 'Manual Bank Transfer', 'Manual payment option for bank deposits.', false, false),
  ('stripe', 'Stripe', 'Card payments for future international checkout.', false, false)
on conflict (gateway_key) do update
set name = excluded.name,
    description = excluded.description,
    is_integrated = excluded.is_integrated;

update public.products
set unit_cost = coalesce(unit_cost, round(price * 0.45, 2));

update public.order_items
set unit_cost = coalesce((
  select products.unit_cost
  from public.products
  where products.id = order_items.product_id
), 0),
profit = greatest(total_price - (coalesce((
  select products.unit_cost
  from public.products
  where products.id = order_items.product_id
), 0) * quantity), 0);
