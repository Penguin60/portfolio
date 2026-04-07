import { unstable_cache } from "next/cache";

async function fetchMdxContent(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch MDX content from ${url}`);
  }
  const content = await response.text();
  return content;
}

export const getMdxContent = unstable_cache(
  fetchMdxContent,
  ["mdx-content"],
  { revalidate: 3600, tags: ["mdx-content"] }
);
