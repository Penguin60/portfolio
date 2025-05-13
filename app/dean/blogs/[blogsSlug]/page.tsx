import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBlog } from "@/server/queries";

import "./blog.css";

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
        <CardContent>
          <div
            id="markdownOutput"
            className="min-h-96 w-full h-[82vh] prose prose-code:bg-slate-200 dark:prose-invert prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 dark:prose-code:bg-zinc-700/50 p-4 max-w-full overflow-scroll"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
