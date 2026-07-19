import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Noor — Rizal RPG",
  description: "A Pokémon-style top-down RPG where you witness the events of José Rizal's Noli Me Tangere and El Filibusterismo as a time-displaced 2026 college student.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b12] text-[#f2e8d5]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
