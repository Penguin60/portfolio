import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "@/components/session-provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Admin - Radean Rashed",
  description: "Admin dashboard for managing content.",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`flex flex-col h-screen ${inter.className}`}>
        <NextAuthSessionProvider>
          {children}
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
