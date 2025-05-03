"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex">
        <CardHeader className="flex flex-col items-center justify-center w-full">
          <h1 className="text-black dark:text-white text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg mb-8">You don&apos;t have permission to access the admin area.</p>
          <Link href="/dean">
            <Button>Return to Homepage</Button>
          </Link>
        </CardHeader>
      </Card>
    </main>
  );
}