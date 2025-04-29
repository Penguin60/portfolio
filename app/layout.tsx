import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radean Rashed",
  description: "High schooler developing intricate and functional software.",
};

export default function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`flex flex-col h-screen ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <main className="h-full bg-white dark:bg-zinc-950 text-black dark:text-white flex-1">
              {children}
            </main>
        </ThemeProvider>
        </body>
    </html>
  );
}