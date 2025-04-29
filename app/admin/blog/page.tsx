import { getProjectsTags, createBlog } from "@/server/queries";

import { Card } from "@/components/ui/card";

import { MarkdownEditor } from "@/components/mdeditor/mdeditor";

import "@/components/mdeditor/mdeditor.css";
async function AdminBlog() {
  const options = await getProjectsTags();

  async function createBlogAction(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    const description = formData.get("description") as string;
    
    await createBlog(title, description, content, tags);
    
    return { success: true, message: "Blog created successfully" };
  }

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
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
