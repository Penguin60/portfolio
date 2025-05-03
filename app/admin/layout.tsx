import AdminNavbar from "@/components/adminnavbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NextAuthSessionProvider from "@/components/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin - Radean Rashed",
  description: "Admin dashboard for managing content.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/auth/unauthorized");
  }

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`flex flex-col h-screen ${inter.className}`}>
        <NextAuthSessionProvider>
          <AdminNavbar />
          <main>
            {children}
            <Toaster />
          </main>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}