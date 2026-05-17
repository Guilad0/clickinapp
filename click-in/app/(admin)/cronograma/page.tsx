"use client";

import { Calendar, Save, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function CronogramaPage() {
  const [showAppId, setShowAppId] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Meta Cronograma</h1>
        <p className="mt-1 text-sm text-white/40">
          Configura tus credenciales de Meta Business para programar publicaciones
        </p>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-900 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
            <Calendar size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Credenciales de Meta Business</h2>
            <p className="text-xs text-white/30">Conecta tu cuenta de Meta para publicar contenido</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              App ID
            </label>
            <div className="relative">
              <input
                type={showAppId ? "text" : "password"}
                placeholder="Ingresa tu Meta App ID"
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 pr-10 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowAppId(!showAppId)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showAppId ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              App Secret
            </label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                placeholder="Ingresa tu Meta App Secret"
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 pr-10 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                placeholder="Ingresa tu Meta Access Token"
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 pr-10 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Page ID (opcional)
            </label>
            <input
              type="text"
              placeholder="ID de tu página de Facebook"
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
              <Save size={14} />
              Guardar credenciales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
