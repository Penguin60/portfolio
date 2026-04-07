import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CSPostHogProvider } from "../providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Radean Rashed",
  description: "High schooler developing intricate and functional software.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/profile.jpeg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`flex flex-col bg-zinc-50 dark:bg-zinc-950 h-screen ${inter.className} overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CSPostHogProvider>
            <main className="h-full text-black dark:text-white flex-1 max-w-3xl mx-auto px-4 w-full">
              <Navbar />
              {children}
              <Toaster />
            </main>
          </CSPostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
