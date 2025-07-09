import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { getProjects } from "@/server/queries";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Projects() {
  const projects = await getProjects();
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-start items-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex flex-col justify-start mx-auto items-center overflow-y-scroll">
        {projects.map((project) => (
          <Card key={project.id} className="w-[95vw] mt-3 mb-3">
            <CardHeader className="pb-2">
              <Link
                href={"projects/" + project.id}
                className="text-black dark:text-white text-4xl font-bold"
              >
                {project.title}
              </Link>
              <div>
                {project.tags.map((tag) => (
                  <Badge key={tag} className="mr-0.5">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-left">
                    <h2 className="text-black dark:text-white text-l max-w-[30vw]">
                      {project.description}
                    </h2>
                  </div>
                  <img
                    src={project.image}
                    className="rounded-t-lg max-w-[32vw] max-h-[32vh]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Card>
    </main>
  );
}