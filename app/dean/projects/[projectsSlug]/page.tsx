import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProject } from "@/server/queries";

type PageParams = {
  params: {
    projectsSlug: string;
  };
};

export default async function ProjectPage({ params }: PageParams) {
  const { projectsSlug } = params;

  const projectsSlugNumber = Number(projectsSlug);

  const projects = await getProject(projectsSlugNumber);

  const project = projects[0];

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex-col justify-start mx-auto items-center">
        <CardHeader>
          <a href={project.link} className="text-black dark:text-white text-4xl font-bold">
            {project.title}
          </a>
          <div>
            {project.tags.map((tag) => (
              <Badge key={tag} className="mr-0.5">{tag}</Badge>
            ))}
          </div>
          <img
            src={project.image}
            alt={project.title}
            className="rounded-xl max-h-[30vh] max-w-[30vw]"
          />
        </CardHeader>
        <CardContent>
          <p className="text-black dark:text-white text-lg max-w-[90vw]">{project.extendedDescription}</p>
        </CardContent>
      </Card>
    </main>
  );
}