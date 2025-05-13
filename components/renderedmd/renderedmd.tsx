"use client";

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import mermaid from "mermaid";
import { useEffect } from "react";

export default function RenderedMarkdown({content}: {content: string}) {

    const marked = new Marked(
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  marked.use({
    renderer: {
      code: function (code) {
        if (code.lang == "mermaid")
          return `<pre class="mermaid">${code.text}</pre>`;
        return false;
      },
    },
  });

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        darkMode: false,
      },
      flowchart: {
        curve: "basis",
      },
    });
    mermaid.run();
  });

    return (
        <div
            id="markdownOutput"
            className="min-h-96 w-full prose prose-code:bg-slate-200 dark:prose-invert prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 dark:prose-code:bg-zinc-700/50 max-w-full overflow-scroll pt-4"
            dangerouslySetInnerHTML={{ __html: content }}
            suppressHydrationWarning
        />
    )
}