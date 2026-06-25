alter table public.products
add column if not exists show_stock_count boolean not null default false;

update public.products
set show_stock_count = false
where show_stock_count is null;
