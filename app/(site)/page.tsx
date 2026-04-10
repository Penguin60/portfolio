import ClientPenguin from "@/components/clientpenguin";
import { Separator } from "@/components/ui/separator";
import { getLatestBlogs, getLatestProjects } from "@/server/queries";
import Link from "next/link";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const revalidate = 3600;

export default async function Home() {
  const [blogsData, projectsData, readingData, watchingData, developingData] = await Promise.all([
    getLatestBlogs(3),
    getLatestProjects(3),
    fetch("https://theca.rrashed.com/v/dean/reading", {
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
    fetch("https://theca.rrashed.com/v/dean/watching", {
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
    fetch("https://theca.rrashed.com/v/dean/developing", {
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
          <div className="flex items-center">
            <div>
              <p className="text-lg">
                <strong>Hey there</strong>, I&apos;m <strong>Radean</strong>
              </p>
              <div className="flex items-center mt-4">
                <Button asChild variant="ghost" size="icon">
                  <a
                    href="https://www.linkedin.com/in/radean-rashed-7aa621362"
                    aria-label="LinkedIn"
                  >
                    <LinkedInLogoIcon />
                  </a>
                </Button>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <Button asChild variant="ghost" size="icon">
                  <a href="https://github.com/Penguin60" aria-label="GitHub">
                    <GitHubLogoIcon />
                  </a>
                </Button>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <Button asChild variant="ghost" size="icon">
                  <a href="mailto:radean.rashed@gmail.com" aria-label="Email">
                    <EnvelopeClosedIcon />
                  </a>
                </Button>
              </div>
            </div>
            <Avatar className="ml-auto w-16 h-16">
              <AvatarImage src="/profile.jpeg" alt="Radean's Avatar" />
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
          </div>
          <p className="mt-4 text-sm">
            I&apos;m an 11th grade IB student interested in programming, robotics and design.
          </p>
          <p className="mt-2 text-sm">
            I love learning, experimenting and seeing the things I build come to life!
          </p>
          <br />
          <br />
          <h1 className="text-md font-bold text-zinc-400">Latest</h1>
          <Separator className="my-2" />
          {latestItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="w-[85vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] mt-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 pb-0"
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
          <br />
          <br />
          <h1 className="text-md font-bold text-zinc-400">About</h1>
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
        </div>
      </div>
    </main>
  );
}
