alter table public.orders
add column if not exists refund_status text not null default 'not_refunded',
add column if not exists refund_amount numeric(12, 2),
add column if not exists refunded_at timestamptz,
add column if not exists stock_deducted_at timestamptz;

alter table public.order_items
add column if not exists variant_id uuid references public.product_variants(id) on delete set null;

do $$
begin
  alter table public.orders
    drop constraint if exists orders_refund_status_check;

  alter table public.orders
    add constraint orders_refund_status_check
    check (
      refund_status in ('not_refunded', 'partial_refund', 'full_refund')
    );
end $$;

create index if not exists order_items_variant_id_idx on public.order_items(variant_id);
create index if not exists orders_refund_status_idx on public.orders(refund_status);
create index if not exists orders_stock_deducted_at_idx on public.orders(stock_deducted_at);

create or replace function public.deduct_order_stock(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  order_record public.orders%rowtype;
  item_record public.order_items%rowtype;
begin
  select *
  into order_record
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if order_record.stock_deducted_at is not null then
    return;
  end if;

  for item_record in
    select *
    from public.order_items
    where order_id = p_order_id
  loop
    if item_record.variant_id is not null then
      update public.product_variants
      set stock_quantity = stock_quantity - item_record.quantity
      where id = item_record.variant_id
        and stock_quantity >= item_record.quantity;

      if not found then
        raise exception 'Not enough variant stock for order item %', item_record.id;
      end if;
    end if;

    if item_record.product_id is not null then
      update public.products
      set stock_quantity = stock_quantity - item_record.quantity
      where id = item_record.product_id
        and stock_quantity >= item_record.quantity;

      if not found then
        raise exception 'Not enough product stock for order item %', item_record.id;
      end if;
    end if;
  end loop;

  update public.orders
  set stock_deducted_at = now()
  where id = p_order_id;
end;
$$;
