import "server-only";

import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { projectsTable, blogsTable } from "@/db/schema";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  const projects = await db.query.projectsTable.findMany({
    orderBy: [desc(projectsTable.createdAt)],
  });
  return projects;
}

export async function getLatestProjects(limit: number) {
  const projects = await db.query.projectsTable.findMany({
    orderBy: [desc(projectsTable.createdAt)],
    limit,
  });
  return projects;
}

export async function getProject(id: number) {
  const project = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id));
  return project;
}

export async function getProjectsTags() {
  const projects = await db.query.projectsTable.findMany({
    columns: {
      tags: true,
    },
  });
  const tags = projects.map((project) => project.tags).flat();
  const uniqueTags = [...new Set(tags)];
  return uniqueTags;
}

export async function getBlogs() {
  const blogs = await db.query.blogsTable.findMany({
    orderBy: [desc(blogsTable.createdAt)],
  });
  return blogs;
}

export async function getLatestBlogs(limit: number) {
  const blogs = await db.query.blogsTable.findMany({
    orderBy: [desc(blogsTable.createdAt)],
    limit,
  });
  return blogs;
}

export async function getBlog(id: number) {
  const blog = await db.select().from(blogsTable).where(eq(blogsTable.id, id));
  return blog;
}

export async function getBlogsTags() {
  const blogs = await db.query.blogsTable.findMany({
    columns: {
      tags: true,
    },
  });
  const tags = blogs.map((blog) => blog.tags).flat();
  const uniqueTags = [...new Set(tags)];
  return uniqueTags;
}

export async function createProject(
  title: string,
  link: string,
  image: string,
  tags: string[],
  description: string,
  extendedDescription: string
) {
  const project = await db.insert(projectsTable).values({
    title,
    link,
    image,
    tags,
    description,
    extendedDescription,
  });
  revalidatePath("/");
  revalidatePath("/projects");
  return project;
}

export async function createBlog(
  title: string,
  description: string,
  contentUrl: string,
  tags: string[]
) {
  const blog = await db.insert(blogsTable).values({
    title,
    tags,
    description,
    contentUrl,
  });
  revalidatePath("/");
  revalidatePath("/blogs");
  return blog;
}

export async function updateBlog(
  id: number,
  title: string,
  description: string,
  contentUrl: string,
  tags: string[]
) {
  const blog = await db
    .update(blogsTable)
    .set({ title, description, contentUrl, tags })
    .where(eq(blogsTable.id, id));
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${id}`);
  return blog;
}

export async function updateProject(
  id: number,
  title: string,
  link: string,
  image: string,
  tags: string[],
  description: string,
  extendedDescription: string
) {
  const project = await db
    .update(projectsTable)
    .set({ title, link, image, tags, description, extendedDescription })
    .where(eq(projectsTable.id, id));
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}