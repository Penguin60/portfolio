import {
  getProjectsTags,
  createProject,
  getProjects,
  getProject,
  updateProject,
} from "@/server/queries";

import { MarkdownEditor, type LoadResult } from "@/components/mdeditor/mdeditor";

async function AdminProjects() {
  const options = await getProjectsTags();
  const allProjects = await getProjects();
  const posts = allProjects.map((p) => ({ id: p.id, title: p.title }));

  async function submitProjectAction(formData: FormData) {
    "use server";

    const idStr = formData.get("id") as string;
    const id = idStr ? Number(idStr) : null;
    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const image = formData.get("image") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];
    const description = formData.get("description") as string;
    const extendedDescription = formData.get("extendedDescription") as string;

    if (id) {
      await updateProject(
        id,
        title,
        link,
        image,
        tags,
        description,
        extendedDescription
      );
      return { success: true, message: "Project updated" };
    }
    await createProject(
      title,
      link,
      image,
      tags,
      description,
      extendedDescription
    );
    return { success: true, message: "Project created" };
  }

  async function loadProjectAction(id: number): Promise<LoadResult | null> {
    "use server";
    const rows = await getProject(id);
    const project = rows[0];
    if (!project) return null;
    return {
      kind: "project",
      id: project.id,
      title: project.title,
      link: project.link,
      image: project.image,
      description: project.description,
      extendedDescription: project.extendedDescription,
      tags: project.tags,
    };
  }

  return (
    <MarkdownEditor
      type="project"
      options={options}
      posts={posts}
      formAction={submitProjectAction}
      loadAction={loadProjectAction}
    />
  );
}

export default AdminProjects;
