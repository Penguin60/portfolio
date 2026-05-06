"use client";

import { useEffect, useState } from "react";
import React from "react";
import NextImage from "next/image";

interface ImageData {
  src: string;
  label: string;
}

interface BentoLayout {
  cols: number;
  rows: number;
  aspect: string;
  template: string;
  areas: string[];
}

const LAYOUTS: Record<number, BentoLayout> = {
  1: {
    cols: 1, rows: 1, aspect: "16 / 9",
    template: `"a"`,
    areas: ["a"],
  },
  2: {
    cols: 2, rows: 1, aspect: "16 / 9",
    template: `"a b"`,
    areas: ["a", "b"],
  },
  3: {
    cols: 3, rows: 2, aspect: "3 / 2",
    template: `"a a b" "a a c"`,
    areas: ["a", "b", "c"],
  },
  4: {
    cols: 3, rows: 3, aspect: "1 / 1",
    template: `"a a b" "a a c" "a a d"`,
    areas: ["a", "b", "c", "d"],
  },
  5: {
    cols: 4, rows: 2, aspect: "2 / 1",
    template: `"a a b c" "a a d e"`,
    areas: ["a", "b", "c", "d", "e"],
  },
  6: {
    cols: 3, rows: 3, aspect: "1 / 1",
    template: `"a a b" "a a c" "d e f"`,
    areas: ["a", "b", "c", "d", "e", "f"],
  },
  7: {
    cols: 4, rows: 3, aspect: "4 / 3",
    template: `"a a b c" "a a d c" "e e f g"`,
    areas: ["a", "b", "c", "d", "e", "f", "g"],
  },
  8: {
    cols: 4, rows: 3, aspect: "4 / 3",
    template: `"a a b c" "a a d e" "f f g h"`,
    areas: ["a", "b", "c", "d", "e", "f", "g", "h"],
  },
  9: {
    cols: 4, rows: 3, aspect: "4 / 3",
    template: `"a a b c" "a a d e" "f g h i"`,
    areas: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
  },
};

const GAP = "4px";
const MAX_PER_BLOCK = 9;

function balanceChunks<T>(items: T[]): T[][] {
  const n = items.length;
  if (n <= MAX_PER_BLOCK) return [items];

  const numChunks = Math.ceil(n / MAX_PER_BLOCK);
  const baseSize = Math.floor(n / numChunks);
  const extras = n % numChunks;

  const chunks: T[][] = [];
  let pos = 0;
  for (let i = 0; i < numChunks; i++) {
    const size = baseSize + (i < extras ? 1 : 0);
    chunks.push(items.slice(pos, pos + size));
    pos += size;
  }
  return chunks;
}

function extractImages(children: React.ReactNode): ImageData[] {
  const out: ImageData[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as Record<string, any>;
    const src = props.src ?? "";
    if (!src) return;
    out.push({ src, label: props.caption ?? props.alt ?? "" });
  });
  return out;
}

function BentoBlock({
  images,
  onSelect,
}: {
  images: ImageData[];
  onSelect: (img: ImageData) => void;
}) {
  const layout = LAYOUTS[images.length];
  if (!layout) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateAreas: layout.template,
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
        aspectRatio: layout.aspect,
        gap: GAP,
      }}
    >
      {images.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(img)}
          className="relative cursor-pointer rounded-lg overflow-hidden transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          style={{ gridArea: layout.areas[i] }}
        >
          <NextImage
            src={img.src}
            alt={img.label}
            fill
            sizes="(max-width: 768px) 50vw, 600px"
            style={{ objectFit: "cover" }}
          />
        </button>
      ))}
    </div>
  );
}

function Lightbox({
  image,
  onClose,
}: {
  image: ImageData;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-px"
        onClick={(e) => e.stopPropagation()}
      >
        <NextImage
          src={image.src}
          alt={image.label}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "75vh",
            objectFit: "contain",
          }}
          className="rounded-lg shadow-2xl"
        />
        {image.label && (
          <p className="m-0 text-white/80 text-sm text-center">{image.label}</p>
        )}
      </div>
    </div>
  );
}

export function Collage({ children }: { children: React.ReactNode }) {
  const [lightbox, setLightbox] = useState<ImageData | null>(null);

  const images = extractImages(children);
  if (images.length === 0) return null;

  const chunks = balanceChunks(images);

  return (
    <>
      <div className="not-prose my-6 flex flex-col" style={{ gap: GAP }}>
        {chunks.map((chunk, i) => (
          <BentoBlock key={i} images={chunk} onSelect={setLightbox} />
        ))}
      </div>

      {lightbox && (
        <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
