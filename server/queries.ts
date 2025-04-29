import "server-only";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { projectsTable, blogsTable } from "@/db/schema";

export async function getProjects() {
    const projects = await db.query.projectsTable.findMany();
    return projects;
}

export async function getProject(id: number) {
    const project = await db.select().from(projectsTable).where(eq(projectsTable.id, id))
    return project;
}

export async function getProjectsTags() {
    const projects = await db.query.projectsTable.findMany({
        columns: {
            tags: true,
        }
    });
    const tags = projects.map((project) => project.tags).flat();
    const uniqueTags = [...new Set(tags)];
    return uniqueTags;
}

export async function getBlogsTags() {
    const blogs = await db.query.blogsTable.findMany({
        columns: {
            tags: true,
        }
    });
    const tags = blogs.map((blog) => blog.tags).flat();
    const uniqueTags = [...new Set(tags)];
    return uniqueTags;
}

export async function createProject(title: string, link: string, image: string, tags: string[], description: string, extendedDescription: string) {
    const project = await db.insert(projectsTable).values({
        title,
        link,
        image,
        tags,
        description,
        extendedDescription
    });
    return project;
}

export async function createBlog(title: string, description: string, content: string, tags: string[]) {
    const blog = await db.insert(blogsTable).values({
        title,
        tags,
        description,
        content
    });
    return blog;
}