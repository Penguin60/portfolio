"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";

export default function Contact() {
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full">
      <Card className="w-[97vw] h-[88vh] flex">
        <CardHeader>
          <h1 className="text-black dark:text-white text-4xl font-bold">Credits</h1>
          <h2 className="text-black dark:text-white text-xl">
            Thanks to <a className="underline" href="https://ketrinayim.tumblr.com/"> Ketrina Yim</a> for the amazing penguin drawing!
          </h2>
        </CardHeader>
      </Card>
    </main>
  );
}