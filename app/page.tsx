import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getProjects } from "@/server/queries";

export default async function Home() {
  const projects = await getProjects();
  const projectsCount = projects.length;

  function formatCount(count: number) {
    return count < 10 ? `0${count}` : count.toString();
  }

  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full">
      <Card className="w-[97vw] h-[88vh] flex">
        <div className="flex flex-col w-full h-full">
          <div className="m-8 flex items-center">
            <Avatar className="w-14 h-14">
              <AvatarImage src="/profile.png" />
              <AvatarFallback>RR</AvatarFallback>
            </Avatar>
            <p className="ml-3 text-lg">
              <strong>Hey there</strong>, I&apos;m <strong>Radean</strong>
            </p>
          </div>
          <p className="m-8 mt-0 text-lg">
            I&apos;m a 10th grade IB student with a passion for{" "}
            <strong>programming</strong>, <strong>robotics</strong> and{" "}
            <strong>mathematics</strong>.
          </p>
          <p className="m-8 mt-0 text-lg">
            I love learning new skills, experimenting with technology and
            creating fun projects with my{" "}
            <a href="https://github.com/orgs/STRNerds/" className="underline">
              friends
            </a>
            !
          </p>
          <p className="m-8 mt-0 text-lg">
            When I&apos;m not coding, you&apos;ll find me <strong>reading</strong>,
            playing <strong>tennis</strong> or cramming for exams.
          </p>
          <div className="m-8 mt-auto">
            <h1 className="text-5xl font-bold">{formatCount(projectsCount)}</h1>
            <p className="mt-1">Projects created</p>
          </div>
        </div>
      </Card>
    </main>
  );
}
