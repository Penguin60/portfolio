import Link from "next/link";

function Navbar() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white m-0 p-0 items-start flex mx-4">
      <div className="w-full h-16 flex flex-col justify-center mt-5">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-black dark:text-white hover:underline transition-all underline-offset-4">
            Radean
          </Link>
          <div className="ml-auto space-x-6">
            <Link href="/projects" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:underline transition-all underline-offset-4">
              Projects
            </Link>
            <Link href="/blogs" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:underline transition-all underline-offset-4">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
