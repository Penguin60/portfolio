import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProject } from "@/server/queries";
import RenderedMarkdown from "@/components/renderedmd/renderedmd";

type PageParams = {
  params: Promise<{
    projectsSlug: string;
  }>;
};

export default async function ProjectPage({ params }: PageParams) {
  const { projectsSlug } = await params;

  const projectsSlugNumber = Number(projectsSlug);

  const projects = await getProject(projectsSlugNumber);

  const project = projects[0];

  return (
    <main
      className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="w-[48vw] h-[88vh] flex-col justify-start mx-auto items-center">
        <div>
          <a
            href={project.link}
            className="text-black dark:text-white text-3xl font-bold"
          >
            {project.title}
          </a>
          <div>
            {project.tags.map((tag) => (
              <Badge key={tag} className="mr-0.5 text-2xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator className="my-4" />
        </div>
        <div className="max-h-[75vh]">
          <RenderedMarkdown content={project.extendedDescription} />
        </div>
      </div>
    </main>
  );
}
