import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getProjects } from "@/server/queries";

export default async function Projects() {
  const projects = await getProjects();
  return (
    <main className="bg-zinc-950 dark flex justify-start items-center h-full">
      <Card className="w-[97vw] h-[88vh] flex flex-col justify-start mx-auto items-center">
        {projects.map((project) => (
          <Card key={project.id} className="w-[95vw] mt-[2vh]">
            <CardHeader>
              <h1 className="text-white text-4xl font-bold">{project.title}</h1>
              <div>
                {project.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-left">
                    <h2 className="text-white text-lg max-w-[30vw]">
                      {project.description}
                    </h2>
                  </div>
                  <img
                    src={project.image}
                    className="rounded-t-lg max-w-[32vw] max-h-[25vh]"
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