"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
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
  );
}
