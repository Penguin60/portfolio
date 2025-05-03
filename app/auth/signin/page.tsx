"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="w-[30vw] h-[30vh] flex flex-col overflow-hidden">
        <div className="h-1/2 relative">
          <img 
            src="https://paulnicklen.com/wp-content/uploads/2019/10/MM7595-281111-034511_KBG-1.jpg" 
            alt="Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex flex-col flex-grow p-4">
          <h1 className="text-black dark:text-white text-2xl font-bold mb-4">Login</h1>
          <Button 
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="text-m dark:text-black text-white"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}