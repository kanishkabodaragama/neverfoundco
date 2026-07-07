# Never Found Co

Next.js storefront and commerce admin panel for Never Found Co.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. If port `3000` is already in use, Next will choose another port such as `3002`.

## Environment

Copy `.env.example` to `.env.local` and fill these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYHERE_SANDBOX=true
PAYHERE_APP_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=
```

Admin login is disabled until `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL` are configured. Product/order/coupon/shipping mutations also need `SUPABASE_SERVICE_ROLE_KEY`.

## Supabase Setup

Run the SQL migrations in order:

```bash
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_admin_commerce_expansion.sql
supabase/seed.sql
```

Create an auth user in Supabase Auth, then add that user to `public.admin_users`:

```sql
insert into public.admin_users (user_id, email, role)
values ('AUTH_USER_UUID', 'admin@example.com', 'admin');
```

The app uses the `product-images` Supabase Storage bucket created by the first migration.

## Admin Panel

Visit `/admin/login` and sign in with the Supabase Auth user that is present in `public.admin_users`.

The admin panel manages:

- Dashboard metrics and recent orders
- Product create/edit/delete, publish state, stock, SEO fields, and images
- Orders, order details, and fulfillment status
- Coupons, product restrictions, usage limits, and active date windows
- Shipping countries and district/area overrides

## Checkout And PayHere

Checkout creates a pending order through `/api/checkout/create-order`, then posts a signed payload to PayHere. PayHere notifications post back to `/api/payhere/notify` and update payment/order status after signature verification.

For local sandbox testing, keep `PAYHERE_SANDBOX=true` and set `NEXT_PUBLIC_APP_URL` to the public URL PayHere can reach when testing callbacks.

## Order Email Setup

Order emails are sent through Resend and always use
`Never Found Orders <orders@neverfoundco.com>` as the sender. Set
`RESEND_API_KEY` in Netlify and verify `neverfoundco.com` in Resend so
`orders@neverfoundco.com` is allowed as a sender.

Customers receive order placed, cancelled, and admin status update emails. New
order and status admin copies go to `neverfoundclothing@gmail.com`. Customer
replies go back to `orders@neverfoundco.com` through the `Reply-To` header.

Resend stores delivery logs in the Resend dashboard. Customer replies go to the
`orders@neverfoundco.com` inbox because the emails use that `Reply-To` address.

## Verification

```bash
npm run lint
npm run build
```

In this environment, sandboxed builds can fail while fetching `next/font` assets. If that happens, rerun the build with network access. thes
