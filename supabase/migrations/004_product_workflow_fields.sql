alter table public.products
add column if not exists category text not null default 'T-Shirts',
add column if not exists product_status text not null default 'draft'
  check (product_status in ('draft', 'published', 'inactive')),
add column if not exists stock_tracking_enabled boolean not null default true,
add column if not exists preorder_enabled boolean not null default false,
add column if not exists preorder_start_at timestamptz,
add column if not exists preorder_end_at timestamptz,
add column if not exists preorder_quantity_limit integer check (preorder_quantity_limit is null or preorder_quantity_limit >= 0);

update public.products
set product_status = case when is_active then 'published' else 'draft' end
where product_status is null;
