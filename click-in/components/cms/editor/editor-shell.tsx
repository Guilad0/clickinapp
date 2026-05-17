"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEditorStore } from "@/stores/editor-store";
import { BlockLibrary } from "./block-library";
import { EditorCanvas } from "./editor-canvas";
import { PropertyPanel } from "./property-panel";
import { SeoPanel } from "./seo-panel";
import { EditorChat } from "./editor-chat";
import {
  ArrowLeft,
  Save,
  Rocket,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
  Sparkles,
  X,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorShellProps {
  pageId: string;
}

export function EditorShell({ pageId }: EditorShellProps) {
  const {
    loadPage,
    loadBlockTypes,
    saveDraft,
    publishPage,
    saving,
    publishing,
    loading,
    pageTitle,
    pageSlug,
    pageStatus,
    activePanel,
    setActivePanel,
    previewDevice,
    setPreviewDevice,
  } = useEditorStore();

  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    useEditorStore.getState().setPageContext(pageId);
    loadPage();
    loadBlockTypes();
  }, [pageId, loadPage, loadBlockTypes]);

  const statusBadge = {
    DRAFT: "text-amber-400 bg-amber-400/10",
    PUBLISHED: "text-emerald-400 bg-emerald-400/10",
    PENDING_CHANGES: "text-orange-400 bg-orange-400/10",
    ERROR: "text-red-400 bg-red-400/10",
  }[pageStatus] || "text-white/30 bg-white/5";

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/tree"
            className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Árbol
          </Link>
          <span className="text-white/10">/</span>
          <span className="text-sm text-white/80 truncate font-medium">
            {pageTitle || "Cargando..."}
          </span>
          <span className="text-[10px] text-white/20 hidden sm:inline">
            /{pageSlug || "raíz"}
          </span>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded font-medium",
              statusBadge
            )}
          >
            {pageStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={saveDraft}
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Guardar
          </button>

          <button
            onClick={publishPage}
            disabled={publishing || loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            {publishing ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
            Publicar
          </button>

          <div className="w-px h-5 bg-white/10" />

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              chatOpen
                ? "bg-violet-600/20 text-violet-400 border border-violet-500/20"
                : "border border-white/10 text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <Sparkles size={12} />
            AI
            {chatOpen ? <PanelRightClose size={12} /> : <PanelRightOpen size={12} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-52 border-r border-white/5 bg-zinc-900/50 overflow-y-auto shrink-0">
          <BlockLibrary />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          <div
            className={cn(
              "flex-1 overflow-auto transition-all",
              previewDevice === "tablet" && "max-w-3xl mx-auto w-full border-x border-white/5",
              previewDevice === "mobile" && "max-w-sm mx-auto w-full border-x border-white/5"
            )}
          >
            <EditorCanvas />
          </div>

          <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/5 bg-zinc-900 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePanel("properties")}
                className={cn(
                  "text-[10px] px-2 py-1 rounded transition-colors",
                  activePanel === "properties" ? "text-white bg-white/10" : "text-white/30"
                )}
              >
                Propiedades
              </button>
              <button
                onClick={() => setActivePanel("seo")}
                className={cn(
                  "text-[10px] px-2 py-1 rounded transition-colors",
                  activePanel === "seo" ? "text-white bg-white/10" : "text-white/30"
                )}
              >
                SEO
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  previewDevice === "desktop" ? "text-white bg-white/10" : "text-white/20 hover:text-white"
                )}
                title="Desktop"
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  previewDevice === "tablet" ? "text-white bg-white/10" : "text-white/20 hover:text-white"
                )}
                title="Tablet"
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  previewDevice === "mobile" ? "text-white bg-white/10" : "text-white/20 hover:text-white"
                )}
                title="Mobile"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel: properties/SEO or AI chat */}
        {chatOpen ? (
          <div className="w-80 border-l border-white/5 bg-zinc-900 shrink-0 overflow-hidden">
            <EditorChat pageTitle={pageTitle || "página"} />
          </div>
        ) : (
          <div className="w-64 border-l border-white/5 bg-zinc-900/50 overflow-y-auto shrink-0">
            {activePanel === "properties" ? <PropertyPanel /> : <SeoPanel />}
          </div>
        )}
      </div>
    </div>
  );
}
