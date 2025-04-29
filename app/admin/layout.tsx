import AdminNavbar from "@/components/adminnavbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin - Radean Rashed",
  description: "Admin dashboard for managing content.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`flex flex-col h-screen ${inter.className}`}>
          <AdminNavbar />
          <main>
            {children}
            <Toaster />
          </main>
      </body>
    </html>
  );
}