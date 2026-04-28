import {
  getBlogsTags,
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
} from "@/server/queries";
import { put } from "@vercel/blob";

import { MarkdownEditor, type LoadResult } from "@/components/mdeditor/mdeditor";

async function AdminBlog() {
  const options = await getBlogsTags();
  const allBlogs = await getBlogs();
  const posts = allBlogs.map((b) => ({ id: b.id, title: b.title }));

  async function submitBlogAction(formData: FormData) {
    "use server";

    const idStr = formData.get("id") as string;
    const id = idStr ? Number(idStr) : null;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    const description = formData.get("description") as string;

    if (!content || content.trim().length === 0) {
      return { success: false, message: "Content is required" };
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "post";

    const blob = await put(
      `blogs/${slug}.mdx`,
      new Blob([content], { type: "text/markdown" }),
      { access: "public", addRandomSuffix: true }
    );

    if (id) {
      await updateBlog(id, title, description, blob.url, tags);
      return { success: true, message: "Blog updated" };
    }
    await createBlog(title, description, blob.url, tags);
    return { success: true, message: "Blog created" };
  }

  async function loadBlogAction(id: number): Promise<LoadResult | null> {
    "use server";
    const rows = await getBlog(id);
    const blog = rows[0];
    if (!blog) return null;
    const res = await fetch(blog.contentUrl, { cache: "no-store" });
    if (!res.ok) return null;
    const content = await res.text();
    return {
      kind: "blog",
      id: blog.id,
      title: blog.title,
      description: blog.description,
      tags: blog.tags,
      content,
    };
  }

  return (
    <MarkdownEditor
      type="blog"
      options={options}
      posts={posts}
      formAction={submitBlogAction}
      loadAction={loadBlogAction}
    />
  );
}

export default AdminBlog;
