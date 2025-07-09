"use client";

import "./../renderedmd/renderedmd.css";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function RenderedMarkdown({ content }: { content: string }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      themeVariables: {
        darkMode: isDarkMode,
      },
      flowchart: {
        curve: "basis",
      },
    });
  }, [isDarkMode, resolvedTheme, mounted]);

  useEffect(() => {
    if (!mounted || !content) return;
    
    mermaid.run();
  }, [content, mounted, isDarkMode, resolvedTheme]);

  if (!mounted) {
    return <div className="min-h-96 w-full max-w-full overflow-scroll pt-4"></div>;
  }

  return (
    <div
      id="markdownOutput"
      className={`min-h-96 w-full prose prose-code:bg-slate-200 dark:prose-invert prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 dark:prose-code:bg-zinc-700/50 max-w-full pt-4 ${
        isDarkMode ? "dark-theme" : "light-theme"
      }`}
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}