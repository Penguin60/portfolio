import ClientPenguin from "@/components/clientpenguin";
import { Separator } from "@/components/ui/separator";
import { getLatestBlogs, getLatestProjects } from "@/server/queries";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const revalidate = 60;

export default async function Home() {
  const [blogsData, projectsData, readingData, watchingData, developingData] = await Promise.all([
    getLatestBlogs(3),
    getLatestProjects(3),
    fetch("https://theca.rrashed.com/v/Penguin60/reading", {
      next: { revalidate },
    })
      .then(async (response) => {
        if (!response.ok) {
          return "Abundance";
        }

        const value = (await response.text()).trim();
        return value || "Abundance";
      })
      .catch(() => "Abundance"),
    fetch("https://theca.rrashed.com/v/Penguin60/watching", {
      next: { revalidate },
    })
      .then(async (response) => {
        if (!response.ok) {
          return "Adolescence";
        }

        const value = (await response.text()).trim();
        return value || "Adolescence";
      })
      .catch(() => "Adolescence"),
    fetch("https://theca.rrashed.com/v/Penguin60/developing", {
      next: { revalidate },
    })
      .then(async (response) => {
        if (!response.ok) {
          return "Zephyr - AI Drone";
        }

        const value = (await response.text()).trim();
        return value || "Zephyr - AI Drone";
      })
      .catch(() => "Zephyr - AI Drone"),
  ]);

  const blogs = blogsData.map((blog) => ({ ...blog, type: "blog" as const }));
  const projects = projectsData.map((project) => ({
    ...project,
    type: "project" as const,
  }));

  const latestItems = [...blogs, ...projects]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white items-start flex justify-start mt-3 pb-12 sm:pb-0">
      <div
        id="card"
        className="w-full flex mx-4"
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-sm">
                I&apos;m an 11th grade IB student interested in programming, robotics and design.
              </p>
              <p className="mt-2 text-sm">
                I love learning, experimenting and seeing the things I build come to life!
              </p>
              <p className="mt-4 text-sm">Recently I&apos;ve been:</p>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside marker:text-zinc-400">
                <li>
                  web/tech @
                  <a
                    href="https://jamhacks.ca"
                    className="font-medium underline underline-offset-4"
                  >
                    JAMHacks
                  </a>
                  , Canada&apos;s largest high school hackathon
                </li>
                <li>
                  building software @
                  <a
                    href="https://hackcanada.org"
                    className="font-medium underline underline-offset-4"
                  >
                    Hack Canada
                  </a>
                </li>
              </ul>
            </div>
            <Avatar className="w-24 h-24 shrink-0">
              <AvatarImage src="/profile.png" alt="Radean's Avatar" className="grayscale" />
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-md font-bold text-zinc-400 mt-8">Latest</h1>
          <Separator className="my-2" />
          {latestItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="w-full mt-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 pb-0"
            >
              {item.type === "blog" ? (
                <Link href={`/blogs/${item.id}`} className="group">
                  <div className="pb-2 flex justify-between items-start">
                    <h3 className="text-black dark:text-white text-md font-bold group-hover:underline">
                      {item.title}{" "}
                      <span className="text-xs text-zinc-400">Blog</span>
                    </h3>
                    <div className="flex items-center text-gray-800 dark:text-gray-300 text-xs text-right min-w-fit ml-4 mt-auto">
                      {item.createdAt.getDate().toString() +
                        " " +
                        item.createdAt.toLocaleString("default", {
                          month: "long",
                        }) +
                        " " +
                        item.createdAt.getFullYear()}
                    </div>
                  </div>
                  <div className="pb-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 text-left">
                          <h2 className="text-black dark:text-white text-xs mb-6">
                            {item.description}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href={`/projects/${item.id}`} className="group">
                  <div className="pb-2 flex justify-between items-start">
                    <h3 className="text-black dark:text-white text-md font-bold group-hover:underline">
                      {item.title}{" "}
                      <span className="text-xs text-zinc-400">Project</span>
                    </h3>
                    <div className="flex items-center text-gray-800 dark:text-gray-300 text-xs text-right min-w-fit ml-4 mt-auto">
                      {item.createdAt.getDate().toString() +
                        " " +
                        item.createdAt.toLocaleString("default", {
                          month: "long",
                        }) +
                        " " +
                        item.createdAt.getFullYear()}
                    </div>
                  </div>
                  <div className="pb-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 text-left">
                          <h2 className="text-black dark:text-white text-xs mb-6">
                            {item.description}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
          <h1 className="text-md font-bold text-zinc-400 mt-8">About</h1>
          <Separator className="my-2" />
          <div>
            <div className="flex items-center justify-between w-full mt-3">
              <h3 className="text-sm font-bold">Reading</h3>
              <div className="flex-1 border-t border-dashed border-zinc-400 mx-2"></div>
              <h3 className="text-right min-w-fit text-sm">{readingData}</h3>
            </div>
            <div className="flex items-center justify-between w-full mt-3">
              <h3 className="text-sm font-bold">Watching</h3>
              <div className="flex-1 border-t border-dashed border-zinc-400 mx-2"></div>
              <h3 className="text-right min-w-fit text-sm">{watchingData}</h3>
            </div>
            <div className="flex items-center justify-between w-full mt-3">
              <h3 className="text-sm font-bold">Developing</h3>
              <div className="flex-1 border-t border-dashed border-zinc-400 mx-2"></div>
              <h3 className="text-right min-w-fit text-sm">
                {developingData}
              </h3>
            </div>
          </div>
          <div className="hidden sm:block">
            <ClientPenguin />
          </div>
          <div className="flex items-center justify-between mt-12 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <div className="space-x-6">
              <a
                href="https://www.linkedin.com/in/radean-rashed-7aa621362"
                className="hover:underline transition-all underline-offset-4"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Penguin60"
                className="hover:underline transition-all underline-offset-4"
              >
                GitHub
              </a>
            </div>
            <a
              href="mailto:radean.rashed@gmail.com"
              className="hover:underline transition-all underline-offset-4"
            >
              radean.rashed [at] gmail [dot] com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
