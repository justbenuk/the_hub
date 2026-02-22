import { RootProps } from "@/types";
import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    template: "%s | Tamworth Hub",
    default: "Tamworth Hub",
  },
  description:
    "Tamworth Hub connects residents, businesses, and community groups through local updates, events, and opportunities.",
};

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
