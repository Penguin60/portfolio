import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getProjects } from "@/server/queries";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const projects = await getProjects();
  return (
    <main
      className="bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-start items-center h-full mt-3 overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="w-[97vw] h-[88vh] flex flex-col justify-start mx-auto items-center">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group w-[48vw] mt-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 pb-0 hover:cursor-pointer"
          >
            <Link href={"projects/" + project.id}>
              <div className="pb-2">
                <h3 className="text-black dark:text-white text-2xl font-bold group-hover:underline">
                  {project.title}
                </h3>
                <div className="!mt-0">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="mr-0.5 text-2xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="pb-0">
                <div>
                  <h2 className="text-zinc-700 dark:text-zinc-300 text-sm mb-3 text-left">
                    {project.description}
                  </h2>
                  <div className="flex justify-end">
                    <Image
                      alt={project.title}
                      src={project.image}
                      className="rounded-t-lg max-w-[32vw] max-h-[32vh] mt-2"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
