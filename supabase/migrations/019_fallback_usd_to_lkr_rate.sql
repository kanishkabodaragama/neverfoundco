insert into public.site_settings (key, value)
values ('fallback_usd_to_lkr_rate', '300'::jsonb)
on conflict (key) do nothing;
