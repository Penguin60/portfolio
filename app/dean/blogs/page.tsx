import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { getBlogs } from "@/server/queries";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Blogs() {
  const blogs = await getBlogs();
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-start items-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex flex-col justify-start mx-auto items-center overflow-scroll">
        {blogs.map((blog) => (
          <Card key={blog.id} className="w-[95vw] mt-3 mb-3">
            <CardHeader>
              <Link
                href={"blogs/" + blog.id}
                className="text-black dark:text-white text-4xl font-bold"
              >
                {blog.title}
              </Link>
              <div>
                {blog.tags.map((tag) => (
                  <Badge key={tag} className="mr-0.5">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-left">
                    <h2 className="text-black dark:text-white text-l max-w-[30vw] mb-6">
                      {blog.description}
                    </h2>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Card>
    </main>
  );
}