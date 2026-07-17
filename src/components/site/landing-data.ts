export type DropProduct = {
  slug: string;
  name: string;
  price: number;
  stockLabel: string;
  image: string;
  alt: string;
  soldOut?: boolean;
};

export type HeroSlide = {
  image: string;
  alt: string;
  eyebrow: string;
  badge: string;
};

export const heroSlides: HeroSlide[] = [
  {
    image: "/images/landing/hero-skate.svg",
    alt: "Skater wearing a Never Found graphic tee in a retro skate photo frame",
    eyebrow: "D.E.D Summer",
    badge: "Summer isn't over",
  },
  {
    image: "/images/landing/lookbook-2.svg",
    alt: "Retro computer and skate spot from the Never Found drop world",
    eyebrow: "Arcade Heat",
    badge: "Drop stays moving",
  },
  {
    image: "/images/landing/lookbook-3.svg",
    alt: "Street skyline lookbook image with Never Found graphic tee energy",
    eyebrow: "Street Static",
    badge: "Drop while it lasts",
  },
];

export const dropProducts: DropProduct[] = [
  {
    slug: "ded-summer-tee",
    name: "D.E.D Summer Tee",
    price: 30000,
    stockLabel: "12 LEFT",
    image: "/images/landing/tee-cream.svg",
    alt: "Cream D.E.D Summer graphic t-shirt",
  },
  {
    slug: "heat-wave-tee",
    name: "Heat Wave Tee",
    price: 30000,
    stockLabel: "8 LEFT",
    image: "/images/landing/tee-black.svg",
    alt: "Black Heat Wave graphic t-shirt",
  },
  {
    slug: "paradise-lost-tee",
    name: "Paradise Lost Tee",
    price: 30000,
    stockLabel: "6 LEFT",
    image: "/images/landing/tee-yellow.svg",
    alt: "Faded yellow Paradise Lost graphic t-shirt",
  },
  {
    slug: "daydream-tee",
    name: "Daydream Tee",
    price: 30000,
    stockLabel: "SOLD OUT",
    image: "/images/landing/tee-sold.svg",
    alt: "Sold out black Daydream graphic t-shirt",
    soldOut: true,
  },
];

export const countdownItems = [
  { value: "06", label: "Days" },
  { value: "23", label: "Hours" },
  { value: "57", label: "Minutes" },
  { value: "12", label: "Seconds" },
];
