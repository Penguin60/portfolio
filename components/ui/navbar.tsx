import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="bg-zinc-950 dark m-0 p-0 items-start flex justify-center">
      <Card className="w-[97vw] h-16 flex flex-col justify-center mt-5">
        <CardHeader>
          <CardTitle>
            <Button variant="ghost" className="w-16">
              Home
            </Button>
            <Button variant="ghost" className="w-16">
              About
            </Button>
            <Button variant="ghost" className="w-16">
              Blog
            </Button>
            <Button variant="ghost" className="w-16">
              Contact
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Navbar;
