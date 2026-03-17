export async function getMdxContent(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch MDX content from ${url}`);
  }
  const content = await response.text();
  return content;
}
