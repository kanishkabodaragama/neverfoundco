import type { Metadata } from "next";
import { CartProvider } from "@/components/store/cart-provider";
import { CurrencyProvider } from "@/components/store/currency-provider";
import "./globals.css";
import { Anton, Inter, Space_Mono } from "next/font/google";
import { PRODUCTION_APP_ORIGIN } from "@/lib/app-origin";
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

const admin = Inter({
  subsets: ["latin"],
  variable: "--font-admin",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_APP_ORIGIN,
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
        admin.variable,
        display.variable,
        mono.variable,
      )}
    >
      <body className="min-h-full bg-ink text-bone">
        <div className="grain" />
        <CurrencyProvider>
          <CartProvider>{children}</CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
