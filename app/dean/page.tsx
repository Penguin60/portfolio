import ClientPenguin from "@/components/clientpenguin";
import { Separator } from "@/components/ui/separator";
import { getBlogs, getProjects } from "@/server/queries";
import Link from "next/link";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const blogsData = await getBlogs();
  const projectsData = await getProjects();

  const blogs = blogsData.map((blog) => ({ ...blog, type: "blog" }));
  const projects = projectsData.map((project) => ({
    ...project,
    type: "project",
  }));

  const latestItems = [...blogs, ...projects]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center mt-3">
      <div
        id="card"
        className="relative w-[48vw] h-[88vh] flex overflow-hidden"
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center">
            <div>
              <p className="text-lg">
                <strong>Hey there</strong>, I&apos;m <strong>Radean</strong>
              </p>
              <div className="flex items-center mt-4">
                <Button variant="ghost" size="icon">
                  <a href="mailto:radean.rashed@gmail.com">
                    <EnvelopeClosedIcon />
                  </a>
                </Button>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <Button variant="ghost" size="icon">
                  <a href="https://github.com/Penguin60">
                    <GitHubLogoIcon />
                  </a>
                </Button>
                <Separator orientation="vertical" className="h-4 mx-2" />
                <Button variant="ghost" size="icon">
                  <a href="https://www.linkedin.com/in/radean-rashed-7aa621362">
                    <LinkedInLogoIcon />
                  </a>
                </Button>
              </div>
            </div>
            <Avatar className="ml-auto w-16 h-16">
              <AvatarImage src="profile.png" alt="Radean's Avatar" />
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
          </div>
          <p className="mt-4 text-sm">
            I&apos;m a 10th grade IB student with a passion for{" "}
            <strong>programming</strong>, <strong>robotics</strong> and{" "}
            <strong>mathematics</strong>.
          </p>
          <p className="mt-2 text-sm">
            I love learning new skills, experimenting with technology and
            creating fun projects with my{" "}
            <a href="https://github.com/orgs/STRNerds/" className="underline">
              friends
            </a>
            !
          </p>
          <p className="mt-2 text-sm">
            When I&apos;m not coding, you&apos;ll find me{" "}
            <strong>reading</strong>, playing <strong>tennis</strong> or
            cramming for exams.
          </p>
          <br />
          <br />
          <h1 className="text-md font-bold text-zinc-400">Latest</h1>
          <Separator className="my-2" />
          {latestItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="w-[48vw] mt-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 pb-0"
            >
              {item.type === "blog" ? (
                <Link href={`dean/blogs/${item.id}`} className="group">
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
                          <h2 className="text-black dark:text-white text-xs max-w-[30vw] mb-6">
                            {item.description}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href={`dean/projects/${item.id}`} className="group">
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
                          <h2 className="text-black dark:text-white text-xs max-w-[30vw] mb-6">
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
              <h3 className="text-right min-w-fit text-sm">War and Peace</h3>
            </div>
            <div className="flex items-center justify-between w-full mt-3">
              <h3 className="text-sm font-bold">Watching</h3>
              <div className="flex-1 border-t border-dashed border-zinc-400 mx-2"></div>
              <h3 className="text-right min-w-fit text-sm">Andor</h3>
            </div>
            <div className="flex items-center justify-between w-full mt-3">
              <h3 className="text-sm font-bold">Developing</h3>
              <div className="flex-1 border-t border-dashed border-zinc-400 mx-2"></div>
              <h3 className="text-right min-w-fit text-sm">
                Zephyr - AI Drone
              </h3>
            </div>
          </div>
          <ClientPenguin />
        </div>
      </div>
    </main>
  );
}
