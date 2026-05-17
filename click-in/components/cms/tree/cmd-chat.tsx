"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Send,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  Plus,
  Edit,
  Trash,
  Zap,
  Loader2,
} from "lucide-react";

interface Message {
  role: "agent" | "user" | "system";
  text: string;
  actions?: Action[];
}

interface Action {
  label: string;
  type: "create" | "edit" | "delete" | "publish";
  targetId?: string;
  targetTitle?: string;
}

export function CmdChat({
  pagesCount,
  onCreatePage,
  onEditPage,
  onDeletePage,
}: {
  pagesCount: number;
  onCreatePage: (title: string, slug: string, parentId?: string) => void;
  onEditPage: (id: string) => void;
  onDeletePage: (id: string) => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "```\n⚡ CMD CMS v1.0 — Click In Builder\n```\n\n¡Bienvenido! Soy tu asistente de construcción de sitios. Puedo ayudarte a:\n\n• **Crear páginas** — Ej: _\"crea una página de servicios\"_\n• **Editar páginas** — Ej: _\"editar la página inicio\"_\n• **Eliminar páginas** — Ej: _\"borrar la página borrador\"_\n• **Generar estructura** — Ej: _\"crea un sitio de restaurante con menú, reservas y contacto\"_\n\nActualmente hay **" + pagesCount + " páginas** en tu sitio.",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || thinking) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setThinking(true);

    setTimeout(() => {
      const response = processCommand(text);
      setMessages((prev) => [...prev, response]);
      setThinking(false);
    }, 800);
  };

  const processCommand = (cmd: string): Message => {
    const lower = cmd.toLowerCase();

    if (lower.includes("crea") || lower.includes("crear") || lower.includes("nueva")) {
      const titleMatch = cmd.match(/(?:página|pagina|view|vista)\s+(?:de\s+)?["']?([a-záéíóúñ\s]+)["']?/i)
        || cmd.match(/crea(?:r)?\s+(?:una\s+)?(?:página|pagina|view|vista)?\s*(?:de\s+)?["']?([a-záéíóúñ\s]+)["']?/i)
        || cmd.match(/["']?([a-záéíóúñ]{3,})["']?(?:\s+(?:página|pagina|view|vista))?/i);

      if (titleMatch?.[1]) {
        const title = titleMatch[1].trim();
        const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        return {
          role: "agent",
          text: `**Creando:**  _${title}_  →  \`/${slug}\`\n\n¿Confirmas la creación?`,
          actions: [
            { label: `Crear "${title}"`, type: "create", targetTitle: title },
          ],
        };
      }
    }

    if (lower.includes("editar") || lower.includes("edita") || lower.includes("modif")) {
      return {
        role: "agent",
        text: "¿Qué página quieres editar? Escribe el nombre o slug.\n\nEj: _\"editar inicio\"_  o  _\"editar /servicios\"_",
      };
    }

    if (lower.includes("borrar") || lower.includes("eliminar") || lower.includes("delete")) {
      return {
        role: "agent",
        text: "¿Qué página quieres eliminar? Escribe el nombre exacto.\n\n⚠️ Esta acción no se puede deshacer.",
      };
    }

    if (lower.includes("restaurant") || lower.includes("restaurante")) {
      return {
        role: "agent",
        text: "**Plan de sitio — Restaurante 🍽️**\n\nEstructura sugerida:\n\n```\n/\n├── /menu\n├── /reservas\n├── /contacto\n├── /galeria\n└── /sobre-nosotros\n```\n\n¿Quieres que cree estas páginas automáticamente?",
        actions: [
          { label: "Crear estructura completa (5 páginas)", type: "create" },
          { label: "Solo menú y contacto", type: "create" },
        ],
      };
    }

    if (lower.includes("ecommerce") || lower.includes("tienda")) {
      return {
        role: "agent",
        text: "**Plan de sitio — Tienda Online 🛒**\n\nEstructura sugerida:\n\n```\n/\n├── /productos\n├── /carrito\n├── /checkout\n├── /contacto\n├── /blog\n└── /faq\n```",
        actions: [
          { label: "Crear estructura ecommerce (6 páginas)", type: "create" },
        ],
      };
    }

    if (lower.includes("blog") || lower.includes("artículo")) {
      return {
        role: "agent",
        text: "**Estructura de Blog sugerida 📝**\n\n```\n/blog\n├── /articulos\n└── /categorias\n```\n\nO puedo ayudarte con:\n• Crear una página de blog\n• Crear subpáginas para artículos",
        actions: [
          { label: "Crear blog + artículos + categorías", type: "create" },
          { label: "Solo página de blog", type: "create" },
        ],
      };
    }

    if (lower.includes("landing") || lower.includes("aterrizaje")) {
      return {
        role: "agent",
        text: "**Landing Page — Estructura sugerida 🚀**\n\n```\n/\n├── /servicios\n├── /testimonios\n├── /precios\n├── /contacto\n└── /demo\n```\n\nDiseñada para conversión. ¿La creamos?",
        actions: [
          { label: "Crear landing (6 páginas)", type: "create" },
        ],
      };
    }

    if (lower.includes("ayuda") || lower.includes("help") || lower.includes("/help")) {
      return {
        role: "agent",
        text: "**Comandos disponibles:**\n\n```\ncrear [nombre]     → Crea una nueva página\neditar [nombre]    → Abre el editor de la página\nborrar [nombre]    → Elimina una página\nlanding            → Genera estructura landing\necommerce          → Genera estructura tienda\nrestaurante        → Genera estructura restaurante\nblog               → Genera estructura blog\nayuda              → Muestra esta ayuda\n```",
      };
    }

    return {
      role: "agent",
      text: "No he entendido bien. Prueba con:\n\n• `crear [nombre de página]`\n• `landing` — generar estructura landing\n• `ecommerce` — generar estructura tienda\n• `restaurante` — generar estructura restaurante\n• `ayuda` — ver todos los comandos",
    };
  };

  const handleAction = (action: Action) => {
    if (action.type === "create" && action.targetTitle) {
      const slug = action.targetTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      onCreatePage(action.targetTitle, slug);
      setMessages((prev) => [
        ...prev,
        { role: "system", text: `✅ Página **"${action.targetTitle}"** creada en \`/${slug}\`` },
      ]);
    } else if (action.type === "create" && action.label?.includes("restaurante")) {
      const pages = action.label?.includes("solo") 
        ? ["Menú", "Contacto"]
        : ["Inicio", "Menú", "Reservas", "Contacto", "Galería", "Sobre Nosotros"];
      pages.forEach((title, i) => {
        const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        setTimeout(() => onCreatePage(title, slug), i * 200);
      });
      setMessages((prev) => [
        ...prev,
        { role: "system", text: `✅ Estructura de restaurante creada (${pages.length} páginas)` },
      ]);
    } else if (action.type === "create") {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Vamos a crearlo paso a paso. ¿Qué nombre le ponemos a la primera página?" },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-l-2xl border border-white/5 bg-zinc-900/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20">
            <Terminal size={14} className="text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">CMD CMS</p>
            <p className="text-[10px] text-white/20">Asistente IA</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-emerald-400/70 font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2">
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md flex-shrink-0 mt-0.5",
              msg.role === "agent" ? "bg-violet-600/20" :
              msg.role === "system" ? "bg-emerald-600/20" :
              "bg-zinc-700"
            )}>
              {msg.role === "agent" ? (
                <Bot size={12} className="text-violet-400" />
              ) : msg.role === "system" ? (
                <Zap size={12} className="text-emerald-400" />
              ) : (
                <User size={12} className="text-white/60" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-xs leading-relaxed whitespace-pre-wrap",
                msg.role === "agent" ? "text-white/70" :
                msg.role === "system" ? "text-emerald-400/80" :
                "text-blue-300/80"
              )}>
                {/* Simple markdown-like rendering */}
                {msg.text.split(/(\*\*.*?\*\*|\`.*?\`)/).map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith("`") && part.endsWith("`")) {
                    return <code key={j} className="text-violet-300 bg-white/5 px-1 rounded text-[11px]">{part.slice(1, -1)}</code>;
                  }
                  return part;
                })}
              </div>

              {/* Action buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {msg.actions.map((action, k) => (
                    <button
                      key={k}
                      onClick={() => handleAction(action)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors",
                        action.type === "create"
                          ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20"
                          : action.type === "edit"
                          ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20"
                          : "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20"
                      )}
                    >
                      {action.type === "create" && <Plus size={11} />}
                      {action.type === "edit" && <Edit size={11} />}
                      {action.type === "delete" && <Trash size={11} />}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600/20 flex-shrink-0">
              <Bot size={12} className="text-violet-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <Loader2 size={12} className="text-violet-400 animate-spin" />
              <span className="text-[10px] text-white/20">Pensando...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 focus-within:border-violet-500/40 transition-colors">
          <Terminal size={13} className="text-violet-400/60 flex-shrink-0" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un comando..."
            className="flex-1 bg-transparent text-xs text-white placeholder-white/20 focus:outline-none"
            disabled={thinking}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || thinking}
            className="p-1 rounded-md text-white/20 hover:text-violet-400 hover:bg-violet-500/10 disabled:opacity-30 transition-colors"
          >
            <Send size={13} />
          </button>
        </div>
        <div className="mt-1.5 flex gap-2">
          {["ayuda", "landing", "restaurante", "blog"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => { setInput("/" + cmd); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="text-[9px] text-white/15 hover:text-violet-400/70 transition-colors"
            >
              /{cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
