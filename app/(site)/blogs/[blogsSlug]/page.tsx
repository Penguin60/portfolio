import { getBlog } from "@/server/queries";
import { getMdxContent } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/lib/mdx-components";

export const revalidate = 3600;

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

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const mdxSource = await getMdxContent(blog.contentUrl);

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white flex justify-center">
      <div className="w-full max-w-[45rem] flex flex-col mx-4">
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
        <div className="mt-6 prose dark:prose-invert max-w-none pb-12">
          <MDXRemote
            source={mdxSource}
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
    </main>
  );
}
