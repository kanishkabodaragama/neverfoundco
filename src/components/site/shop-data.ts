export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  category: "T-Shirts" | "Hoodies" | "Shirts" | "Accessories";
  sizes: string[];
  color: "Black" | "White" | "Beige" | "Blue" | "Grey" | "Green";
  stockLabel: string;
  image: string;
  alt: string;
  soldOut?: boolean;
};

export const shopProducts: ShopProduct[] = [
  {
    id: "lost-paradise-tee",
    name: "Lost Paradise Tee",
    price: 5490,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "White",
    stockLabel: "12 LEFT",
    image: "/images/landing/tee-cream.svg",
    alt: "White Lost Paradise graphic tee",
  },
  {
    id: "heat-wave-tee",
    name: "Heat Wave Tee",
    price: 5490,
    category: "T-Shirts",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
    stockLabel: "10 LEFT",
    image: "/images/landing/tee-black.svg",
    alt: "Black Heat Wave graphic tee",
  },
  {
    id: "dream-state-tee",
    name: "Dream State Tee",
    price: 5290,
    category: "T-Shirts",
    sizes: ["S", "M", "L"],
    color: "Beige",
    stockLabel: "6 LEFT",
    image: "/images/landing/tee-yellow.svg",
    alt: "Beige Dream State graphic tee",
  },
  {
    id: "daydream-tee",
    name: "Daydream Tee",
    price: 5490,
    category: "T-Shirts",
    sizes: ["L", "XL"],
    color: "Black",
    stockLabel: "SOLD OUT",
    image: "/images/landing/tee-sold.svg",
    alt: "Sold out black Daydream graphic tee",
    soldOut: true,
  },
  {
    id: "sun-faded-tee",
    name: "Sun Faded Tee",
    price: 4990,
    category: "T-Shirts",
    sizes: ["S", "M", "XL"],
    color: "Blue",
    stockLabel: "4 LEFT",
    image: "/images/landing/lookbook-3.svg",
    alt: "Blue Sun Faded tee poster placeholder",
  },
  {
    id: "midnight-ride-tee",
    name: "Midnight Ride Tee",
    price: 6290,
    category: "Shirts",
    sizes: ["M", "L", "XXL"],
    color: "Green",
    stockLabel: "2 LEFT",
    image: "/images/landing/lookbook-2.svg",
    alt: "Green Midnight Ride shirt poster placeholder",
  },
  {
    id: "ocean-drive-tee",
    name: "Ocean Drive Tee",
    price: 5790,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Grey",
    stockLabel: "8 LEFT",
    image: "/images/landing/hero-skate.svg",
    alt: "Ocean Drive tee lifestyle poster placeholder",
  },
  {
    id: "ghost-tee",
    name: "Ghost Tee",
    price: 4590,
    category: "Accessories",
    sizes: ["S", "M", "L"],
    color: "White",
    stockLabel: "5 LEFT",
    image: "/images/landing/lookbook-1.svg",
    alt: "Ghost tee collectible catalog placeholder",
  },
];

export const categories = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Shirts",
  "Accessories",
] as const;

export const sizes = ["S", "M", "L", "XL", "XXL"] as const;

export const colors = ["Black", "White", "Beige", "Blue", "Grey", "Green"] as const;

