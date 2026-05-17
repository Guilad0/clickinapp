"use client";

import { Mail, Save, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function RemarketingPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Remarketing</h1>
        <p className="mt-1 text-sm text-white/40">
          Configura el correo que enviará tus campañas de remarketing
        </p>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-900 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/10">
            <Mail size={20} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Configuración de correo SMTP</h2>
            <p className="text-xs text-white/30">Credenciales para enviar campañas por email</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Servidor SMTP
            </label>
            <input
              type="text"
              placeholder="smtp.gmail.com"
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-amber-500/40 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Puerto
              </label>
              <input
                type="text"
                placeholder="587"
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-amber-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Seguridad
              </label>
              <select className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:outline-none">
                <option>TLS</option>
                <option>SSL</option>
                <option>Ninguna</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="marketing@tuempresa.com"
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-amber-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña de aplicación"
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 pr-10 text-sm text-white placeholder-white/20 focus:border-amber-500/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-white/20">
              Para Gmail, usa una contraseña de aplicación
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Nombre del remitente
            </label>
            <input
              type="text"
              placeholder="Tu Empresa"
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-amber-500/40 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 transition-colors">
              <Save size={14} />
              Guardar configuración
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 transition-colors">
              Probar conexión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
