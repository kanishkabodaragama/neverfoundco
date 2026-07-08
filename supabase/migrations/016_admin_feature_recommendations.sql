create table if not exists public.you_may_also_like_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  exclude_current_product boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists you_may_also_like_items_sort_order_idx
on public.you_may_also_like_items(sort_order asc, created_at desc);

create index if not exists you_may_also_like_items_product_id_idx
on public.you_may_also_like_items(product_id);

alter table public.you_may_also_like_items enable row level security;

drop policy if exists "Public can read you may also like items" on public.you_may_also_like_items;
create policy "Public can read you may also like items"
on public.you_may_also_like_items for select
using (true);

drop policy if exists "Admins manage you may also like items" on public.you_may_also_like_items;
create policy "Admins manage you may also like items"
on public.you_may_also_like_items for all
using (public.is_admin())
with check (public.is_admin());
