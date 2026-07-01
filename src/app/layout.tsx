import type { Metadata } from "next";
import { CartProvider } from "@/components/store/cart-provider";
import { CurrencyProvider } from "@/components/store/currency-provider";
import "./globals.css";
import { Anton, Inter, Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Never Found Co",
    template: "%s | Never Found Co",
  },
  description:
    "Limited drops. Untraceable fits. Once it is gone, it is gone — Never Found.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        display.variable,
        mono.variable,
        body.variable,
      )}
    >
      <body className="min-h-full bg-acid text-ink">
        <div className="grain" />
        <CurrencyProvider>
          <CartProvider>{children}</CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
