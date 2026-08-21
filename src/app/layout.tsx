import type { Metadata } from "next";
import type { ReactNode } from "react";
import { League_Spartan, Playfair_Display } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Desk R.",
  description: "Desk Revolution Plattform — Baue dir dein eigenes digitales Team auf.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      className={`${leagueSpartan.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
