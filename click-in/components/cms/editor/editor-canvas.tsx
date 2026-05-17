"use client";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { BlockRenderer } from "./blocks/block-renderer";
import { Trash2, ChevronUp, ChevronDown, GripVertical, Plus } from "lucide-react";

export function EditorCanvas() {
  const { blocks, selectedBlockId, selectBlock, removeBlock, moveBlock } =
    useEditorStore();

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
          <Plus size={24} className="text-blue-400" />
        </div>
        <p className="text-sm text-white/40 font-medium">Canvas vacío</p>
        <p className="mt-1 text-xs text-white/20 max-w-xs">
          Agrega bloques desde la biblioteca de la izquierda para construir tu página.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full bg-zinc-950">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className={cn(
              "group relative border-b border-white/5 transition-colors",
              selectedBlockId === block.id
                ? "ring-2 ring-inset ring-blue-500/50 bg-blue-500/5"
                : "hover:bg-white/[0.01]"
            )}
            onClick={(e) => {
              e.stopPropagation();
              selectBlock(block.id);
            }}
          >
            <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (index > 0) moveBlock(index, index - 1);
                }}
                disabled={index === 0}
                className="p-1 rounded text-white/20 hover:text-white hover:bg-white/10 disabled:opacity-20"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (index < blocks.length - 1) moveBlock(index, index + 1);
                }}
                disabled={index === blocks.length - 1}
                className="p-1 rounded text-white/20 hover:text-white hover:bg-white/10 disabled:opacity-20"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBlock(block.id);
                }}
                className="p-1 rounded text-white/20 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <GripVertical size={12} className="text-white/20" />
              <span className="text-[10px] text-white/20 font-medium">
                {block.type}
              </span>
            </div>

            <div className={cn(selectedBlockId === block.id && "pointer-events-none")}>
              <BlockRenderer type={block.type} data={block.props} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
