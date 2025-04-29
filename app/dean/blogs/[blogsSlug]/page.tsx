import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlog } from "@/server/queries";

import "./blog.css";

type PageParams = {
  params: {
    blogsSlug: string;
  };
};

export default async function BlogPage({ params }: PageParams) {
  const { blogsSlug } = params;

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
        </CardHeader>
        <CardContent>
          <div
            id="markdownOutput"
            className="min-h-96 h-[95%] w-full prose dark:prose-invert p-4 max-w-full"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
