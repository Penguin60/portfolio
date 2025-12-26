import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBlogs } from "@/server/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Blogs() {
  const blogs = await getBlogs();
  blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-start items-center h-full mt-3 pb-4 sm:pb-0">
      <div className="w-[97vw] flex flex-col justify-start mx-auto items-center overflow-y-auto pb-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="w-[85vw] sm:w-[80vw] md:w-[71vw] lg:w-[62vw] xl:w-[48vw] mt-3 mb-3"
          >
            <Link href={"blogs/" + blog.id} className="group">
              <div className="pb-2 flex justify-between items-start">
                <h3 className="text-black dark:text-white text-2xl font-bold group-hover:underline">
                  {blog.title}
                </h3>
                <div className="flex items-center text-gray-800 dark:text-gray-300 text-sm text-right min-w-fit ml-4 mt-auto">
                  {blog.createdAt.getDate().toString() +
                    " " +
                    blog.createdAt.toLocaleString("default", {
                      month: "long",
                    }) +
                    " " +
                    blog.createdAt.getFullYear()}
                </div>
              </div>
              <div className="pb-0">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 text-left">
                      <h2 className="text-black dark:text-white text-sm mb-6">
                        {blog.description}
                      </h2>
                    </div>
                  </div>
                </div>
                {blog != blogs[blogs.length - 1] && (
                  <Separator className="my-2" />
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
