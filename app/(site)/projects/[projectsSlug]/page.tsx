import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProject } from "@/server/queries";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { mdxComponents } from "@/lib/mdx-components";

export const revalidate = 3600;

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

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white flex justify-center">
      <div className="w-full max-w-[45rem] flex flex-col mx-4">
        <div className="flex flex-col w-full">
          <div>
            <a
              href={project.link}
              className="text-black dark:text-white text-3xl font-bold hover:underline"
            >
              {project.title}
            </a>
            <div className="mt-2">
              {project.tags.map((tag) => (
                <Badge key={tag} className="mr-0.5 text-2xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Separator className="my-4" />
          </div>
          <div className="prose dark:prose-invert max-w-none pb-12">
            <MDXRemote
              source={project.extendedDescription}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeHighlight],
                },
              }}
              components={mdxComponents}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
