create table if not exists public.storefront_gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text,
  alt_text text,
  created_at timestamptz not null default now()
);

create index if not exists storefront_gallery_images_created_at_idx
on public.storefront_gallery_images(created_at desc);

alter table public.storefront_gallery_images enable row level security;

drop policy if exists "Public can read storefront gallery images" on public.storefront_gallery_images;
create policy "Public can read storefront gallery images"
on public.storefront_gallery_images for select
using (true);

drop policy if exists "Admins manage storefront gallery images" on public.storefront_gallery_images;
create policy "Admins manage storefront gallery images"
on public.storefront_gallery_images for all
using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (key, value)
values ('product_recommendations_enabled', 'true'::jsonb)
on conflict (key) do nothing;
