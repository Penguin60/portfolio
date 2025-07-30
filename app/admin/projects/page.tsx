import { getProjectsTags, createProject } from "@/server/queries";

import { Card } from "@/components/ui/card";

import { MarkdownEditor } from "@/components/mdeditor/mdeditor";

import "@/components/mdeditor/mdeditor.css";
async function AdminProjects() {
  const options = await getProjectsTags();

  async function createProjectsAction(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const image = formData.get("image") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    const description = formData.get("description") as string;
    const extendedDescription = formData.get("extendedDescription") as string;
    
    await createProject(title, link, image, tags, description, extendedDescription);
    
    return { success: true, message: "Projects created successfully" };
  }

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card
        id="card"
        className="relative w-[97vw] h-[88vh] overflow-scroll flex flex-col"
      >
        <MarkdownEditor type="projects" options={options} formAction={createProjectsAction}/>
      </Card>
    </main>
  );
}

export default AdminProjects;