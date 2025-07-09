import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBlogs } from "@/server/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Blogs() {
  const blogs = await getBlogs();
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-start items-center h-full mt-3">
      <Card className="w-[97vw] h-[88vh] flex flex-col justify-start mx-auto items-center overflow-y-scroll">
        {blogs.map((blog) => (
          <div key={blog.id} className="w-[95vw] mt-3 mb-3">
            <Link href={"blogs/" + blog.id}>
              <CardHeader className="pb-2">
                <h1 className="text-black dark:text-white text-4xl font-bold">
                  {blog.title}
                </h1>
                <div className="text-gray-800 dark:text-gray-300 text-sm">
                  {blog.createdAt.getDate().toString() +
                    " " +
                    blog.createdAt.toLocaleString("default", {
                      month: "long",
                    }) +
                    " " +
                    blog.createdAt.getFullYear()}
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
                {blog != blogs[blogs.length - 1] && (
                  <Separator className="my-2" />
                )}
              </CardContent>
            </Link>
          </div>
        ))}
      </Card>
    </main>
  );
}
