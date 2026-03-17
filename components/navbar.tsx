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
    <div className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white m-0 p-0 items-start flex mx-4">
      <div className="w-full h-16 flex flex-col justify-center mt-5">
        <div className="flex items-center">
          <div className="space-x-6">
            <Link href="/dean" className="w-16 text-sm font-medium text-black dark:text-white hover:underline transition-all underline-offset-4">
              Home
            </Link>
            <Link href="/dean/projects" className="w-16 text-sm font-medium text-black dark:text-white hover:underline transition-all underline-offset-4">
              Projects
            </Link>
            <Link href="/dean/blogs" className="w-16 text-sm font-medium text-black dark:text-white hover:underline transition-all underline-offset-4">
              Blog
            </Link>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              <Sun
                className={`h-[1.2rem] w-[1.2rem] transition-all ${
                  isDarkMode ? "rotate-0 scale-100" : "rotate-90 scale-0"
                }`}
              />
              <Moon
                className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
                  isDarkMode ? "rotate-90 scale-0" : "rotate-0 scale-100"
                }`}
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;