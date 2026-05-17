import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Plus, FileText, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function BlogListPage() {
  const session = await auth();
  if (!session?.user?.tenantId) return null;

  const site = await prisma.site.findUnique({
    where: { tenantId: session.user.tenantId },
  });
  if (!site) return null;

  const posts = await prisma.blogPost.findMany({
    where: { siteId: site.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });

  const statusColors: Record<string, string> = {
    DRAFT: "text-amber-400 bg-amber-400/10",
    PUBLISHED: "text-emerald-400 bg-emerald-400/10",
    SCHEDULED: "text-blue-400 bg-blue-400/10",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="mt-1 text-sm text-white/40">{posts.length} artículos</p>
        </div>
        <Link
          href="/blog/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <Plus size={14} />
          Nuevo artículo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-zinc-900 p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/10">
            <FileText size={28} className="text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Sin artículos</h2>
          <p className="mt-2 text-sm text-white/40">
            Crea tu primer artículo para el blog corporativo.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] font-medium text-white/20 uppercase px-4 py-3">
                    Título
                  </th>
                  <th className="text-left text-[10px] font-medium text-white/20 uppercase px-4 py-3 hidden sm:table-cell">
                    Categoría
                  </th>
                  <th className="text-left text-[10px] font-medium text-white/20 uppercase px-4 py-3 hidden md:table-cell">
                    Estado
                  </th>
                  <th className="text-left text-[10px] font-medium text-white/20 uppercase px-4 py-3 hidden lg:table-cell">
                    Fecha
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-sm text-white hover:text-blue-400 transition-colors font-medium"
                      >
                        {post.title}
                      </Link>
                      <p className="text-[11px] text-white/20 mt-0.5 truncate max-w-xs">
                        {post.excerpt || "Sin extracto"}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-white/30">
                        {post.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColors[post.status] || ""}`}
                      >
                        {post.status === "DRAFT" ? "Borrador" : post.status === "PUBLISHED" ? "Publicado" : "Programado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-white/30">
                        {formatDate(post.createdAt)}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/blog/${post.id}`}
                          className="p-1 rounded text-white/20 hover:text-white hover:bg-white/5"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
