insert into public.shipping_settings (default_shipping_fee)
select 0
where not exists (select 1 from public.shipping_settings);

