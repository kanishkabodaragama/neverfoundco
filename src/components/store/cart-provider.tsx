"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  gender?: string;
  size?: string;
  color?: string;
};

type CartContextValue = {
  items: CartItem[];
  couponCode: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  removeItem: (itemKey: string) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;
  clearCouponCode: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "neverfoundco-cart";
const COUPON_STORAGE_KEY = "neverfoundco-coupon";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setStoredCouponCode] = useState("");
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const storedCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (stored) setItems(normalizeStoredCartItems(JSON.parse(stored) as CartItem[]));
      if (storedCoupon) setStoredCouponCode(storedCoupon);
      setHasLoadedStoredCart(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoadedStoredCart, items]);

  useEffect(() => {
    if (!hasLoadedStoredCart) return;

    if (couponCode) {
      window.localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      return;
    }

    window.localStorage.removeItem(COUPON_STORAGE_KEY);
  }, [couponCode, hasLoadedStoredCart]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      couponCode,
      addItem(item) {
        setItems((current) => {
          const itemKey = getCartItemKey(item);
          const existing = current.find((cartItem) => getCartItemKey(cartItem) === itemKey);

          if (existing) {
            return current.map((cartItem) =>
              getCartItemKey(cartItem) === itemKey
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem,
            );
          }

          return [...current, { ...item, quantity: 1 }];
        });
      },
      updateQuantity(itemKey, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              getCartItemKey(item) === itemKey
                ? { ...item, quantity: Math.max(1, quantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(itemKey) {
        setItems((current) =>
          current.filter((item) => getCartItemKey(item) !== itemKey),
        );
      },
      clearCart() {
        setItems([]);
        setStoredCouponCode("");
      },
      setCouponCode(code) {
        setStoredCouponCode(code.trim().toUpperCase());
      },
      clearCouponCode() {
        setStoredCouponCode("");
      },
    }),
    [couponCode, items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

function getCartItemKey(item: Pick<CartItem, "productId" | "variantId">) {
  return item.variantId ?? item.productId;
}

function normalizeStoredCartItems(items: CartItem[]) {
  return items.map((item) => ({
    ...item,
    unitPrice: item.unitPrice > 1000 ? 100 : item.unitPrice,
  }));
}
