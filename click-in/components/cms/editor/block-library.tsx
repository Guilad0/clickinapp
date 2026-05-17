"use client";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { Plus, Box } from "lucide-react";

const categoryLabels: Record<string, string> = {
  "Estructura de página": "Estructura",
  "Servicios y propuesta de valor": "Servicios",
  "Contenido y credibilidad": "Contenido",
  "Contacto y conversión": "Contacto",
  "Blog y contenido dinámico": "Blog",
};

export function BlockLibrary() {
  const { blockTypes, addBlock } = useEditorStore();

  const grouped = blockTypes.reduce(
    (acc, bt) => {
      const cat = categoryLabels[bt.category] || bt.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(bt);
      return acc;
    },
    {} as Record<string, typeof blockTypes>
  );

  if (blockTypes.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-white/20">
        Cargando bloques...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/5">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Bloques
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="text-[10px] font-medium text-white/20 uppercase mb-2">
              {category}
            </p>
            <div className="space-y-1">
              {items.map((bt) => (
                <button
                  key={bt.id}
                  onClick={() =>
                    addBlock(bt.name, (bt.defaultPropsJson as Record<string, unknown>) || {})
                  }
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                    "hover:bg-white/5 group"
                  )}
                >
                  <Box size={14} className="text-white/20 flex-shrink-0" />
                  <span className="text-xs text-white/50 group-hover:text-white/70 truncate">
                    {bt.name}
                  </span>
                  <Plus
                    size={12}
                    className="text-white/10 group-hover:text-blue-400 ml-auto flex-shrink-0 transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
