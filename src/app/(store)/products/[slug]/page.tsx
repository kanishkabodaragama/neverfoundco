import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ProductDetailActions } from "@/components/site/ProductDetailActions";
import {
  getMockProductBySlug,
  mockProductDetails,
} from "@/components/site/product-detail-data";
import { formatLkr } from "@/components/cart/cart-data";

export function generateStaticParams() {
  return mockProductDetails.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Never Found Co`,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.alt }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main>
        <section className="grid w-full gap-8 bg-[#F7F1E6] px-5 py-8 md:grid-cols-[0.8fr_1.2fr] md:px-8 xl:px-12">
          <div className="relative min-h-[360px] border border-[#10131A]/10 bg-[#FFF9EF] p-6">
            <Image
              alt={product.alt}
              className="object-contain p-8"
              fill
              priority
              src={product.image}
            />
          </div>
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#F05267]">
              Product file / Drop 001
            </p>
            <h1 className="font-pixel max-w-2xl text-2xl font-black uppercase leading-tight md:text-3xl">
              {product.name}
            </h1>
            <p className="max-w-xl text-sm font-black leading-relaxed md:text-base">
              {product.shortDescription}
            </p>
            <p className="max-w-2xl text-sm font-bold leading-relaxed">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-black uppercase">
              <span className="bg-[#F05267] px-4 py-3 text-[#FFF9EF]">
                {product.stockLabel}
              </span>
              <span className="border border-[#10131A]/15 px-4 py-3">
                {product.category}
              </span>
              <span className="bg-[#B8A8E8] px-4 py-3">No Restocks</span>
            </div>
            <Link
              className="inline-flex text-sm font-black uppercase text-[#F05267] transition hover:translate-x-0.5"
              href="/shop"
            >
              Back To Shop
            </Link>
            <div className="grid gap-4 border border-[#10131A]/10 bg-[#FFF9EF] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-black uppercase">Price</span>
                <strong className="text-xl font-black uppercase text-[#F05267]">
                  {formatLkr(product.price)}
                </strong>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock label="Color" value={product.color} />
                <InfoBlock label="Sizes" value={product.sizes.join(" / ")} />
                <InfoBlock label="Drop" value="D.E.D Summer" />
                <InfoBlock
                  label="Status"
                  value={product.soldOut ? "Sold Out" : "Available"}
                />
              </div>
              <ProductDetailActions
                name={product.name}
                productId={product.slug}
                slug={product.slug}
                soldOut={product.soldOut}
                unitPrice={product.price}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#070B12] p-4 text-[#FFF9EF]">
      <p className="text-xs font-black uppercase text-[#B8A8E8]">{label}</p>
      <p className="mt-2 text-sm font-black uppercase">{value}</p>
    </div>
  );
}
