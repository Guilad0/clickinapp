"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Rocket, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Props {
  postId: string;
  siteId: string;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    contentHtml: string;
    status: string;
    categoryId: string;
    tags: string[];
    seoJson: Record<string, unknown>;
  };
}

export function BlogEditor({ postId, siteId, initialData }: Props) {
  const router = useRouter();
  const isNew = postId === "new";

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [contentHtml, setContentHtml] = useState(initialData?.contentHtml || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  };

  const savePost = async (pubStatus?: string) => {
    setSaving(true);
    const body = {
      title,
      slug: slug || slugify(title),
      excerpt,
      contentHtml,
      status: pubStatus || status,
    };

    if (isNew) {
      const res = await fetch(`/api/sites/${siteId}/blog/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const post = await res.json();
      setSaving(false);
      router.push(`/blog/${post.id}`);
    } else {
      await fetch(`/api/blog/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setSaving(false);
    }
  };

  const publishPost = async () => {
    setPublishing(true);
    if (isNew) {
      const res = await fetch(`/api/sites/${siteId}/blog/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          excerpt,
          contentHtml,
          status: "PUBLISHED",
        }),
      });
      const post = await res.json();
      await fetch(`/api/blog/posts/${post.id}/publish`, { method: "POST" });
      setPublishing(false);
      router.push("/blog");
    } else {
      await fetch(`/api/blog/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug: slug || slugify(title), excerpt, contentHtml }),
      });
      await fetch(`/api/blog/posts/${postId}/publish`, { method: "POST" });
      setPublishing(false);
      router.push("/blog");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Volver
          </Link>
          <h1 className="text-xl font-bold text-white">
            {isNew ? "Nuevo artículo" : "Editar artículo"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => savePost()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Guardar borrador
          </button>
          <button
            onClick={publishPost}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            {publishing ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
            Publicar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-900 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none"
            placeholder="Título del artículo"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Slug</label>
          <div className="flex items-center rounded-lg border border-white/10 bg-zinc-800">
            <span className="pl-3 text-xs text-white/20">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 bg-transparent px-1 py-2 text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Extracto <span className="text-white/20">(máx. 200 caracteres)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            maxLength={200}
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none resize-none"
            placeholder="Resumen corto del artículo..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Contenido</label>
          <textarea
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            rows={16}
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none resize-y font-mono text-xs"
            placeholder="<p>Escribe el contenido del artículo en HTML...</p>"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500/40 focus:outline-none"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="SCHEDULED">Programado</option>
          </select>
        </div>
      </div>
    </div>
  );
}
