export type CartProduct = {
  id: string;
  name: string;
  color: string;
  size: string;
  stockLabel: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
};

export const mockCartItems: CartProduct[] = [
  {
    id: "lost-paradise",
    name: "Lost Paradise Tee",
    color: "Black",
    size: "L",
    stockLabel: "12 LEFT",
    price: 5490,
    quantity: 1,
    image: "/images/landing/tee-black.svg",
    alt: "Black Lost Paradise graphic t-shirt",
  },
  {
    id: "heat-wave",
    name: "Heat Wave Tee",
    color: "Sand",
    size: "M",
    stockLabel: "10 LEFT",
    price: 5490,
    quantity: 1,
    image: "/images/landing/tee-yellow.svg",
    alt: "Sand Heat Wave graphic t-shirt",
  },
  {
    id: "ocean-drive",
    name: "Ocean Drive Tee",
    color: "Blue",
    size: "XL",
    stockLabel: "2 LEFT",
    price: 5490,
    quantity: 1,
    image: "/images/landing/tee-cream.svg",
    alt: "Blue Ocean Drive graphic t-shirt",
  },
];

export const shippingFee = 750;

export const cartCultureItems = [
  {
    icon: "☠",
    title: "Limited Drops",
    text: "3-4 pieces per drop. Once they're gone, they're gone.",
  },
  {
    icon: "🌐",
    title: "Worldwide Shipping",
    text: "We ship everywhere. Wear it anywhere.",
  },
  {
    icon: "☺",
    title: "No Restocks",
    text: "If it's sold out, it's never coming back. Don't sleep on it.",
  },
  {
    icon: "✶",
    title: "Made To Stand Out",
    text: "Original designs. Premium quality. Built different.",
  },
];

export function formatLkr(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

