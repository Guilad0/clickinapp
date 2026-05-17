"use client";

import { useState } from "react";
import { useTreeStore } from "@/stores/tree-store";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

export function PageCreateModal() {
  const { createModalOpen, setCreateModal, createParentId, createPage, pages } =
    useTreeStore();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const parentPage = createParentId ? pages.find((p) => p.id === createParentId) : null;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }

    const finalSlug = slug || slugify(title);
    if (!/^[a-z0-9-]+$/.test(finalSlug)) {
      setError("El slug solo puede contener letras minúsculas, números y guiones");
      return;
    }

    setSaving(true);
    try {
      await createPage({
        title: title.trim(),
        slug: finalSlug,
        parentId: createParentId ?? undefined,
      });
      setTitle("");
      setSlug("");
      setCreateModal(false);
    } catch {
      setError("Error al crear la página");
    } finally {
      setSaving(false);
    }
  };

  if (!createModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCreateModal(false)}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Nueva página</h2>
            {parentPage && (
              <p className="text-xs text-white/30 mt-0.5">
                Subpágina de <span className="text-white/50">{parentPage.title}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setCreateModal(false)}
            className="rounded-lg p-1.5 text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              Título de la página
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              autoFocus
              required
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              placeholder="Ej: Nuestros Servicios"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              URL Slug
            </label>
            <div className="flex items-center rounded-lg border border-white/10 bg-zinc-800 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/30">
              <span className="pl-3 text-xs text-white/20">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-transparent px-1 py-2 text-sm text-white placeholder-white/20 focus:outline-none"
                placeholder="nuestros-servicios"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
                "bg-blue-600 hover:bg-blue-500 disabled:opacity-50",
                "inline-flex items-center justify-center gap-2"
              )}
            >
              <Plus size={14} />
              {saving ? "Creando..." : "Crear página"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
