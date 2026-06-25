"use client";

import { useMemo, useState } from "react";
import { ShopProductCard } from "@/components/site/ShopProductCard";
import { useStoreCurrency } from "@/components/store/currency-provider";
import {
  categories,
  colors,
  shopProducts,
  sizes,
  type ShopProduct,
} from "@/components/site/shop-data";

type SortMode = "Newest" | "Price Low to High" | "Price High to Low";

const colorClasses: Record<string, string> = {
  Black: "bg-[#111715]",
  Cream: "bg-[#ead8bd]",
  Sage: "bg-[#80916f]",
  Grey: "bg-[#77746c]",
  Navy: "bg-[#1f3148]",
};

function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  selectedSizes,
  toggleSize,
  selectedColors,
  toggleColor,
  maxPrice,
  setMaxPrice,
  clearAll,
}: {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSizes: string[];
  toggleSize: (value: string) => void;
  selectedColors: string[];
  toggleColor: (value: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  clearAll: () => void;
}) {
  const { format } = useStoreCurrency();

  return (
    <div className="landing-paper space-y-7 border-2 border-[#17251f] bg-[#ead8bd] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-black uppercase">Filter Stack</p>
        <button
          className="border-2 border-[#17251f] px-3 py-2 text-xs font-black uppercase transition hover:bg-[#17251f] hover:text-[#ead8bd]"
          onClick={clearAll}
          type="button"
        >
          Clear All
        </button>
      </div>
      <fieldset className="space-y-3">
        <legend className="mb-2 font-black uppercase text-[#d9532f]">
          Categories
        </legend>
        {categories.map((category) => (
          <label className="flex items-center gap-3 text-sm font-black uppercase" key={category}>
            <input
              checked={selectedCategory === category}
              onChange={() => setSelectedCategory(category)}
              type="checkbox"
            />
            {category}
          </label>
        ))}
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 font-black uppercase text-[#d9532f]">Sizes</legend>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              className={`border-2 border-[#17251f] px-3 py-2 text-sm font-black ${
                selectedSizes.includes(size) ? "bg-[#17251f] text-[#ead8bd]" : ""
              }`}
              key={size}
              onClick={() => toggleSize(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 font-black uppercase text-[#d9532f]">Colors</legend>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <button
              className="flex items-center gap-2 text-sm font-black uppercase"
              key={color}
              onClick={() => toggleColor(color)}
              type="button"
            >
              <span
                className={`h-5 w-5 rounded-full border-2 border-[#17251f] ${colorClasses[color]} ${
                  selectedColors.includes(color) ? "ring-2 ring-[#d9532f]" : ""
                }`}
              />
              {color}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="font-black uppercase text-[#d9532f]">
          Price Range
        </legend>
        <input
          aria-label="Maximum price"
          className="w-full accent-[#d9532f]"
          max="100"
          min="0"
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          step="5"
          type="range"
          value={maxPrice}
        />
        <p className="text-sm font-black uppercase">Up to {format(maxPrice)}</p>
      </fieldset>
    </div>
  );
}

function sortProducts(products: ShopProduct[], sortMode: SortMode) {
  const sorted = [...products];

  if (sortMode === "Price Low to High") {
    sorted.sort((a, b) => a.price - b.price);
  }

  if (sortMode === "Price High to Low") {
    sorted.sort((a, b) => b.price - a.price);
  }

  return sorted;
}

export function ShopCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortMode, setSortMode] = useState<SortMode>("Newest");
  const [activePage, setActivePage] = useState(1);

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
  }

  function toggleColor(color: string) {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    );
  }

  function clearAll() {
    setSelectedCategory("All");
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(100);
    setSortMode("Newest");
    setActivePage(1);
  }

  const filteredProducts = useMemo(() => {
    const filtered = shopProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => product.sizes.includes(size));
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesSize && matchesColor && matchesPrice;
    });

    return sortProducts(filtered, sortMode);
  }, [maxPrice, selectedCategory, selectedColors, selectedSizes, sortMode]);

  const filterPanel = (
    <FilterPanel
      clearAll={clearAll}
      maxPrice={maxPrice}
      selectedCategory={selectedCategory}
      selectedColors={selectedColors}
      selectedSizes={selectedSizes}
      setMaxPrice={setMaxPrice}
      setSelectedCategory={setSelectedCategory}
      toggleColor={toggleColor}
      toggleSize={toggleSize}
    />
  );

  return (
    <section className="grid gap-8 bg-[#ead8bd] px-5 py-10 md:px-8 lg:grid-cols-[280px_1fr] lg:px-10 xl:px-12">
      <aside className="hidden lg:block">{filterPanel}</aside>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-2xl font-black uppercase">
            {filteredProducts.length} Products
          </p>
          <div className="flex items-center gap-3">
            <details className="relative lg:hidden">
              <summary className="cursor-pointer border-2 border-[#17251f] px-4 py-3 text-sm font-black uppercase">
                Filters
              </summary>
              <div className="absolute left-0 z-40 mt-3 w-[min(88vw,330px)]">
                {filterPanel}
              </div>
            </details>
            <label className="flex items-center gap-3 text-sm font-black uppercase">
              Sort
              <select
                className="border-2 border-[#17251f] bg-[#ead8bd] px-4 py-3 font-black uppercase"
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                value={sortMode}
              >
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </label>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 ? (
          <p className="border-2 border-[#17251f] p-6 text-lg font-black uppercase">
            Nothing in this crate. Clear filters and dig again.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            className={`px-5 py-3 text-sm font-black uppercase ${
              activePage === 1
                ? "bg-[#17251f] text-[#ead8bd]"
                : "border-2 border-[#17251f]"
            }`}
            onClick={() => setActivePage(1)}
            type="button"
          >
            1
          </button>
          <button
            className={`px-5 py-3 text-sm font-black uppercase transition hover:bg-[#17251f] hover:text-[#ead8bd] ${
              activePage === 2
                ? "bg-[#17251f] text-[#ead8bd]"
                : "border-2 border-[#17251f]"
            }`}
            onClick={() => setActivePage(2)}
            type="button"
          >
            2
          </button>
          <button
            className="border-2 border-[#17251f] px-5 py-3 text-sm font-black uppercase transition hover:bg-[#17251f] hover:text-[#ead8bd]"
            onClick={() => setActivePage((page) => (page === 1 ? 2 : 1))}
            type="button"
          >
            &gt;
          </button>
          <p className="text-sm font-black uppercase text-[#d9532f]">
            Page {activePage} / poster catalog preview
          </p>
        </div>
      </div>
    </section>
  );
}
