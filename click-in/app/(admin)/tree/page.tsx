import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { TreeView } from "@/components/cms/tree/tree-view";

export default async function TreePage() {
  const session = await auth();
  if (!session?.user?.tenantId) redirect("/login");

  const site = await prisma.site.findUnique({
    where: { tenantId: session.user.tenantId },
  });

  if (!site) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Árbol de Rutas</h1>
        <div className="rounded-xl border border-white/5 bg-zinc-900 p-10 text-center">
          <p className="text-white/40">No se encontró un sitio configurado.</p>
        </div>
      </div>
    );
  }

  return <TreeView siteId={site.id} />;
}
