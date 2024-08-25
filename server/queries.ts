import "server-only";

import { db } from "@/db";

export async function getProjects() {
    const projects = await db.query.projectsTable.findMany();
    return projects;
}