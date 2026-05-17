"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTreeStore, type PageNode } from "@/stores/tree-store";
import { TreeToolbar } from "./tree-toolbar";
import { PageCreateModal } from "./page-create-modal";
import { FlowCanvas } from "./flow-canvas";
import { CmdChat } from "./cmd-chat";
import { Loader2, PanelRightClose, PanelRightOpen, Terminal } from "lucide-react";

// Mock data — simula un sitio real con jerarquía
const MOCK_PAGES: PageNode[] = [
  { id: "m1", siteId: "s1", parentId: null,  title: "Inicio",         slug: "inicio",        status: "PUBLISHED", language: "es", blocksJson: null, seoJson: { metaTitle: "Inicio", metaDescription: "Landing principal" }, sortOrder: 0, publishedAt: "2026-05-01T00:00:00Z", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z", _count: { children: 5 } },
  { id: "m2", siteId: "s1", parentId: "m1",  title: "Servicios",      slug: "servicios",      status: "PUBLISHED", language: "es", blocksJson: null, seoJson: { metaTitle: "Servicios" }, sortOrder: 0, publishedAt: "2026-05-02T00:00:00Z", createdAt: "2026-05-02T00:00:00Z", updatedAt: "2026-05-02T00:00:00Z", _count: { children: 2 } },
  { id: "m3", siteId: "s1", parentId: "m1",  title: "Nosotros",       slug: "nosotros",       status: "PUBLISHED", language: "es", blocksJson: null, seoJson: null, sortOrder: 1, publishedAt: "2026-05-02T00:00:00Z", createdAt: "2026-05-02T00:00:00Z", updatedAt: "2026-05-02T00:00:00Z", _count: { children: 0 } },
  { id: "m4", siteId: "s1", parentId: "m1",  title: "Blog",           slug: "blog",           status: "DRAFT",    language: "es", blocksJson: null, seoJson: null, sortOrder: 2, publishedAt: null, createdAt: "2026-05-03T00:00:00Z", updatedAt: "2026-05-03T00:00:00Z", _count: { children: 0 } },
  { id: "m5", siteId: "s1", parentId: "m1",  title: "Contacto",       slug: "contacto",       status: "PENDING_CHANGES", language: "es", blocksJson: null, seoJson: { metaTitle: "Contacto" }, sortOrder: 3, publishedAt: "2026-05-04T00:00:00Z", createdAt: "2026-05-04T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z", _count: { children: 0 } },
  { id: "m6", siteId: "s1", parentId: "m1",  title: "Galería",        slug: "galeria",        status: "DRAFT",    language: "es", blocksJson: null, seoJson: null, sortOrder: 4, publishedAt: null, createdAt: "2026-05-05T00:00:00Z", updatedAt: "2026-05-05T00:00:00Z", _count: { children: 0 } },
  { id: "m7", siteId: "s1", parentId: "m2",  title: "Desarrollo Web", slug: "desarrollo-web",  status: "PUBLISHED", language: "es", blocksJson: null, seoJson: { metaTitle: "Desarrollo Web" }, sortOrder: 0, publishedAt: "2026-05-06T00:00:00Z", createdAt: "2026-05-06T00:00:00Z", updatedAt: "2026-05-06T00:00:00Z", _count: { children: 0 } },
  { id: "m8", siteId: "s1", parentId: "m2",  title: "Marketing",      slug: "marketing",      status: "ERROR",    language: "es", blocksJson: null, seoJson: null, sortOrder: 1, publishedAt: null, createdAt: "2026-05-06T00:00:00Z", updatedAt: "2026-05-06T00:00:00Z", _count: { children: 0 } },
];

interface TreeViewProps {
  siteId: string;
}

export function TreeView({ siteId }: TreeViewProps) {
  const router = useRouter();
  const { fetchPages, getFilteredPages, setSiteId, setCreateModal, loading, createPage } =
    useTreeStore();
  const [chatOpen, setChatOpen] = useState(true);
  const [useMock, setUseMock] = useState(true);
  const [mockPages] = useState<PageNode[]>(MOCK_PAGES);

  useEffect(() => {
    setSiteId(siteId);
    fetchPages().then(() => {
      // Switch to real data after fetch completes
      const real = getFilteredPages();
      if (real.length > 0) setUseMock(false);
    });
  }, [siteId, setSiteId, fetchPages, getFilteredPages]);

  const pages = useMock ? mockPages : getFilteredPages();

  const handleCreateFromChat = async (title: string, slug: string, parentId?: string) => {
    await createPage({ title, slug, parentId });
    setUseMock(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-3 shrink-0 border-b border-white/5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <TreeToolbar siteId={siteId} />
        </div>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex-shrink-0 mt-1.5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Terminal size={13} />
          CMD CMS
          {chatOpen ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
        </button>
      </div>

      {/* Board area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Flow diagram */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950" style={{ minHeight: 0 }}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="text-blue-400 animate-spin" />
              <span className="text-sm text-white/30">Cargando...</span>
            </div>
          ) : (
            <FlowCanvas
              pages={pages}
              onClickNode={(page) => router.push(`/editor/${page.id}`)}
              onAddChild={(parentId) => setCreateModal(true, parentId)}
            />
          )}
        </div>

        {/* CMD Chat sidebar */}
        <div
          className="shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
          style={{ width: chatOpen ? "360px" : "0px" }}
        >
          <CmdChat
            pagesCount={pages.length}
            onCreatePage={handleCreateFromChat}
            onEditPage={(id) => router.push(`/editor/${id}`)}
            onDeletePage={(id) => {}}
          />
        </div>
      </div>

      <PageCreateModal />
    </div>
  );
}
