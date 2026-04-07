import { getBlogsTags, createBlog } from "@/server/queries";
import { put } from "@vercel/blob";

import { Card } from "@/components/ui/card";

import { MarkdownEditor } from "@/components/mdeditor/mdeditor";

import "@/components/mdeditor/mdeditor.css";
async function AdminBlog() {
  const options = await getBlogsTags();

  async function createBlogAction(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const mdxFile = formData.get("mdxFile") as File;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    const description = formData.get("description") as string;

    if (!mdxFile || mdxFile.size === 0) {
      return { success: false, message: "MDX file is required" };
    }

    // Upload MDX to Vercel Blob
    const blob = await put(`blogs/${mdxFile.name}`, mdxFile, {
      access: "public",
    });
    
    await createBlog(title, description, blob.url, tags);
    
    return { success: true, message: "Blog created successfully" };
  }

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card
        id="card"
        className="relative w-[97vw] h-[88vh] overflow-hidden flex flex-col"
      >
        <MarkdownEditor type="blog" options={options} formAction={createBlogAction}/>
      </Card>
    </main>
  );
}

export default AdminBlog;
