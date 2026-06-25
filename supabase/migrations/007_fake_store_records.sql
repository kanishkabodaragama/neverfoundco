do $$
declare
  black_tee uuid;
  cream_tee uuid;
  sage_shirt uuid;
  hoodie uuid;
  cargo uuid;
  order_one uuid;
  order_two uuid;
begin
  insert into public.products (
    name, slug, short_description, description, price, sale_price, stock_quantity,
    main_image_url, category, product_status, stock_tracking_enabled, preorder_enabled,
    colors, sizes, genders, is_active, meta_title, meta_description
  )
  values
    ('Black Heavyweight Tee', 'black-heavyweight-tee', 'Heavy cotton everyday tee in black.', 'A premium heavyweight cotton tee with a clean oversized streetwear fit.', 100.00, null, 18, '/images/products/black-heavyweight-tee.png', 'T-Shirts', 'published', true, false, '["Black"]'::jsonb, '["S","M","L","XL"]'::jsonb, '["Male","Unisex"]'::jsonb, true, 'Black Heavyweight Tee', 'Premium black heavyweight t-shirt.'),
    ('Cream Heavyweight Tee', 'cream-heavyweight-tee', 'Soft cream tee with a structured fit.', 'A cream heavyweight tee for daily wear, limited drop stock, and no restocks.', 100.00, null, 14, '/images/products/cream-heavyweight-tee.png', 'T-Shirts', 'published', true, false, '["Cream"]'::jsonb, '["XS","S","M","L"]'::jsonb, '["Female","Unisex"]'::jsonb, true, 'Cream Heavyweight Tee', 'Premium cream heavyweight t-shirt.'),
    ('Sage Camp Shirt', 'sage-camp-shirt', 'Relaxed sage green camp collar shirt.', 'A lightweight camp shirt with a relaxed silhouette and clean summer finish.', 100.00, null, 9, '/images/products/sage-camp-shirt.png', 'Shirts', 'published', true, false, '["Sage"]'::jsonb, '["S","M","XL"]'::jsonb, '["Male","Female","Unisex"]'::jsonb, true, 'Sage Camp Shirt', 'Sage camp collar shirt.'),
    ('Grey Heavyweight Hoodie', 'grey-heavyweight-hoodie', 'Heavy fleece hoodie in heather grey.', 'A structured heavyweight hoodie for colder days and late-night runs.', 100.00, null, 7, '/images/products/grey-heavyweight-hoodie.png', 'Hoodies', 'published', true, true, '["Grey"]'::jsonb, '["M","L","XL"]'::jsonb, '["Unisex"]'::jsonb, true, 'Grey Heavyweight Hoodie', 'Grey heavyweight hoodie.'),
    ('Black Cargo Trouser', 'black-cargo-trouser', 'Relaxed black cargo trouser.', 'A utility cargo trouser with a relaxed fit and daily-wear construction.', 100.00, null, 11, '/images/products/black-cargo-trouser.png', 'Pants', 'published', true, false, '["Black"]'::jsonb, '["S","M","L","XL"]'::jsonb, '["Male","Unisex"]'::jsonb, true, 'Black Cargo Trouser', 'Black cargo trouser.')
  on conflict (slug) do update
  set
    name = excluded.name,
    short_description = excluded.short_description,
    description = excluded.description,
    price = excluded.price,
    sale_price = excluded.sale_price,
    stock_quantity = excluded.stock_quantity,
    main_image_url = excluded.main_image_url,
    category = excluded.category,
    product_status = excluded.product_status,
    colors = excluded.colors,
    sizes = excluded.sizes,
    genders = excluded.genders,
    is_active = excluded.is_active;

  select id into black_tee from public.products where slug = 'black-heavyweight-tee';
  select id into cream_tee from public.products where slug = 'cream-heavyweight-tee';
  select id into sage_shirt from public.products where slug = 'sage-camp-shirt';
  select id into hoodie from public.products where slug = 'grey-heavyweight-hoodie';
  select id into cargo from public.products where slug = 'black-cargo-trouser';

  insert into public.product_images (product_id, image_url, alt_text, sort_order)
  values
    (black_tee, '/images/products/black-heavyweight-tee.png', 'Black Heavyweight Tee', 0),
    (cream_tee, '/images/products/cream-heavyweight-tee.png', 'Cream Heavyweight Tee', 0),
    (sage_shirt, '/images/products/sage-camp-shirt.png', 'Sage Camp Shirt', 0),
    (hoodie, '/images/products/grey-heavyweight-hoodie.png', 'Grey Heavyweight Hoodie', 0),
    (cargo, '/images/products/black-cargo-trouser.png', 'Black Cargo Trouser', 0)
  on conflict do nothing;

  insert into public.product_variants (product_id, gender, size, color, stock_quantity, image_url)
  values
    (black_tee, 'Male', 'M', 'Black', 5, '/images/products/black-heavyweight-tee.png'),
    (black_tee, 'Unisex', 'L', 'Black', 6, '/images/products/black-heavyweight-tee.png'),
    (cream_tee, 'Female', 'S', 'Cream', 4, '/images/products/cream-heavyweight-tee.png'),
    (cream_tee, 'Unisex', 'M', 'Cream', 5, '/images/products/cream-heavyweight-tee.png'),
    (sage_shirt, 'Unisex', 'M', 'Sage', 4, '/images/products/sage-camp-shirt.png'),
    (hoodie, 'Unisex', 'L', 'Grey', 3, '/images/products/grey-heavyweight-hoodie.png'),
    (cargo, 'Male', 'M', 'Black', 5, '/images/products/black-cargo-trouser.png')
  on conflict (product_id, gender, size, color) do update
  set stock_quantity = excluded.stock_quantity,
      image_url = excluded.image_url;

  insert into public.coupons (code, description, discount_type, discount_value, usage_limit, is_active)
  values ('DROP10', 'Sample launch coupon', 'percentage', 10, 100, true)
  on conflict (code) do nothing;

  insert into public.orders (
    order_number, customer_name, customer_email, customer_phone, address_line_1,
    city, district, country_code, subtotal, shipping_fee, total,
    payment_status, order_status, payhere_order_id
  )
  values
    ('NF-DEMO-1002', 'Demo Customer', 'demo@neverfoundco.local', '+1 555 0102', '12 Market Street', 'New York', 'Default', 'US', 87.00, 8.00, 95.00, 'paid', 'processing', 'NF-DEMO-1002')
  on conflict (order_number) do nothing;

  select id into order_one from public.orders where order_number = 'NF-DEMO-1002';

  if order_one is not null then
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    values
      (order_one, black_tee, 'Black Heavyweight Tee', 1, 39.00, 39.00),
      (order_one, sage_shirt, 'Sage Camp Shirt', 1, 48.00, 48.00)
    on conflict do nothing;
  end if;

  insert into public.orders (
    order_number, customer_name, customer_email, customer_phone, address_line_1,
    city, district, country_code, subtotal, shipping_fee, total,
    payment_status, order_status, payhere_order_id
  )
  values
    ('NF-DEMO-1001', 'Demo Customer', 'demo@neverfoundco.local', '+1 555 0102', '12 Market Street', 'New York', 'Default', 'US', 72.00, 8.00, 80.00, 'paid', 'shipped', 'NF-DEMO-1001')
  on conflict (order_number) do nothing;

  select id into order_two from public.orders where order_number = 'NF-DEMO-1001';

  if order_two is not null then
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    values (order_two, hoodie, 'Grey Heavyweight Hoodie', 1, 72.00, 72.00)
    on conflict do nothing;
  end if;
end $$;
