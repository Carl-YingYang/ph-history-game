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
  title: "Noli Me Tangere — An Interactive Cinematic Experience",
  description:
    "Walk the path of Crisóstomo Ibarra through José Rizal's Noli Me Tangere. A cinematic, story-driven educational visual novel built with Next.js, Framer Motion, and Howler.js.",
  keywords: [
    "Noli Me Tangere",
    "José Rizal",
    "Philippine history",
    "visual novel",
    "interactive story",
    "educational",
    "Project NOOR",
  ],
  authors: [{ name: "Project NOOR" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Noli Me Tangere — Interactive Cinematic Experience",
    description:
      "Experience José Rizal's masterpiece as an animated visual novel. Story, choices, history, and reflection.",
    siteName: "Project NOOR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
