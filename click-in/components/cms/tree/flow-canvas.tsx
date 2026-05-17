"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { PageNode } from "@/stores/tree-store";
import { Globe, AlertTriangle, Plus } from "lucide-react";

const NODE_W = 260;
const NODE_H = 100;
const H_GAP = 180;
const V_GAP = 160;

interface LayoutNode {
  page: PageNode;
  x: number;
  y: number;
  children: LayoutNode[];
  subtreeW: number;
}

function buildTreeLayout(flatPages: PageNode[]): LayoutNode[] {
  const map = new Map<string, LayoutNode>();
  const roots: LayoutNode[] = [];

  for (const p of flatPages) {
    map.set(p.id, { page: p, x: 0, y: 0, children: [], subtreeW: NODE_W });
  }

  for (const p of flatPages) {
    const node = map.get(p.id)!;
    if (p.parentId && map.has(p.parentId)) {
      map.get(p.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const [, node] of map) {
    node.children.sort((a, b) => a.page.sortOrder - b.page.sortOrder);
  }

  function measure(node: LayoutNode, depth: number): number {
    node.y = depth * (NODE_H + V_GAP);
    if (node.children.length === 0) {
      node.subtreeW = NODE_W;
      return NODE_W;
    }
    let w = 0;
    node.children.forEach((c, i) => {
      w += measure(c, depth + 1);
      if (i < node.children.length - 1) w += H_GAP;
    });
    node.subtreeW = w;
    return w;
  }

  function place(node: LayoutNode, startX: number) {
    node.x = startX + (node.subtreeW - NODE_W) / 2;
    let cursor = startX;
    for (const child of node.children) {
      place(child, cursor);
      cursor += child.subtreeW + H_GAP;
    }
  }

  for (const root of roots) measure(root, 0);

  let cursor = 0;
  roots.forEach((root, i) => {
    place(root, cursor);
    cursor += root.subtreeW + (i < roots.length - 1 ? H_GAP * 2 : 0);
  });

  return roots;
}

const statusMeta: Record<string, { border: string; dot: string; text: string }> = {
  PUBLISHED: { border: "border-emerald-500/50", dot: "bg-emerald-400", text: "text-emerald-400" },
  DRAFT: { border: "border-amber-500/50", dot: "bg-amber-400", text: "text-amber-400" },
  PENDING_CHANGES: { border: "border-orange-500/50", dot: "bg-orange-400", text: "text-orange-400" },
  ERROR: { border: "border-red-500/50", dot: "bg-red-400", text: "text-red-400" },
};

function buildPath(page: PageNode, allPages: PageNode[]): string {
  const segments: string[] = [];
  let current: PageNode | undefined = page;
  
  while (current) {
    segments.unshift(current.slug);
    current = allPages.find(p => p.id === current!.parentId);
  }
  
  const path = '/' + segments.join('/');
  return path === '//' ? '/' : path;
}

function NodeCard({
  node,
  onClick,
  onAddChild,
  allPages,
}: {
  node: LayoutNode;
  onClick: (p: PageNode) => void;
  onAddChild: (id: string) => void;
  allPages: PageNode[];
}) {
  const p = node.page;
  const st = statusMeta[p.status] ?? statusMeta.DRAFT;
  const hasSeo = !!(p.seoJson && (p.seoJson as Record<string, unknown>).metaTitle);
  const hasErr = p.status === "ERROR" || !hasSeo;
  const fullPath = buildPath(p, allPages);

  return (
    <div
      data-node
      className="absolute flex flex-col items-center"
      style={{ left: node.x, top: node.y, width: NODE_W }}
    >
      <div
        onClick={(e) => { e.stopPropagation(); onClick(p); }}
        className={cn(
          "w-full rounded-2xl border-2 px-4 py-4 cursor-pointer transition-all duration-200",
          "bg-gradient-to-br from-zinc-800 to-zinc-900",
          "hover:from-zinc-700 hover:to-zinc-800",
          "hover:scale-[1.02] hover:shadow-2xl",
          "group shadow-xl backdrop-blur-sm",
          st.border
        )}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{p.title}</p>
            <p className="mt-0.5 text-[11px] text-blue-400/70 truncate font-mono" title={fullPath}>
              {fullPath || '/'}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasErr && <AlertTriangle size={13} className="text-red-400/80" />}
            {hasSeo && !hasErr && <Globe size={13} className="text-emerald-500/80" />}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold",
            st.text,
            p.status === "PUBLISHED" ? "bg-emerald-500/10" : 
            p.status === "DRAFT" ? "bg-amber-500/10" :
            p.status === "PENDING_CHANGES" ? "bg-orange-500/10" : "bg-red-500/10"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
            {p.status === "PUBLISHED" ? "LIVE" : p.status === "DRAFT" ? "DRAFT" : p.status === "PENDING_CHANGES" ? "PENDING" : "ERROR"}
          </span>
          {p.parentId && (
            <span className="text-[9px] text-white/20 font-mono">
              L{(allPages.filter(ap => ap.parentId === p.parentId).findIndex(ap => ap.id === p.id) + 1)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onAddChild(p.id); }}
        className="mt-2 flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border-2 border-dashed border-white/10 text-white/20 hover:border-blue-400/60 hover:text-blue-400 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        title="Agregar subpágina"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function EdgeLines({ roots }: { roots: LayoutNode[] }) {
  type Edge = { x1: number; y1: number; x2: number; y2: number };
  const edges: Edge[] = [];

  function walk(n: LayoutNode) {
    const px = n.x + NODE_W / 2;
    const py = n.y + NODE_H;
    for (const c of n.children) {
      edges.push({ x1: px, y1: py, x2: c.x + NODE_W / 2, y2: c.y });
      walk(c);
    }
  }
  roots.forEach(walk);

  if (edges.length === 0) return null;

  const pad = 60;
  const allX = edges.flatMap((e) => [e.x1, e.x2]);
  const allY = edges.flatMap((e) => [e.y1, e.y2]);
  const minX = Math.min(...allX) - pad;
  const minY = Math.min(...allY) - pad;
  const w = Math.max(...allX) + pad - minX;
  const h = Math.max(...allY) + pad - minY;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: minX, top: minY, width: w, height: h, overflow: "visible" }}
    >
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(59 130 246 / 0.3)" />
          <stop offset="100%" stopColor="rgb(59 130 246 / 0.15)" />
        </linearGradient>
      </defs>
      {edges.map((e, i) => {
        const mx = e.x1 - minX;
        const my = e.y1 - minY;
        const ex = e.x2 - minX;
        const ey = e.y2 - minY;
        const midY = (my + ey) / 2;
        return (
          <path
            key={i}
            d={`M ${mx} ${my} C ${mx} ${midY}, ${ex} ${midY}, ${ex} ${ey}`}
            fill="none"
            stroke="url(#edge-gradient)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function flatten(nodes: LayoutNode[]): LayoutNode[] {
  const result: LayoutNode[] = [];
  function walk(n: LayoutNode) {
    result.push(n);
    n.children.forEach(walk);
  }
  nodes.forEach(walk);
  return result;
}

interface FlowCanvasProps {
  pages: PageNode[];
  onClickNode: (page: PageNode) => void;
  onAddChild: (parentId: string) => void;
}

export function FlowCanvas({ pages, onClickNode, onAddChild }: FlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const initialCentered = useRef(false);

  const roots = useMemo(() => buildTreeLayout(pages), [pages]);
  const allNodes = useMemo(() => flatten(roots), [roots]);

  const bounds = useMemo(() => {
    if (allNodes.length === 0) return { w: 800, h: 400 };
    const xs = allNodes.map((n) => n.x);
    const ys = allNodes.map((n) => n.y);
    return {
      w: Math.max(...xs) + NODE_W + 200,
      h: Math.max(...ys) + NODE_H + 200,
    };
  }, [allNodes]);

  useEffect(() => {
    if (allNodes.length === 0) return;
    
    const tryCenter = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      if (containerW === 0 || containerH === 0) {
        requestAnimationFrame(tryCenter);
        return;
      }
      const rootX = roots[0]?.x ?? bounds.w / 2;
      const rootY = roots[0]?.y ?? 60;
      setPan({
        x: containerW / 2 - rootX - NODE_W / 2,
        y: Math.max(60, containerH * 0.12 - rootY),
      });
    };
    
    tryCenter();
  }, [allNodes.length > 0 ? (roots[0]?.page.id ?? "") : "", bounds]);

  const onDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, [dragging]);

  const onUp = useCallback(() => setDragging(false), []);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden select-none", dragging ? "cursor-grabbing" : "cursor-grab")}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          width: bounds.w,
          height: bounds.h,
        }}
      >
        <EdgeLines roots={roots} />
        {allNodes.map((n) => (
          <NodeCard key={n.page.id} node={n} onClick={onClickNode} onAddChild={onAddChild} allPages={pages} />
        ))}
      </div>
      
      {/* Mini indicator */}
      <div className="absolute bottom-3 right-3 rounded-lg border border-white/5 bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 text-[10px] text-white/30 font-mono">
        {allNodes.length} {allNodes.length === 1 ? 'página' : 'páginas'}
      </div>
    </div>
  );
}
