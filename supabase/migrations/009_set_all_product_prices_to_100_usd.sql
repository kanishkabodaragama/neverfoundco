update public.products
set price = 100.00,
    sale_price = null,
    updated_at = now();

update public.product_variants
set price = null,
    sale_price = null,
    updated_at = now();
