alter table public.products
add column if not exists main_image_url text,
add column if not exists colors jsonb not null default '[]'::jsonb,
add column if not exists sizes jsonb not null default '[]'::jsonb,
add column if not exists genders jsonb not null default '["Unisex"]'::jsonb;

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  gender text not null check (gender in ('Male', 'Female', 'Unisex')),
  size text not null,
  color text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_url text,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, gender, size, color)
);

create index if not exists product_variants_product_id_idx on public.product_variants(product_id);

drop trigger if exists set_product_variants_updated_at on public.product_variants;
create trigger set_product_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

alter table public.product_variants enable row level security;

drop policy if exists "Public can read active product variants" on public.product_variants;
create policy "Public can read active product variants"
on public.product_variants for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
      and (products.is_active = true or public.is_admin())
  )
);

drop policy if exists "Admins manage product variants" on public.product_variants;
create policy "Admins manage product variants"
on public.product_variants for all
using (public.is_admin())
with check (public.is_admin());
