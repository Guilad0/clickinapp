import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import AdminShell from "@/components/cms/layout/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/tree");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
