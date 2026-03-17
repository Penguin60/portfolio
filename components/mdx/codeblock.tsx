"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string; // highlight.js adds language class here
}

export const CodeBlock = ({ children, className, style, ...props }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g., "language-python")
  const language = className?.split("-")[1] || "code";

  const copyToClipboard = () => {
    // Get text content from children
    const text = React.Children.toArray(children)
      .map(child => (typeof child === 'string' ? child : ''))
      .join('');
    
    // Fallback if the above doesn't work (React handles standard strings differently in server components)
    const codeText = document.getElementById(`code-${Math.random()}`)?.innerText || "";
    
    // We'll use a more robust way to get text in the actual implementation
  };

  return (
    <div className="not-prose relative group my-8 border border-[var(--ctp-surface1)] rounded-xl bg-[var(--ctp-base)] overflow-hidden transition-colors duration-200">
      <div className="flex justify-between items-center px-4 py-2 bg-[var(--ctp-surface0)] border-b border-[var(--ctp-surface1)]">
        <span className="text-[10px] font-bold text-[var(--ctp-overlay0)] uppercase tracking-widest leading-none">
          {language}
        </span>
        <button
          onClick={(e) => {
             const container = e.currentTarget.parentElement?.nextElementSibling;
             const code = container?.querySelector('code');
             if (code) {
               navigator.clipboard.writeText((code as HTMLElement).innerText);
               setCopied(true);
               setTimeout(() => setCopied(false), 2000);
             }
          }}
          className="text-[var(--ctp-overlay0)] hover:text-[var(--ctp-text)] transition-colors p-1"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-[var(--ctp-green)]" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4">
        <pre className="overflow-x-auto text-sm leading-relaxed font-mono text-[var(--ctp-text)] m-0">
          <code className={`${className}`} style={style} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};
