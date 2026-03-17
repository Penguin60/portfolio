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
    <main className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white flex justify-start items-start h-full mt-3 pb-4 sm:pb-0">
      <div className="w-full flex flex-col justify-start mx-4 overflow-y-auto pb-4">
        {blogs.map((blog, idx) => (
          <div
            key={blog.id}
            className="w-[85vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] mt-3 mb-3"
          >
            <Link href={"blogs/" + blog.id} className="group">
              <div className="flex items-center justify-between py-2">
                {/* Year left-aligned */}
                <span className="text-zinc-400 text-sm min-w-[60px] text-left">
                  {blog.createdAt.getFullYear()}
                </span>
                {/* Title center-aligned */}
                <span className="text-black dark:text-white text-sm font-normal group-hover:underline flex-1 mx-4">
                  {blog.title}
                </span>
                {/* Day + Month right-aligned */}
                <span className="text-zinc-400 text-sm min-w-[80px] text-right">
                  {blog.createdAt.getDate().toString().padStart(2, "0")}
                  {" "}
                  {blog.createdAt.toLocaleString("default", { month: "long" })}
                </span>
              </div>
              {/* Separator except after last item */}
              {idx !== blogs.length - 1 && <Separator className="my-2" />}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
