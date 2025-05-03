"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  const errorMessages: {[key: string]: string} = {
    default: "An authentication error occurred",
    configuration: "There is a problem with the server configuration",
    accessdenied: "You don't have permission to sign in",
    verification: "The verification link was invalid or has expired",
    signin: "Try signing in with a different account",
    callback: "There was a problem with the authentication service",
    oauthsignin: "Error in the OAuth sign-in process",
    oauthcallback: "Error in the OAuth callback process",
    oauthcreateaccount: "Could not create OAuth provider account",
    emailcreateaccount: "Could not create email provider account",
    sessionrequired: "You must be signed in to access this page"
  };
  
  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex">
        <CardHeader className="flex flex-col items-center justify-center w-full">
          <h1 className="text-black dark:text-white text-4xl font-bold mb-4">Authentication Error</h1>
          <p className="text-lg mb-8">{errorMessage}</p>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button>Try Again</Button>
            </Link>
            <Link href="/dean">
              <Button variant="outline">Return to Homepage</Button>
            </Link>
          </div>
        </CardHeader>
      </Card>
    </main>
  );
}