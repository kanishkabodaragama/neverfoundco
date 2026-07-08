import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  short_description: z.string().optional(),
  description: z.string().optional(),
  main_image_url: z.string().url().optional().nullable(),
  you_may_also_like_image_url: z.string().url().optional().nullable(),
  you_may_also_like_storage_path: z.string().optional().nullable(),
  category: z.string().min(1),
  product_status: z.enum(["draft", "published", "inactive"]).default("draft"),
  stock_tracking_enabled: z.coerce.boolean().default(true),
  preorder_enabled: z.coerce.boolean().default(false),
  preorder_start_at: z.string().optional().nullable(),
  preorder_end_at: z.string().optional().nullable(),
  preorder_quantity_limit: z.coerce.number().int().nonnegative().optional().nullable(),
  colors: z.array(z.string().min(1)).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  genders: z.array(z.enum(["Male", "Female", "Unisex"])).min(1),
  price: z.coerce.number().nonnegative(),
  sale_price: z.coerce.number().nonnegative().optional().nullable(),
  unit_cost: z.coerce.number().nonnegative().optional().nullable(),
  stock_quantity: z.coerce.number().int().nonnegative(),
  show_stock_count: z.coerce.boolean().default(false),
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

export const productVariantSchema = z.object({
  gender: z.enum(["Male", "Female", "Unisex"]),
  size: z.string().min(1),
  color: z.string().min(1),
  stock_quantity: z.coerce.number().int().nonnegative(),
  price: z.coerce.number().nonnegative().optional().nullable(),
  sale_price: z.coerce.number().nonnegative().optional().nullable(),
  unit_cost: z.coerce.number().nonnegative().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  storage_path: z.string().optional().nullable(),
});

export const shippingSettingsSchema = z.object({
  default_shipping_fee: z.coerce.number().nonnegative(),
});

export const checkoutSettingsSchema = z.object({
  checkout_payment_timeout_minutes: z.coerce
    .number()
    .int()
    .min(1, "Payment timeout must be at least 1 minute.")
    .max(120, "Payment timeout cannot be more than 120 minutes."),
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

export const shippingRuleSchema = z.object({
  rule_type: z.enum(["international_default", "country_default", "country_region_override"]),
  country_id: z.string().uuid().optional().nullable(),
  region_ids: z.array(z.string().uuid()).default([]),
  fee: z.coerce.number().nonnegative(),
  currency: z.string().min(3).max(3).default("USD"),
  is_active: z.coerce.boolean().default(true),
});

export const variantOptionSchema = z.object({
  option_type: z.enum(["color", "size", "gender"]),
  name: z.string().min(1),
  color_value: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .nullable(),
});

export const productCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  display_order: z.coerce.number().int().default(0),
  is_active: z.coerce.boolean().default(true),
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

export const refundStatusSchema = z
  .object({
    refund_status: z.enum(["not_refunded", "partial_refund", "full_refund"]),
    refund_amount: z.coerce.number().nonnegative().optional().nullable(),
    order_total: z.coerce.number().nonnegative(),
  })
  .superRefine((value, context) => {
    if (value.refund_status === "partial_refund") {
      if (!value.refund_amount || value.refund_amount <= 0) {
        context.addIssue({
          code: "custom",
          message: "Enter a refund amount for a partial refund.",
          path: ["refund_amount"],
        });
      }

      if (value.refund_amount && value.refund_amount > value.order_total) {
        context.addIssue({
          code: "custom",
          message: "Refund amount cannot be more than the order total.",
          path: ["refund_amount"],
        });
      }
    }
  })
  .transform((value) => ({
    refund_status: value.refund_status,
    refund_amount:
      value.refund_status === "full_refund"
        ? value.order_total
        : value.refund_status === "partial_refund"
          ? (value.refund_amount ?? 0)
          : null,
    refunded_at: value.refund_status === "not_refunded" ? null : new Date().toISOString(),
  }));
