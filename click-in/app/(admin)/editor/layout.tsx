import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] -m-6">
      {children}
    </div>
  );
}
