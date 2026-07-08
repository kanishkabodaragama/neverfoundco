alter table public.products
add column if not exists you_may_also_like_image_url text,
add column if not exists you_may_also_like_storage_path text;
