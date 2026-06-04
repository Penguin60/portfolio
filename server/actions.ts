"use server";

import { put } from "@vercel/blob";
import { db } from "@/db";
import { penguinCounterTable } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export async function getPenguinCount(): Promise<number> {
  await db
    .insert(penguinCounterTable)
    .values({ id: 1, count: 0 })
    .onConflictDoNothing();

  const [row] = await db
    .select({ count: penguinCounterTable.count })
    .from(penguinCounterTable)
    .where(eq(penguinCounterTable.id, 1));

  return row?.count ?? 0;
}

export async function incrementPenguinCount(): Promise<number> {
  await db
    .insert(penguinCounterTable)
    .values({ id: 1, count: 0 })
    .onConflictDoNothing();

  const [row] = await db
    .update(penguinCounterTable)
    .set({ count: sql`${penguinCounterTable.count} + 1` })
    .where(eq(penguinCounterTable.id, 1))
    .returning({ count: penguinCounterTable.count });

  return row.count;
}

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

export type PreviewResult =
  | { ok: true; serialized: MDXRemoteSerializeResult }
  | { ok: false; error: string };

export async function previewMdx(source: string): Promise<PreviewResult> {
  try {
    const serialized = await serialize(source, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    });
    return { ok: true, serialized };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}
