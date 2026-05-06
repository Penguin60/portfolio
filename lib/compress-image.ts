const SKIP_TYPES = new Set(["image/svg+xml", "image/gif"]);

export async function compressImage(
  file: File,
  opts: { maxDimension?: number; quality?: number; maxBytes?: number } = {}
): Promise<File> {
  const { maxDimension = 2048, quality = 0.82, maxBytes = 1024 * 1024 } = opts;

  if (!file.type.startsWith("image/")) return file;
  if (SKIP_TYPES.has(file.type)) return file;
  if (file.size <= maxBytes && file.type !== "image/png") return file;

  const bitmap = await loadBitmap(file);
  const { width, height } = fitWithin(bitmap.width, bitmap.height, maxDimension);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap) (bitmap as ImageBitmap).close?.();

  const supportsWebp = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  const outType = supportsWebp ? "image/webp" : "image/jpeg";
  const ext = supportsWebp ? "webp" : "jpg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outType, quality)
  );
  if (!blob) return file;
  if (blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, {
    type: outType,
    lastModified: Date.now(),
  });
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {}
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function fitWithin(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = w > h ? max / w : max / h;
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
