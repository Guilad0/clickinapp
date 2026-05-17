"use client";

import { cn } from "@/lib/utils";
import { useTreeStore, type FilterStatus } from "@/stores/tree-store";
import { Plus, Rocket, Loader2, FileText, Globe, AlertTriangle } from "lucide-react";

import type { PageNode } from "@/stores/tree-store";

const filters: { value: FilterStatus; label: string; count: (p: PageNode[]) => number }[] = [
  { value: "ALL", label: "Todas", count: (p) => p.length },
  { value: "PUBLISHED", label: "Live", count: (p) => p.filter((x) => x.status === "PUBLISHED").length },
  { value: "DRAFT", label: "Draft", count: (p) => p.filter((x) => x.status === "DRAFT").length },
  { value: "PENDING_CHANGES", label: "Pending", count: (p) => p.filter((x) => x.status === "PENDING_CHANGES").length },
  { value: "ERROR", label: "Errores", count: (p) => p.filter((x) => x.status === "ERROR").length },
];

interface TreeToolbarProps {
  siteId: string;
}

export function TreeToolbar({ siteId }: TreeToolbarProps) {
  const { filter, setFilter, setCreateModal, publishAll, publishingAll, pages, loading } =
    useTreeStore();

  const published = pages.filter((p) => p.status === "PUBLISHED").length;
  const drafts = pages.filter((p) => p.status === "DRAFT").length;
  const pendingCount = pages.filter((p) => p.status === "PENDING_CHANGES").length;
  const errors = pages.filter((p) => p.status === "ERROR").length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-white">Board</h1>
        </div>

        {/* Stats pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400 font-medium">
            <Globe size={11} />
            {published}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px] text-amber-400 font-medium">
            <FileText size={11} />
            {drafts}
          </div>
          {errors > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 text-[10px] text-red-400 font-medium">
              <AlertTriangle size={11} />
              {errors}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Filter tabs */}
        <div className="flex items-center rounded-lg border border-white/5 bg-zinc-900 p-0.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1",
                filter === f.value
                  ? "bg-white/10 text-white"
                  : "text-white/25 hover:text-white/50"
              )}
            >
              {f.label}
              {f.value !== "ALL" && (
                <span className={cn(
                  "text-[9px]",
                  filter === f.value ? "text-white/50" : "text-white/15"
                )}>
                  {f.count(pages)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/5 hidden sm:block" />

        <button
          onClick={() => setCreateModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/10"
          disabled={loading}
        >
          <Plus size={13} />
          Nueva
        </button>

        {pendingCount > 0 && (
          <button
            onClick={publishAll}
            disabled={publishingAll}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/10"
          >
            {publishingAll ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Rocket size={12} />
            )}
            Publicar {pendingCount}
          </button>
        )}
      </div>
    </div>
  );
}
