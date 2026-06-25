import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  countryCode: z.string().min(2).max(3),
  city: z.string().min(2),
  district: z.string().min(1),
  postalCode: z.string().optional(),
  couponCode: z.string().optional(),
  items: z.array(cartItemSchema).min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
