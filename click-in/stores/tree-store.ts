import { create } from "zustand";

export type PageStatus = "DRAFT" | "PUBLISHED" | "PENDING_CHANGES" | "ERROR";

export interface PageNode {
  id: string;
  siteId: string;
  parentId: string | null;
  title: string;
  slug: string;
  status: PageStatus;
  language: string;
  blocksJson: unknown;
  seoJson: { metaTitle?: string; metaDescription?: string; indexable?: boolean } | null;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { children: number };
  children?: PageNode[];
}

export type FilterStatus = "ALL" | "PUBLISHED" | "DRAFT" | "PENDING_CHANGES" | "ERROR";

interface TreeState {
  pages: PageNode[];
  siteId: string | null;
  filter: FilterStatus;
  selectedPageId: string | null;
  createModalOpen: boolean;
  createParentId: string | null;
  loading: boolean;
  publishingAll: boolean;

  setSiteId: (siteId: string) => void;
  setFilter: (filter: FilterStatus) => void;
  selectPage: (id: string | null) => void;
  setCreateModal: (open: boolean, parentId?: string) => void;

  fetchPages: () => Promise<void>;
  createPage: (data: { title: string; slug: string; parentId?: string }) => Promise<void>;
  updatePage: (id: string, data: Partial<PageNode>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  publishPage: (id: string) => Promise<void>;
  publishAll: () => Promise<void>;

  getFilteredPages: () => PageNode[];
  getPageTree: () => PageNode[];
  getPagePath: (pageId: string) => PageNode[];
}

export const useTreeStore = create<TreeState>((set, get) => ({
  pages: [],
  siteId: null,
  filter: "ALL",
  selectedPageId: null,
  createModalOpen: false,
  createParentId: null,
  loading: false,
  publishingAll: false,

  setSiteId: (siteId) => set({ siteId }),
  setFilter: (filter) => set({ filter }),
  selectPage: (id) => set({ selectedPageId: id }),
  setCreateModal: (open, parentId) =>
    set({ createModalOpen: open, createParentId: parentId ?? null }),

  fetchPages: async () => {
    const { siteId } = get();
    if (!siteId) return;
    set({ loading: true });
    try {
      const res = await fetch(`/api/sites/${siteId}/pages`);
      if (!res.ok) {
        console.error("Error al cargar páginas:", res.status);
        set({ loading: false });
        return;
      }
      const pages = await res.json();
      if (Array.isArray(pages)) {
        set({ pages, loading: false });
      } else {
        console.error("Respuesta inválida de páginas:", pages);
        set({ loading: false });
      }
    } catch (err) {
      console.error("Error al cargar páginas:", err);
      set({ loading: false });
    }
  },

  createPage: async (data) => {
    const { siteId, fetchPages } = get();
    if (!siteId) return;
    await fetch(`/api/sites/${siteId}/pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchPages();
  },

  updatePage: async (id, data) => {
    await fetch(`/api/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { fetchPages } = get();
    await fetchPages();
  },

  deletePage: async (id) => {
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    const { fetchPages } = get();
    await fetchPages();
  },

  publishPage: async (id) => {
    await fetch(`/api/pages/${id}/publish`, { method: "POST" });
    const { fetchPages } = get();
    await fetchPages();
  },

  publishAll: async () => {
    set({ publishingAll: true });
    const { pages } = get();
    const pending = pages.filter((p) => p.status === "PENDING_CHANGES");
    await Promise.all(
      pending.map((p) => fetch(`/api/pages/${p.id}/publish`, { method: "POST" }))
    );
    const { fetchPages } = get();
    await fetchPages();
    set({ publishingAll: false });
  },

  getFilteredPages: () => {
    const { pages, filter } = get();
    if (filter === "ALL") return pages;
    return pages.filter((p) => p.status === filter);
  },

  getPageTree: () => {
    const pages = get().getFilteredPages();
    const map = new Map<string, PageNode>();
    const roots: PageNode[] = [];

    for (const page of pages) {
      map.set(page.id, { ...page, children: [] });
    }

    for (const page of pages) {
      const node = map.get(page.id)!;
      if (page.parentId && map.has(page.parentId)) {
        map.get(page.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    }

    for (const [, node] of map) {
      node.children!.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    roots.sort((a, b) => a.sortOrder - b.sortOrder);

    return roots;
  },

  getPagePath: (pageId: string) => {
    const { pages } = get();
    const path: PageNode[] = [];
    let current = pages.find((p) => p.id === pageId);
    while (current) {
      path.unshift(current);
      current = pages.find((p) => p.id === current!.parentId);
    }
    return path;
  },
}));
