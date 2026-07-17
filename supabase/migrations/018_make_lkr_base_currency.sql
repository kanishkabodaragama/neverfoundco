-- LKR is the canonical currency for catalog, discounts, shipping, orders, and
-- reporting. Values created by the former USD-based application are converted
-- once at LKR 300 per USD. Historical orders use their captured PayHere rate
-- when one is available.

update public.products
set price = round(price * 300, 2),
    sale_price = case when sale_price is null then null else round(sale_price * 300, 2) end,
    unit_cost = case when unit_cost is null then null else round(unit_cost * 300, 2) end;

update public.product_variants
set price = case when price is null then null else round(price * 300, 2) end,
    sale_price = case when sale_price is null then null else round(sale_price * 300, 2) end,
    unit_cost = case when unit_cost is null then null else round(unit_cost * 300, 2) end;

update public.coupons
set discount_value = round(discount_value * 300, 2)
where discount_type = 'flat';

update public.order_items as item
set unit_price = round(item.unit_price * coalesce(parent.payhere_exchange_rate, 300), 2),
    total_price = round(item.total_price * coalesce(parent.payhere_exchange_rate, 300), 2),
    unit_cost = round(item.unit_cost * coalesce(parent.payhere_exchange_rate, 300), 2),
    profit = round(item.profit * coalesce(parent.payhere_exchange_rate, 300), 2)
from public.orders as parent
where parent.id = item.order_id;

update public.orders
set subtotal = round(subtotal * coalesce(payhere_exchange_rate, 300), 2),
    discount_amount = round(discount_amount * coalesce(payhere_exchange_rate, 300), 2),
    shipping_fee = round(shipping_fee * coalesce(payhere_exchange_rate, 300), 2),
    total = round(total * coalesce(payhere_exchange_rate, 300), 2),
    refund_amount = case
      when refund_amount is null then null
      else round(refund_amount * coalesce(payhere_exchange_rate, 300), 2)
    end;

update public.shipping_area_overrides as area
set fee = round(area.fee * 300, 2)
from public.shipping_countries as country
where country.id = area.country_id
  and country.currency <> 'LKR';

-- Migration 005 copied the original Sri Lanka LKR default into a rule while
-- incorrectly labeling it USD. Preserve that seeded value; convert actual
-- USD-era rules.
update public.shipping_rules as rule
set fee = case
      when rule.currency = 'LKR' then rule.fee
      when exists (
        select 1
        from public.shipping_countries as country
        where country.id = rule.country_id
          and country.currency = 'LKR'
          and rule.rule_type = 'country_default'
          and rule.fee = country.default_fee
      ) then rule.fee
      else round(rule.fee * 300, 2)
    end,
    currency = 'LKR';

update public.shipping_countries
set default_fee = case
      when currency = 'LKR' then default_fee
      else round(default_fee * 300, 2)
    end,
    currency = 'LKR';

update public.shipping_settings
set default_shipping_fee = round(default_shipping_fee * 300, 2);

alter table public.shipping_countries
alter column currency set default 'LKR';

alter table public.shipping_rules
alter column currency set default 'LKR';

alter table public.shipping_countries
drop constraint if exists shipping_countries_currency_lkr_check;

alter table public.shipping_countries
add constraint shipping_countries_currency_lkr_check check (currency = 'LKR');

alter table public.shipping_rules
drop constraint if exists shipping_rules_currency_lkr_check;

alter table public.shipping_rules
add constraint shipping_rules_currency_lkr_check check (currency = 'LKR');
