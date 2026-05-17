"use client";

import { useEditorStore } from "@/stores/editor-store";
import { X, Trash2 } from "lucide-react";

export function PropertyPanel() {
  const { selectedBlockId, blocks, updateBlockProps, removeBlock, selectBlock } =
    useEditorStore();

  const block = blocks.find((b) => b.id === selectedBlockId);

  if (!block) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <p className="text-xs text-white/20">Selecciona un bloque para editar sus propiedades</p>
      </div>
    );
  }

  const handleChange = (key: string, value: unknown) => {
    updateBlockProps(block.id, { [key]: value });
  };

  const handleNestedChange = (parentKey: string, childKey: string, value: unknown) => {
    const current = (block.props[parentKey] as Record<string, unknown>) || {};
    updateBlockProps(block.id, { [parentKey]: { ...current, [childKey]: value } });
  };

  const handleArrayItem = (parentKey: string, index: number, field: string, value: unknown) => {
    const arr = [...((block.props[parentKey] as unknown[]) || [])];
    if (arr[index]) {
      arr[index] = { ...(arr[index] as Record<string, unknown>), [field]: value };
      updateBlockProps(block.id, { [parentKey]: arr });
    }
  };

  const renderField = (key: string, value: unknown): React.ReactNode => {
    if (typeof value === "string" && !key.startsWith("_")) {
      return (
        <div key={key} className="mb-2">
          <label className="block text-[10px] font-medium text-white/30 mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          {value.length > 60 ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={2}
              className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-white focus:border-blue-500/40 focus:outline-none resize-none"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-white focus:border-blue-500/40 focus:outline-none"
            />
          )}
        </div>
      );
    }
    if (typeof value === "number") {
      return (
        <div key={key} className="mb-2">
          <label className="block text-[10px] font-medium text-white/30 mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(key, Number(e.target.value))}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-white focus:border-blue-500/40 focus:outline-none"
          />
        </div>
      );
    }
    if (typeof value === "boolean") {
      return (
        <div key={key} className="mb-2 flex items-center justify-between">
          <label className="text-[10px] font-medium text-white/30 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <button
            onClick={() => handleChange(key, !value)}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              value ? "bg-blue-600" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                value ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      );
    }
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      if (obj.text !== undefined && obj.link !== undefined) {
        return (
          <div key={key} className="mb-2 p-2 rounded-md border border-white/5 bg-white/[0.02]">
            <label className="block text-[10px] font-medium text-white/30 mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            {Object.entries(obj).map(([ck, cv]) =>
              typeof cv === "string" ? (
                <div key={ck} className="mb-1 last:mb-0">
                  <input
                    type="text"
                    value={cv}
                    onChange={(e) => handleNestedChange(key, ck, e.target.value)}
                    placeholder={ck}
                    className="w-full rounded border border-white/5 bg-zinc-800/50 px-2 py-1 text-[11px] text-white focus:border-blue-500/30 focus:outline-none"
                  />
                </div>
              ) : null
            )}
          </div>
        );
      }
    }
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-2">
          <label className="block text-[10px] font-medium text-white/30 mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {value.map((item, i) => {
              if (typeof item === "object" && item !== null) {
                return (
                  <div key={i} className="p-2 rounded-md border border-white/5 bg-white/[0.02]">
                    <span className="text-[9px] text-white/20 block mb-1">#{i + 1}</span>
                    {Object.entries(item as Record<string, unknown>)
                      .filter(([, v]) => typeof v === "string")
                      .map(([fk, fv]) => (
                        <input
                          key={fk}
                          type="text"
                          value={fv as string}
                          onChange={(e) => handleArrayItem(key, i, fk, e.target.value)}
                          placeholder={fk}
                          className="w-full rounded border border-white/5 bg-zinc-800/50 px-2 py-1 text-[11px] text-white mb-1 focus:border-blue-500/30 focus:outline-none"
                        />
                      ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Propiedades
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => removeBlock(block.id)}
            className="p-1 rounded text-white/20 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => selectBlock(null)}
            className="p-1 rounded text-white/20 hover:text-white hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-3 p-2 rounded-md bg-blue-500/5 border border-blue-500/10">
          <span className="text-[10px] font-medium text-blue-400">{block.type}</span>
        </div>

        {Object.entries(block.props).map(([key, value]) => renderField(key, value))}

        {Object.keys(block.props).length === 0 && (
          <p className="text-xs text-white/20">Sin propiedades editables</p>
        )}
      </div>
    </div>
  );
}
