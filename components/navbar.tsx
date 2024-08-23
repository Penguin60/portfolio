import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Navbar() {
  return (
    <div className="bg-zinc-950 dark m-0 p-0 items-start flex justify-center">
      <Card className="w-[97vw] h-16 flex flex-col justify-center mt-5">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link href="/" className="font-bold">
              <Button variant="ghost" className="w-16">
                Home
              </Button>
            </Link>
            <Link href="/projects" className="font-bold">
              <Button variant="ghost" className="w-16">
                Projects
              </Button>
            </Link>
            <Link href="/blog" className="font-bold">
              <Button variant="ghost" className="w-16">
                Blog
              </Button>
            </Link>
            <Link href="/contact" className="font-bold">
              <Button variant="ghost" className="w-16">
                Contact
              </Button>
            </Link>
            <Button variant="ghost" className="ml-auto">
              <SunIcon className="w-6 h-6" />
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default Navbar;
