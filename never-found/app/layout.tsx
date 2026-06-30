import type { Metadata } from "next";
import { Anton, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

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
  title: "NEVER FOUND — Streetwear that doesn't stick around",
  description:
    "Limited drops. Untraceable fits. Once it's gone, it's gone — NEVER FOUND.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${mono.variable} ${body.variable} font-body bg-ink text-bone`}
      >
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
