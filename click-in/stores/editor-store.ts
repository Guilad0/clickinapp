import { create } from "zustand";

export interface BlockData {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemaType?: string;
  indexable?: boolean;
}

interface EditorState {
  pageId: string | null;
  pageTitle: string;
  pageSlug: string;
  pageStatus: string;
  blocks: BlockData[];
  selectedBlockId: string | null;
  seo: SeoData;
  blockTypes: Array<{
    id: string;
    name: string;
    category: string;
    icon: string;
    defaultPropsJson: Record<string, unknown>;
    propsSchemaJson: Record<string, unknown>;
  }>;
  loading: boolean;
  saving: boolean;
  publishing: boolean;
  activePanel: "properties" | "seo";
  previewDevice: "desktop" | "tablet" | "mobile";

  setPageContext: (pageId: string) => void;
  setPageMeta: (data: { title: string; slug: string; status: string }) => void;
  setBlocks: (blocks: BlockData[]) => void;
  selectBlock: (id: string | null) => void;
  addBlock: (type: string, defaultProps: Record<string, unknown>) => void;
  updateBlockProps: (id: string, props: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  setSeo: (seo: SeoData) => void;
  setActivePanel: (panel: "properties" | "seo") => void;
  setPreviewDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setBlockTypes: (types: EditorState["blockTypes"]) => void;

  loadPage: () => Promise<void>;
  loadBlockTypes: () => Promise<void>;
  saveDraft: () => Promise<void>;
  publishPage: () => Promise<void>;
}

let idCounter = 0;
function genId() {
  return `block_${Date.now()}_${++idCounter}`;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  pageId: null,
  pageTitle: "",
  pageSlug: "",
  pageStatus: "",
  blocks: [],
  selectedBlockId: null,
  seo: { indexable: true },
  blockTypes: [],
  loading: false,
  saving: false,
  publishing: false,
  activePanel: "properties",
  previewDevice: "desktop",

  setPageContext: (pageId) => set({ pageId }),
  setPageMeta: (data) =>
    set({
      pageTitle: data.title,
      pageSlug: data.slug,
      pageStatus: data.status,
    }),
  setBlocks: (blocks) => set({ blocks }),
  selectBlock: (id) => set({ selectedBlockId: id, activePanel: "properties" }),
  addBlock: (type, defaultProps) => {
    const newBlock: BlockData = {
      id: genId(),
      type,
      props: { ...defaultProps },
    };
    set((s) => ({
      blocks: [...s.blocks, newBlock],
      selectedBlockId: newBlock.id,
    }));
  },
  updateBlockProps: (id, props) => {
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b
      ),
    }));
  },
  removeBlock: (id) => {
    set((s) => ({
      blocks: s.blocks.filter((b) => b.id !== id),
      selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
    }));
  },
  moveBlock: (fromIndex, toIndex) => {
    set((s) => {
      const blocks = [...s.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { blocks };
    });
  },
  setSeo: (seo) => set({ seo }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setPreviewDevice: (device) => set({ previewDevice: device }),
  setBlockTypes: (types) => set({ blockTypes: types }),

  loadPage: async () => {
    const { pageId } = get();
    if (!pageId) return;
    set({ loading: true });
    const res = await fetch(`/api/pages/${pageId}`);
    if (!res.ok) {
      set({ loading: false });
      return;
    }
    const page = await res.json();
    set({
      pageTitle: page.title,
      pageSlug: page.slug,
      pageStatus: page.status,
      blocks: (page.blocksJson as BlockData[]) || [],
      seo: (page.seoJson as SeoData) || { indexable: true },
      loading: false,
    });
  },

  loadBlockTypes: async () => {
    const res = await fetch("/api/block-types");
    if (res.ok) {
      const types = await res.json();
      set({ blockTypes: types });
    }
  },

  saveDraft: async () => {
    const { pageId, blocks, seo } = get();
    if (!pageId) return;
    set({ saving: true });
    await fetch(`/api/pages/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blocksJson: blocks.map((b) => ({ type: b.type, props: b.props })),
        seoJson: seo,
        status: "PENDING_CHANGES",
      }),
    });
    set({ saving: false, pageStatus: "PENDING_CHANGES" });
  },

  publishPage: async () => {
    const { pageId, blocks, seo } = get();
    if (!pageId) return;
    set({ publishing: true });
    await fetch(`/api/pages/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blocksJson: blocks.map((b) => ({ type: b.type, props: b.props })),
        seoJson: seo,
      }),
    });
    await fetch(`/api/pages/${pageId}/publish`, { method: "POST" });
    set({ publishing: false, pageStatus: "PUBLISHED" });
  },
}));
