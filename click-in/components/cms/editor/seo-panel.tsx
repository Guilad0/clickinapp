"use client";

import { useEditorStore, type SeoData } from "@/stores/editor-store";
import { Globe, AlertTriangle, Check } from "lucide-react";

export function SeoPanel() {
  const { seo, setSeo, pageTitle } = useEditorStore();

  const metaTitle = seo.metaTitle || "";
  const metaDescription = seo.metaDescription || "";
  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  const titleStatus = titleLen === 0 ? "error" : titleLen < 30 ? "warning" : titleLen > 60 ? "error" : "ok";
  const descStatus = descLen === 0 ? "error" : descLen < 50 ? "warning" : descLen > 160 ? "error" : "ok";

  const updateSeo = (key: keyof SeoData, value: unknown) => {
    setSeo({ ...seo, [key]: value });
  };

  const auditItems = [
    { label: "Meta title", status: titleStatus, detail: titleLen > 0 ? `${titleLen}/60` : "Falta" },
    { label: "Meta description", status: descStatus, detail: descLen > 0 ? `${descLen}/160` : "Falta" },
    { label: "Slug", status: "ok" as const, detail: "Configurado" },
    { label: "Schema.org", status: seo.schemaType ? "ok" as const : "warning" as const, detail: (seo.schemaType as string) || "No configurado" },
    { label: "Indexable", status: seo.indexable === false ? "warning" as const : "ok" as const, detail: seo.indexable === false ? "noindex" : "index" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/5">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          SEO
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <label className="block text-[10px] font-medium text-white/30 mb-1">
            Meta Title
            <span className={`ml-2 ${titleLen > 60 ? "text-red-400" : "text-white/20"}`}>
              {titleLen}/60
            </span>
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => updateSeo("metaTitle", e.target.value)}
            placeholder={pageTitle || "Título de la página"}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-white/30 mb-1">
            Meta Description
            <span className={`ml-2 ${descLen > 160 ? "text-red-400" : "text-white/20"}`}>
              {descLen}/160
            </span>
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => updateSeo("metaDescription", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500/40 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-white/30 mb-1">OG Title</label>
          <input
            type="text"
            value={(seo.ogTitle as string) || ""}
            onChange={(e) => updateSeo("ogTitle", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-white/30 mb-1">OG Description</label>
          <input
            type="text"
            value={(seo.ogDescription as string) || ""}
            onChange={(e) => updateSeo("ogDescription", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-white/30 mb-1">OG Image URL</label>
          <input
            type="text"
            value={(seo.ogImage as string) || ""}
            onChange={(e) => updateSeo("ogImage", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-white/30 mb-1">Schema.org</label>
          <select
            value={(seo.schemaType as string) || ""}
            onChange={(e) => updateSeo("schemaType", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500/40 focus:outline-none"
          >
            <option value="">Sin schema</option>
            <option value="WebPage">WebPage</option>
            <option value="Article">Article</option>
            <option value="FAQPage">FAQPage</option>
            <option value="LocalBusiness">LocalBusiness</option>
            <option value="Product">Product</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-[10px] font-medium text-white/30">Indexar en Google</label>
          <button
            onClick={() => updateSeo("indexable", !seo.indexable)}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              seo.indexable !== false ? "bg-blue-600" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                seo.indexable !== false ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="pt-4 border-t border-white/5">
          <p className="text-[10px] font-semibold text-white/20 uppercase mb-2 flex items-center gap-1">
            <Globe size={10} />
            Auditoría SEO
          </p>
          <div className="space-y-1">
            {auditItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-[11px] text-white/50">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/20">{item.detail}</span>
                  {item.status === "ok" ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : item.status === "warning" ? (
                    <AlertTriangle size={12} className="text-amber-400" />
                  ) : (
                    <AlertTriangle size={12} className="text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
