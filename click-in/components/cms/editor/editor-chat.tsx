"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Send,
  Bot,
  User,
  Zap,
  Loader2,
  Layout,
  Image,
  Type,
  Globe,
  BarChart3,
} from "lucide-react";

interface Message {
  role: "agent" | "user" | "system";
  text: string;
  blocks?: { type: string; label: string; description: string }[];
}

const mockBlocks = [
  { type: "hero", label: "Hero", description: "Header con título, subtítulo y CTA" },
  { type: "services-grid", label: "Servicios Grid", description: "Grid de servicios destacados" },
  { type: "cta", label: "CTA", description: "Call-to-action con botón" },
  { type: "stats", label: "Estadísticas", description: "Contadores y datos clave" },
  { type: "testimonials", label: "Testimonios", description: "Carrusel de reseñas" },
  { type: "gallery", label: "Galería", description: "Grid de imágenes" },
  { type: "contact-form", label: "Contacto", description: "Formulario de contacto" },
  { type: "rich-text", label: "Texto Rico", description: "Contenido enriquecido editable" },
];

export function EditorChat({ pageTitle }: { pageTitle: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "```\n⚡ CMS Editor AI v1.0\n```\n\nEstás editando **" + pageTitle + "**. Puedo ayudarte a:\n\n• **Agregar bloques** — Ej: _\"agrega un hero\"_\n• **Generar secciones** — Ej: _\"crea una sección de servicios\"_\n• **Contenido** — Ej: _\"escribe el texto para la sección about\"_\n• **SEO** — Ej: _\"optimiza el SEO de esta página\"_\n• **Landing completa** — Ej: _\"arma un landing de ventas\"_",
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
    }, 900);
  };

  const processCommand = (cmd: string): Message => {
    const lower = cmd.toLowerCase();

    if (lower.includes("agreg") || lower.includes("hero") || lower.includes("header")) {
      if (lower.includes("hero") || lower.includes("header")) {
        return {
          role: "agent",
          text: "**Hero section sugerida:**\n\n```\nTítulo: Impulsa tu negocio al siguiente nivel\nSubtítulo: Soluciones digitales que transforman\nBotón CTA: Comenzar ahora →\n```\n\n¿Agrego este bloque a tu página?",
          blocks: [mockBlocks[0]],
        };
      }
      return {
        role: "agent",
        text: "¿Qué tipo de bloque quieres agregar?\n\n• **Hero** — Header principal\n• **Services Grid** — Servicios\n• **CTA** — Call to action\n• **Stats** — Estadísticas\n• **Testimonials** — Reseñas\n• **Gallery** — Galería\n• **Contact Form** — Formulario\n• **Rich Text** — Contenido libre",
        blocks: mockBlocks.slice(0, 3),
      };
    }

    if (lower.includes("servicio") || lower.includes("service")) {
      return {
        role: "agent",
        text: "**Sección de Servicios generada:**\n\n```\n🏗️ Desarrollo Web\n   Sitios rápidos, modernos y responsivos\n\n📊 Marketing Digital\n   Estrategias que convierten visitas en clientes\n\n🎨 Diseño UX/UI\n   Experiencias que enamoran a tus usuarios\n```\n\n¿Agrego el bloque de servicios con este contenido?",
        blocks: [mockBlocks[1]],
      };
    }

    if (lower.includes("cta") || lower.includes("llamada") || lower.includes("acción") || lower.includes("accion")) {
      return {
        role: "agent",
        text: "**CTA generada:**\n\n```\nTítulo: ¿Listo para empezar?\nTexto: Únete a más de 500 clientes que ya confían en nosotros\nBotón: Solicitar demo gratuita\n```\n\n¿Agrego este CTA?",
        blocks: [mockBlocks[2]],
      };
    }

    if (lower.includes("testimonio") || lower.includes("reseña")) {
      return {
        role: "agent",
        text: "**Testimonios generados:**\n\n• _\"Increíble servicio, resultados en tiempo récord\"_ — María G.\n• _\"La mejor inversión que hicimos este año\"_ — Carlos R.\n• _\"Profesionalismo y calidad excepcional\"_ — Laura M.\n\n¿Agrego la sección de testimonios?",
        blocks: [mockBlocks[4]],
      };
    }

    if (lower.includes("galer") || lower.includes("imagen")) {
      return {
        role: "agent",
        text: "**Galería sugerida:**\n\nGrid de 6 imágenes con lightbox. Puedes arrastrar tus propias imágenes después.\n\n¿Agrego el bloque de galería?",
        blocks: [mockBlocks[5]],
      };
    }

    if (lower.includes("contacto") || lower.includes("form")) {
      return {
        role: "agent",
        text: "**Formulario de contacto generado:**\n\nCampos: Nombre, Email, Teléfono, Mensaje\n\n¿Agrego el formulario a tu página?",
        blocks: [mockBlocks[6]],
      };
    }

    if (lower.includes("stats") || lower.includes("estad") || lower.includes("numero")) {
      return {
        role: "agent",
        text: "**Estadísticas sugeridas:**\n\n• **+500** Clientes satisfechos\n• **50** Proyectos entregados\n• **24/7** Soporte técnico\n• **100%** Satisfacción\n\n¿Agrego el bloque de estadísticas?",
        blocks: [mockBlocks[3]],
      };
    }

    if (lower.includes("seo") || lower.includes("optim")) {
      return {
        role: "agent",
        text: "**Recomendaciones SEO para _" + pageTitle + "_: **\n\n• Título: _65 caracteres máx, incluir keyword_\n• Descripción: _155 caracteres, llamativo_\n• Slug: _url-amigable-sin-acentos_\n• H1: _Uno por página, con keyword_\n• Imágenes: _Agregar alt text_\n\n¿Aplico estas optimizaciones?",
      };
    }

    if (lower.includes("landing") || lower.includes("completa") || lower.includes("arma")) {
      return {
        role: "agent",
        text: "**Landing generada — _" + pageTitle + "_:**\n\n```\n1. Hero — Header principal\n2. Services Grid — Lo que ofrecemos\n3. Stats — Resultados\n4. Testimonials — Confianza social\n5. CTA — Conversión final\n6. Contact Form — Cierre\n```\n\n¿Agrego todos estos bloques a la página?",
        blocks: [mockBlocks[0], mockBlocks[1], mockBlocks[3], mockBlocks[4], mockBlocks[2], mockBlocks[6]],
      };
    }

    if (lower.includes("texto") || lower.includes("contenido") || lower.includes("escribe")) {
      return {
        role: "agent",
        text: "**Contenido generado:**\n\n```\nSomos un equipo apasionado por la tecnología\ny el diseño. Creamos experiencias digitales\nque conectan marcas con personas.\n\nNuestra misión es transformar ideas en\nproductos digitales que generan impacto real.\n```\n\n¿Agrego este bloque de texto a la página?",
        blocks: [mockBlocks[7]],
      };
    }

    return {
      role: "agent",
      text: "Puedo ayudarte con:\n\n• **Agregar bloques** — Hero, servicios, CTA, etc.\n• **SEO** — Optimizar metadata\n• **Landing completa** — Generar estructura\n• **Contenido** — Escribir texto\n\nEscribe un comando o dime qué necesitas.",
      blocks: mockBlocks.slice(0, 4),
    };
  };

  const handleAddBlock = (blockType: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "system", text: `✅ Bloque **${blockType}** agregado a la página. Arrástralo para reordenar.` },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20">
          <Terminal size={14} className="text-violet-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">AI Editor</p>
          <p className="text-[10px] text-white/20">Editando: {pageTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
                {msg.text.split(/(\*\*.*?\*\*|\`.*?\`)/).map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith("`") && part.endsWith("`")) {
                    return <code key={j} className="text-violet-300 bg-white/5 px-1 rounded text-[10px]">{part.slice(1, -1)}</code>;
                  }
                  return part;
                })}
              </div>

              {/* Block suggestions */}
              {msg.blocks && msg.blocks.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <p className="text-[9px] text-white/20 font-medium">Bloques sugeridos:</p>
                  {msg.blocks.map((block, k) => (
                    <button
                      key={k}
                      onClick={() => handleAddBlock(block.type)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-violet-500/10 hover:border-violet-500/20 transition-colors text-left group"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600/10 text-violet-400 flex-shrink-0">
                        <Layout size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-white group-hover:text-violet-200 transition-colors">
                          {block.label}
                        </p>
                        <p className="text-[9px] text-white/25 truncate">{block.description}</p>
                      </div>
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
              <span className="text-[10px] text-white/20">Generando...</span>
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
            placeholder="Ej: agrega un hero..."
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
        <div className="mt-1.5 flex gap-1.5 overflow-x-auto">
          {["hero", "servicios", "landing", "seo"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => { setInput("agrega " + cmd); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="text-[9px] text-white/15 hover:text-violet-400/70 transition-colors whitespace-nowrap"
            >
              /{cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
