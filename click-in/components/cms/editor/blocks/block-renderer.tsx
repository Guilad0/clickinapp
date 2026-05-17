import { cn } from "@/lib/utils";

interface BlockProps {
  data: Record<string, unknown>;
  isPreview?: boolean;
}

export function HeroBlock({ data }: BlockProps) {
  const title = (data.title as string) || "Título";
  const subtitle = (data.subtitle as string) || "";
  const cta = (data.ctaPrimary as { text: string; link: string }) || { text: "Comenzar", link: "#" };
  const cta2 = (data.ctaSecondary as { text: string; link: string }) || { text: "Saber más", link: "#" };
  const bg = (data.background as { type: string; value: string }) || { type: "color", value: "#1e293b" };
  const align = (data.alignment as string) || "left";

  return (
    <section
      className={cn("relative py-20 px-6 flex items-center min-h-[400px]", align === "center" && "text-center justify-center")}
      style={{ background: bg.type === "color" ? bg.value : "#1e293b" }}
    >
      <div className={cn("max-w-3xl", align === "center" ? "mx-auto" : "")}>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-white/60 max-w-xl">{subtitle}</p>}
        <div className={cn("flex gap-3 mt-8 flex-wrap", align === "center" ? "justify-center" : "")}>
          <a href={cta.link} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors no-underline">{cta.text}</a>
          {cta2.text && <a href={cta2.link} className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors no-underline">{cta2.text}</a>}
        </div>
      </div>
    </section>
  );
}

export function ServicesGridBlock({ data }: BlockProps) {
  const cols = (data.columns as number) || 3;
  const items = (data.items as Array<{ icon: string; title: string; description: string; link?: string }>) || [];

  return (
    <section className="py-16 px-6 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className={cn("grid gap-6", cols === 2 ? "grid-cols-1 sm:grid-cols-2" : cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4")}>
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-zinc-800/50 p-6 hover:border-blue-500/20 transition-colors">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/50">{item.description}</p>
              {item.link && <a href={item.link} className="mt-3 text-xs text-blue-400 hover:text-blue-300 no-underline">Saber más &rarr;</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBlock({ data }: BlockProps) {
  const items = (data.items as Array<{ number: number; suffix: string; label: string }>) || [];
  const bgColor = (data.bgColor as string) || "#1e293b";
  const textColor = (data.textColor as string) || "#ffffff";

  return (
    <section className="py-16 px-6" style={{ background: bgColor }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {items.map((item, i) => (
          <div key={i}>
            <span className="text-4xl font-bold" style={{ color: textColor }}>
              {item.number}{item.suffix}
            </span>
            <p className="mt-1 text-sm opacity-70" style={{ color: textColor }}>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTABlock({ data }: BlockProps) {
  const title = (data.title as string) || "¿Listo para empezar?";
  const subtitle = (data.subtitle as string) || "";
  const cta = (data.ctaPrimary as { text: string; link: string }) || { text: "Comenzar", link: "#" };
  const cta2 = (data.ctaSecondary as { text: string; link: string }) || { text: "", link: "" };
  const bgColor = (data.bgColor as string) || "#2563eb";
  const align = (data.alignment as string) || "center";

  return (
    <section className="py-16 px-6" style={{ background: bgColor }}>
      <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-white/70">{subtitle}</p>}
        <div className={cn("flex gap-3 mt-6 flex-wrap", align === "center" ? "justify-center" : "")}>
          <a href={cta.link} className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors no-underline">{cta.text}</a>
          {cta2.text && <a href={cta2.link} className="rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors no-underline">{cta2.text}</a>}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsBlock({ data }: BlockProps) {
  const items = (data.items as Array<{ photo: string; name: string; role: string; company: string; quote: string }>) || [];
  const mode = (data.mode as string) || "grid-3";

  return (
    <section className="py-16 px-6 bg-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className={cn("grid gap-6", mode === "grid-2" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-zinc-800/50 p-6">
              <p className="text-sm text-white/60 italic">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-4">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/40">{item.role}, {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryBlock({ data }: BlockProps) {
  const images = (data.images as Array<{ url: string; alt: string }>) || [];
  const cols = (data.columns as number) || 3;
  const gap = (data.gap as number) || 16;

  return (
    <section className="py-16 px-6">
      <div
        className="max-w-6xl mx-auto grid"
        style={{
          gridTemplateColumns: cols === 2 ? "repeat(2, 1fr)" : cols === 4 ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          gap: `${gap}px`,
        }}
      >
        {images.map((img, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-white/5 aspect-video bg-zinc-800 flex items-center justify-center">
            {img.url ? (
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/10 text-xs">Imagen {i + 1}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactFormBlock({ data }: BlockProps) {
  const fields = (data.fields as string[]) || ["name", "email", "message"];
  const ctaText = (data.ctaText as string) || "Enviar mensaje";

  return (
    <section className="py-16 px-6 bg-zinc-900">
      <div className="max-w-lg mx-auto">
        <div className="rounded-xl border border-white/5 bg-zinc-800/50 p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {fields.includes("name") && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Nombre</label>
                <input type="text" className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-blue-500/40 focus:outline-none" placeholder="Tu nombre" />
              </div>
            )}
            {fields.includes("email") && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Email</label>
                <input type="email" className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-blue-500/40 focus:outline-none" placeholder="tu@email.com" />
              </div>
            )}
            {fields.includes("phone") && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Teléfono</label>
                <input type="tel" className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-blue-500/40 focus:outline-none" placeholder="+52" />
              </div>
            )}
            {fields.includes("message") && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Mensaje</label>
                <textarea rows={4} className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-blue-500/40 focus:outline-none resize-none" placeholder="Escribe tu mensaje..." />
              </div>
            )}
            <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
              {ctaText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function RichTextBlock({ data }: BlockProps) {
  const content = (data.content as string) || "<h2>Título</h2><p>Contenido aquí</p>";
  const maxWidth = (data.maxWidth as number) || 800;

  return (
    <section className="py-16 px-6">
      <div className="mx-auto prose prose-invert prose-sm max-w-none" style={{ maxWidth }}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
}

export function BlockRenderer({ type, data }: { type: string; data: Record<string, unknown> }) {
  switch (type) {
    case "Hero principal": return <HeroBlock data={data} />;
    case "Grid de servicios": return <ServicesGridBlock data={data} />;
    case "Estadísticas": return <StatsBlock data={data} />;
    case "CTA de sección": return <CTABlock data={data} />;
    case "Testimonios": return <TestimonialsBlock data={data} />;
    case "Galería": return <GalleryBlock data={data} />;
    case "Formulario de contacto": return <ContactFormBlock data={data} />;
    case "Texto enriquecido": return <RichTextBlock data={data} />;
    default: return <div className="py-8 text-center text-white/20 text-sm">Bloque: {type}</div>;
  }
}
