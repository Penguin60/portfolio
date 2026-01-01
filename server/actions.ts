"use server";

import { put } from "@vercel/blob";

export async function uploadBlob(formData: FormData, path: string) {
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file provided");
  }

  const blob = await put(`${path}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return { url: blob.url };
}