"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";

interface MdxImageProps {
  src: string;
  alt?: string;
  caption?: string;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

export function MdxImage({ src, alt, caption, maxWidth = "100%", maxHeight = "auto" }: MdxImageProps) {
  const [open, setOpen] = useState(false);
  const label = caption ?? alt ?? "";

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <figure className="my-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-pointer rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          <NextImage
            src={src}
            alt={label}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 800px"
            style={{ width: "100%", maxWidth, maxHeight, height: "auto" }}
            className="rounded-lg"
          />
        </button>
        {label && (
          <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400 italic">
            {label}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-px"
            onClick={(e) => e.stopPropagation()}
          >
            <NextImage
              src={src}
              alt={label}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "75vh", objectFit: "contain" }}
              className="rounded-lg shadow-2xl"
            />
            {label && (
              <p className="m-0 text-white/80 text-sm text-center">{label}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
