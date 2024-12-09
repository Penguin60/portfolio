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
  const { toast } = useToast();

  function copyEmail() {
    toast({
      title: "Email copied to clipboard.",
      description: "You can now paste it into your email client.",
    });
    navigator.clipboard.writeText("radean.rashed@gmail.com");
  }

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full">
      <Card className="w-[97vw] h-[88vh] flex">
        <CardHeader>
          <h1 className="text-black dark:text-white text-4xl font-bold">Contact</h1>
          <h2 className="text-black dark:text-white text-xl">
            Reach out! Let&apos;s work on something together.
          </h2>
          <div>
            <Button className="mb-2.5" onClick={copyEmail}>
              <EnvelopeClosedIcon className="w-6 h-6" />
              <p className="ml-2">radean.rashed@gmail.com</p>
            </Button>
            <br />
            <Button>
              <a
                href="https://github.com/Penguin60"
                className="flex items-center"
              >
                <GitHubLogoIcon className="w-6 h-6" />
                <span className="ml-2">Penguin60</span>
              </a>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </main>
  );
}