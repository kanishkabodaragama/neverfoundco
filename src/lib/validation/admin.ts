import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  short_description: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  sale_price: z.coerce.number().nonnegative().optional().nullable(),
  stock_quantity: z.coerce.number().int().nonnegative(),
  is_active: z.coerce.boolean().default(true),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export const productImageSchema = z.object({
  image_url: z.string().url().optional(),
  storage_path: z.string().optional(),
  alt_text: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
});

export const shippingSettingsSchema = z.object({
  default_shipping_fee: z.coerce.number().nonnegative(),
});

export const shippingCountrySchema = z.object({
  country_name: z.string().min(2),
  country_code: z.string().min(2).max(3).transform((value) => value.toUpperCase()),
  default_fee: z.coerce.number().nonnegative(),
  currency: z.string().min(3).max(3).default("LKR"),
  is_active: z.coerce.boolean().default(true),
});

export const shippingAreaOverrideSchema = z.object({
  area_name: z.string().min(2),
  fee: z.coerce.number().nonnegative(),
});

export const couponSchema = z.object({
  code: z
    .string()
    .min(2)
    .transform((value) => value.trim().toUpperCase().replace(/\s+/g, "-")),
  description: z.string().optional(),
  discount_type: z.enum(["flat", "percentage"]),
  discount_value: z.coerce.number().positive(),
  usage_limit: z.coerce.number().int().positive().optional().nullable(),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
  is_active: z.coerce.boolean().default(true),
  product_ids: z.array(z.string().uuid()).optional(),
});

export const orderStatusSchema = z.object({
  order_status: z.enum([
    "pending",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ]),
});
