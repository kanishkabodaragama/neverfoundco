alter table public.orders
add column if not exists payhere_amount_lkr numeric(12,2),
add column if not exists payhere_exchange_rate numeric(12,6),
add column if not exists payhere_exchange_source text,
add column if not exists payhere_exchange_updated_at timestamptz;
