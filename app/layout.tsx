import Navbar from "@/components/navbar";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radean Rashed",
  description: "High schooler developing intricate and functional software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`flex flex-col h-screen ${inter.className}`}>
        <Navbar />
        <main className="h-full dark">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}