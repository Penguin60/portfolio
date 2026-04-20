"use server";

import { put } from "@vercel/blob";
import { db } from "@/db";
import { penguinCounterTable } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

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