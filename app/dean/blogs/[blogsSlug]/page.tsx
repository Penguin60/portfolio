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
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex-col justify-start mx-auto items-center">
        <CardHeader>
          <p className="text-black dark:text-white text-4xl font-bold">
            {blog.title}
          </p>
          <div>
            {blog.tags.map((tag) => (
              <Badge key={tag} className="mr-0.5">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="overflow-y-scroll max-h-[75vh]">
          <RenderedMarkdown content={blog.content} />
        </CardContent>
      </Card>
    </main>
  );
}
