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
  description:
    "A Pokémon-style RPG through José Rizal's Noli Me Tangere and El Filibusterismo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FFF8E7] text-[#1a1a1a]`}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(26,26,26,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
