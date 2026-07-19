import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Noor — Noli Me Tangere RPG",
  description: "A Pokémon-style RPG based on José Rizal's Noli Me Tangere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
