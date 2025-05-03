import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 text-black dark:text-white items-center flex justify-center h-full mt-3">
      <Card className="relative w-[97vw] h-[88vh] overflow-hidden flex flex-col">
        <h1 className="ml-5 mt-5 text-xl">Welcome, Radean.</h1>
      </Card>
    </main>
  );
}
