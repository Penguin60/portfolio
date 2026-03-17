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
      className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="w-[85vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] flex flex-col mx-4">
        <div>
          <div className="flex justify-between items-center">
            <p className="text-black dark:text-white text-3xl font-bold">
              {blog.title}
            </p>
          </div>
          <div className="pt-2">
            <div className="text-zinc-400 text-sm">
              {blog.createdAt.toLocaleString("default", {
                month: "long",
              }) +
                " " +
                blog.createdAt.getDate().toString() +
                ", " +
                blog.createdAt.getFullYear()}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <RenderedMarkdown content={blog.content} />
        </div>
      </div>
    </main>
  );
}
