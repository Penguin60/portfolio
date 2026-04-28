import AdminNavbar from "@/components/adminnavbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/auth/unauthorized");
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
