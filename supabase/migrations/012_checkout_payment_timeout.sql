insert into public.site_settings (key, value)
values ('checkout_payment_timeout_minutes', '15'::jsonb)
on conflict (key) do nothing;
