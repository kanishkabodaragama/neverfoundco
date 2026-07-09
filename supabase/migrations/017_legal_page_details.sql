insert into public.site_settings (key, value)
values (
  'legal_page_details',
  '{
    "business_name": "",
    "email_address": "",
    "phone_number": "",
    "business_address": "",
    "return_address": ""
  }'::jsonb
)
on conflict (key) do nothing;
