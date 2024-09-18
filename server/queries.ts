import "server-only";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { projectsTable } from "@/db/schema";

export async function getProjects() {
    const projects = await db.query.projectsTable.findMany();
    return projects;
}

export async function getProject(id: number) {
    const project = await db.select().from(projectsTable).where(eq(projectsTable.id, id))
    return project;
}