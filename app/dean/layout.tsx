import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { CSPostHogProvider } from "./../providers";

export const metadata: Metadata = {
  title: "Radean Rashed",
  description: "High schooler developing intricate and functional software.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CSPostHogProvider>
        <Navbar />
        <main>
          {children}
          <Toaster />
        </main>
      </CSPostHogProvider>
    </>
  );
}