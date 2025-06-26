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
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex-col justify-start mx-auto items-center">
        <CardHeader>
          <a
            href={project.link}
            className="text-black dark:text-white text-4xl font-bold"
          >
            {project.title}
          </a>
          <div>
            {project.tags.map((tag) => (
              <Badge key={tag} className="mr-0.5">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="overflow-y-scroll max-h-[75vh]">
          <RenderedMarkdown content={project.extendedDescription} />
        </CardContent>
      </Card>
    </main>
  );
}