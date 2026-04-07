import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

function Navbar() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white m-0 p-0 items-start flex mx-4">
      <div className="w-full h-16 flex flex-col justify-center mt-5">
        <div className="flex items-center">
          <div className="space-x-6">
            <Link href="/" className="w-16 text-sm font-medium text-black dark:text-white hover:underline transition-all underline-offset-4">
              Home
            </Link>
            <Link href="/projects" className="w-16 text-sm font-medium text-black dark:text-white hover:underline transition-all underline-offset-4">
              Projects
            </Link>
            <Link href="/blogs" className="w-16 text-sm font-medium text-black dark:text-white hover:underline transition-all underline-offset-4">
              Blog
            </Link>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
