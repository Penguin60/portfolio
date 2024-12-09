"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-black dark:text-white m-0 p-0 items-start flex justify-center">
      <Card className="w-[97vw] h-16 flex flex-col justify-center mt-5">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link href="/" className="font-bold">
              <Button variant="ghost" className="w-16">
                Home
              </Button>
            </Link>
            <Link href="/projects" className="font-bold">
              <Button variant="ghost" className="w-16">
                Projects
              </Button>
            </Link>
            <Link href="/blog" className="font-bold">
              <Button variant="ghost" className="w-16">
                Blog
              </Button>
            </Link>
            <Link href="/contact" className="font-bold">
              <Button variant="ghost" className="w-16">
                Contact
              </Button>
            </Link>
            <div className="ml-auto">
              <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDarkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDarkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default Navbar;