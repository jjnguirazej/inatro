import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav name={session.name} />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
