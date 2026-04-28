"use client";

import { useEffect, useRef, useState } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { previewMdx } from "@/server/actions";
import { mdxComponents } from "@/lib/mdx-components";

export function MdxPreview({ source }: { source: string }) {
  const [serialized, setSerialized] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const seqRef = useRef(0);

  useEffect(() => {
    if (!source.trim()) {
      setSerialized(null);
      setError(null);
      return;
    }
    const mySeq = ++seqRef.current;
    const handle = setTimeout(async () => {
      setPending(true);
      const result = await previewMdx(source);
      if (mySeq !== seqRef.current) return;
      if (result.ok) {
        setSerialized(result.serialized);
        setError(null);
      } else {
        setError(result.error);
      }
      setPending(false);
    }, 300);
    return () => clearTimeout(handle);
  }, [source]);

  if (!source.trim()) {
    return (
      <div className="text-sm text-zinc-500 italic pt-4">
        Start writing to see a preview.
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-none pt-4 relative">
      {pending && !serialized && (
        <div className="text-xs text-zinc-500">Rendering…</div>
      )}
      {error && (
        <pre className="not-prose text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md p-3 whitespace-pre-wrap">
          {error}
        </pre>
      )}
      {serialized && (
        <MDXRemote {...serialized} components={mdxComponents} />
      )}
    </div>
  );
}
