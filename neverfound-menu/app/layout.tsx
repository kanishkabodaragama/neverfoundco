import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";

// Stand-in display font — see tailwind.config.ts for the note about
// swapping this for the real NEVERFOUND brand font later.
const displayFont = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "NEVERFOUND",
  description: "NEVERFOUND slide menu template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body>{children}</body>
    </html>
  );
}
