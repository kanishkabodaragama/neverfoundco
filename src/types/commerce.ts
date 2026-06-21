export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type CartItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutCustomerInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode?: string;
};

export type PayHereCheckoutPayload = {
  sandbox: boolean;
  actionUrl: string;
  fields: Record<string, string>;
};

