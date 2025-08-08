import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBlog } from "@/server/queries";
import RenderedMarkdown from "@/components/renderedmd/renderedmd";

type PageParams = {
  params: Promise<{
    blogsSlug: string;
  }>;
};

export default async function BlogPage({ params }: PageParams) {
  const { blogsSlug } = await params;

  const blogsSlugNumber = Number(blogsSlug);

  const blogs = await getBlog(blogsSlugNumber);

  const blog = blogs[0];

  return (
    <main
      className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="w-[85vw] sm:w-[80vw] md:w-[71vw] lg:w-[62vw] xl:w-[48vw] h-[88vh] flex-col justify-start mx-auto items-center">
        <div>
          <div className="flex justify-between items-center">
            <p className="text-black dark:text-white text-3xl font-bold">
              {blog.title}
            </p>
            <div className="text-gray-800 dark:text-gray-300 text-sm">
              {blog.createdAt.getDate().toString() +
                " " +
                blog.createdAt.toLocaleString("default", {
                  month: "long",
                }) +
                " " +
                blog.createdAt.getFullYear()}
            </div>
          </div>
          <div>
            {blog.tags.map((tag) => (
              <Badge key={tag} className="mr-0.5 text-2xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator className="my-4" />
        </div>
        <div className="max-h-[75vh]">
          <RenderedMarkdown content={blog.content} />
        </div>
      </div>
    </main>
  );
}
