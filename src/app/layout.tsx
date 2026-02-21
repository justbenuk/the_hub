import { RootProps } from "@/types";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    template: "%s | The Hub Tamworth",
    default: "The Hub Tamworth",
  },
  description:
    "Tamworth Hub is a digital gateway connecting businesses, residents and visitors with local services, events and opportunities across Tamworth,",
};

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
