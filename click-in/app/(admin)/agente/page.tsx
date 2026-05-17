"use client";

import { useState } from "react";
import { MessageSquare, Upload, FileText, Send, Bot, Mic, Key, Save, Eye, EyeOff } from "lucide-react";

export default function AgentePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [question, setQuestion] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [messages] = useState<Array<{ role: string; text: string }>>([
    { role: "agent", text: "¡Hola! Soy el agente de voz de Click In. Sube archivos PDF, DOCX o TXT para entrenar mi conocimiento, y luego pregúntame lo que necesites." },
  ]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6">
      <div className="px-6 pt-4 shrink-0">
        <h1 className="text-2xl font-bold text-white">Agente de Voz</h1>
        <p className="mt-1 text-sm text-white/40">
          Entrena al agente con tus documentos y hazle preguntas por voz o texto
        </p>
      </div>

      <div className="flex-1 flex gap-4 mx-6 mb-4 overflow-hidden">
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="rounded-xl border border-white/5 bg-zinc-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10">
                <Key size={14} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">API Key</h3>
                <p className="text-[10px] text-white/20">OpenAI o compatible</p>
              </div>
            </div>
            <div className="relative mb-2">
              <input
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-2.5 py-1.5 pr-8 text-xs text-white placeholder-white/20 focus:border-emerald-500/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
            <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors">
              <Save size={12} />
              Guardar
            </button>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="rounded-xl border-2 border-dashed border-white/10 bg-zinc-900/50 p-6 text-center hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors cursor-pointer"
          >
            <Upload size={24} className="mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/40 font-medium">
              Arrastra archivos aquí
            </p>
            <p className="mt-1 text-xs text-white/20">
              PDF, DOCX, TXT
            </p>
            <label className="mt-3 inline-block cursor-pointer text-xs text-blue-400 hover:text-blue-300">
              <input type="file" multiple accept=".pdf,.docx,.txt" onChange={handleFileInput} className="hidden" />
              Seleccionar archivos
            </label>
          </div>

          {files.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-4">
              <p className="text-xs font-medium text-white/40 mb-2">Archivos cargados ({files.length})</p>
              <div className="space-y-1">
                {files.map((file) => (
                  <div key={file.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] group">
                    <FileText size={14} className="text-blue-400/60 flex-shrink-0" />
                    <span className="text-xs text-white/50 truncate flex-1">{file.name}</span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-white/10 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col rounded-xl border border-white/5 bg-zinc-900/50 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "agent" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    msg.role === "agent"
                      ? "bg-zinc-800 text-white/80"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {msg.role === "agent" && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot size={14} className="text-blue-400" />
                      <span className="text-[10px] font-medium text-blue-400">Agente Click In</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 p-3">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-white/10 text-white/30 hover:text-white hover:bg-white/5 transition-colors" title="Entrada por voz">
                <Mic size={16} />
              </button>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribe tu pregunta o usa el micrófono..."
                className="flex-1 rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-blue-500/40 focus:outline-none"
                onKeyDown={(e) => { if (e.key === "Enter" && question.trim()) setQuestion(""); }}
              />
              <button
                disabled={!question.trim()}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 transition-colors"
                title="Enviar"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
