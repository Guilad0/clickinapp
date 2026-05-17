"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Image,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
  Calendar,
  Megaphone,
  Bot,
  MessageSquare,
  Upload,
} from "lucide-react";

const navigation = [
  { name: "Árbol de Rutas", href: "/tree", icon: LayoutDashboard },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "Biblioteca", href: "/assets", icon: Image },
  { name: "Meta Cronograma", href: "/cronograma", icon: Calendar },
  { name: "Remarketing", href: "/remarketing", icon: Megaphone },
  { name: "Agente de Voz", href: "/agente", icon: MessageSquare },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export default function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <aside
        className={cn(
          "flex flex-col border-r border-white/5 bg-zinc-900 transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-white">
              CLICK IN
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-md p-1 text-white/40 hover:text-white transition-colors",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-2">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer",
              collapsed && "justify-center px-0"
            )}
            onClick={() => signOut()}
            title={collapsed ? "Cerrar sesión" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Cerrar sesión</span>}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-white/5 bg-zinc-900 px-6">
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/30 text-blue-400">
                  <User size={14} />
                </div>
                <span className="text-sm text-white/70">
                  {session.user.email}
                </span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <Globe size={16} />
            <span className="text-xs">ES</span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden bg-zinc-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
