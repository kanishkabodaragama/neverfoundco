export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Row<T> = T;
type Insert<T> = Partial<T>;
type Update<T> = Partial<T>;

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Row<{
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          sale_price: number | null;
          stock_quantity: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["products"]["Row"]>;
      };
      product_images: {
        Row: Row<{
          id: string;
          product_id: string;
          image_url: string;
          storage_path: string | null;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["product_images"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["product_images"]["Row"]>;
      };
      orders: {
        Row: Row<{
          id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          country_code: string | null;
          coupon_code: string | null;
          discount_amount: number;
          district: string;
          postal_code: string | null;
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_status: string;
          order_status: string;
          payhere_payment_id: string | null;
          payhere_order_id: string | null;
          payhere_method: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["orders"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      order_items: {
        Row: Row<{
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["order_items"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["order_items"]["Row"]>;
      };
      shipping_settings: {
        Row: Row<{
          id: string;
          default_shipping_fee: number;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["shipping_settings"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["shipping_settings"]["Row"]>;
      };
      coupons: {
        Row: Row<{
          id: string;
          code: string;
          description: string | null;
          discount_type: "flat" | "percentage";
          discount_value: number;
          usage_limit: number | null;
          used_count: number;
          starts_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["coupons"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["coupons"]["Row"]>;
      };
      coupon_products: {
        Row: Row<{
          coupon_id: string;
          product_id: string;
          created_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["coupon_products"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["coupon_products"]["Row"]>;
      };
      shipping_countries: {
        Row: Row<{
          id: string;
          country_name: string;
          country_code: string;
          default_fee: number;
          currency: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["shipping_countries"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["shipping_countries"]["Row"]>;
      };
      shipping_area_overrides: {
        Row: Row<{
          id: string;
          country_id: string;
          area_name: string;
          fee: number;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["shipping_area_overrides"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["shipping_area_overrides"]["Row"]>;
      };
      admin_users: {
        Row: Row<{
          id: string;
          user_id: string;
          email: string;
          role: string;
          created_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["admin_users"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["admin_users"]["Row"]>;
      };
      site_settings: {
        Row: Row<{
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        }>;
        Insert: Insert<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
