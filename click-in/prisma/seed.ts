import "dotenv/config";
import { PrismaClient } from "@/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const blockTypes = [
  {
    category: "Estructura de página",
    items: [
      {
        name: "Hero principal",
        icon: "layout",
        defaultPropsJson: {
          title: "Tu título principal aquí",
          subtitle: "Subtítulo descriptivo que engancha al visitante",
          ctaPrimary: { text: "Comenzar ahora", link: "#" },
          ctaSecondary: { text: "Saber más", link: "#" },
          background: { type: "color", value: "#1e293b" },
          alignment: "left",
        },
        propsSchemaJson: {
          title: { type: "text", label: "Título H1" },
          subtitle: { type: "text", label: "Subtítulo" },
          ctaPrimary: { type: "cta", label: "CTA Primario" },
          ctaSecondary: { type: "cta", label: "CTA Secundario" },
          background: { type: "background", label: "Fondo" },
          alignment: { type: "select", label: "Alineación", options: ["left", "center", "right"] },
        },
      },
      {
        name: "Hero dividido",
        icon: "columns-2",
        defaultPropsJson: {
          title: "Soluciones digitales para tu negocio",
          subtitle: "Impulsamos tu presencia online con herramientas profesionales",
          image: { url: "", alt: "Hero image" },
          cta: { text: "Solicitar demo", link: "#" },
          imagePosition: "right",
        },
        propsSchemaJson: {
          title: { type: "text", label: "Título" },
          subtitle: { type: "text", label: "Subtítulo" },
          image: { type: "image", label: "Imagen" },
          cta: { type: "cta", label: "Botón" },
          imagePosition: { type: "select", label: "Orden", options: ["left", "right"] },
        },
      },
      {
        name: "Separador de sección",
        icon: "minus",
        defaultPropsJson: { type: "wave", colorTop: "#ffffff", colorBottom: "#f8fafc", height: 80 },
        propsSchemaJson: {
          type: { type: "select", label: "Tipo", options: ["line", "wave", "triangle", "space"] },
          colorTop: { type: "color", label: "Color superior" },
          colorBottom: { type: "color", label: "Color inferior" },
          height: { type: "number", label: "Altura (px)" },
        },
      },
    ],
  },
  {
    category: "Servicios y propuesta de valor",
    items: [
      {
        name: "Grid de servicios",
        icon: "grid-3x3",
        defaultPropsJson: {
          columns: 3,
          items: [
            { icon: "\u2605", title: "Servicio 1", description: "Descripción del servicio", link: "" },
            { icon: "\u2605", title: "Servicio 2", description: "Descripción del servicio", link: "" },
            { icon: "\u2605", title: "Servicio 3", description: "Descripción del servicio", link: "" },
          ],
        },
        propsSchemaJson: {
          columns: { type: "select", label: "Columnas", options: [2, 3, 4] },
          items: { type: "array", label: "Servicios" },
        },
      },
      {
        name: "Lista de características",
        icon: "list-checks",
        defaultPropsJson: {
          items: [
            { icon: "\u2713", text: "Característica principal del producto" },
            { icon: "\u2713", text: "Beneficio competitivo destacado" },
            { icon: "\u2713", text: "Ventaja diferencial del servicio" },
          ],
          iconColor: "#16a34a",
        },
        propsSchemaJson: {
          items: { type: "array", label: "Características" },
          iconColor: { type: "color", label: "Color del ícono" },
        },
      },
      {
        name: "Comparación de planes",
        icon: "table",
        defaultPropsJson: {
          plans: [
            { name: "Básico", price: "29", period: "mes", features: ["Feature 1", "Feature 2", "Feature 3"], cta: { text: "Elegir plan", link: "#" }, badge: "" },
            { name: "Profesional", price: "79", period: "mes", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"], cta: { text: "Elegir plan", link: "#" }, badge: "Más popular" },
            { name: "Empresarial", price: "199", period: "mes", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"], cta: { text: "Elegir plan", link: "#" }, badge: "" },
          ],
        },
        propsSchemaJson: { plans: { type: "array", label: "Planes" } },
      },
    ],
  },
  {
    category: "Contenido y credibilidad",
    items: [
      {
        name: "Testimonios",
        icon: "message-circle",
        defaultPropsJson: {
          mode: "grid-3",
          items: [{ photo: "", name: "Cliente 1", role: "CEO", company: "Empresa", quote: "Excelente servicio." }],
        },
        propsSchemaJson: {
          mode: { type: "select", label: "Modo", options: ["slider", "grid-2", "grid-3"] },
          items: { type: "array", label: "Testimonios" },
        },
      },
      {
        name: "Equipo",
        icon: "users",
        defaultPropsJson: {
          columns: 3,
          items: [{ photo: "", name: "Nombre", role: "Cargo", bio: "Bio corta", linkedin: "", twitter: "" }],
        },
        propsSchemaJson: {
          columns: { type: "select", label: "Columnas", options: [2, 3, 4] },
          items: { type: "array", label: "Miembros" },
        },
      },
      {
        name: "Logos de clientes",
        icon: "building-2",
        defaultPropsJson: { mode: "static", logos: ["", "", "", ""], speed: 30 },
        propsSchemaJson: {
          mode: { type: "select", label: "Modo", options: ["static", "carousel"] },
          logos: { type: "array", label: "Logos" },
          speed: { type: "number", label: "Velocidad" },
        },
      },
      {
        name: "Estadísticas",
        icon: "bar-chart-3",
        defaultPropsJson: {
          bgColor: "#1e293b",
          textColor: "#ffffff",
          items: [
            { number: 150, suffix: "+", label: "Clientes satisfechos" },
            { number: 12, suffix: "", label: "Años de experiencia" },
            { number: 98, suffix: "%", label: "Tasa de éxito" },
          ],
        },
        propsSchemaJson: {
          bgColor: { type: "color", label: "Color de fondo" },
          textColor: { type: "color", label: "Color de texto" },
          items: { type: "array", label: "Estadísticas" },
        },
      },
      {
        name: "Galería",
        icon: "image",
        defaultPropsJson: {
          columns: 3,
          gap: 16,
          lightbox: true,
          images: [
            { url: "", alt: "Imagen 1" },
            { url: "", alt: "Imagen 2" },
            { url: "", alt: "Imagen 3" },
          ],
        },
        propsSchemaJson: {
          columns: { type: "select", label: "Columnas", options: [2, 3, 4] },
          gap: { type: "number", label: "Espacio (px)" },
          lightbox: { type: "toggle", label: "Lightbox" },
          images: { type: "array", label: "Imágenes" },
        },
      },
    ],
  },
  {
    category: "Contacto y conversión",
    items: [
      {
        name: "Formulario de contacto",
        icon: "mail",
        defaultPropsJson: {
          fields: ["name", "email", "phone", "message"],
          ctaText: "Enviar mensaje",
          destination: "crm",
        },
        propsSchemaJson: {
          fields: { type: "array", label: "Campos" },
          ctaText: { type: "text", label: "Texto del botón" },
          destination: { type: "select", label: "Destino", options: ["crm", "email"] },
        },
      },
      {
        name: "Mapa de ubicación",
        icon: "map-pin",
        defaultPropsJson: {
          lat: 19.4326,
          lng: -99.1332,
          zoom: 15,
          height: 400,
          address: "Calle Principal 123, Ciudad",
        },
        propsSchemaJson: {
          lat: { type: "number", label: "Latitud" },
          lng: { type: "number", label: "Longitud" },
          zoom: { type: "number", label: "Zoom" },
          height: { type: "number", label: "Altura (px)" },
          address: { type: "text", label: "Dirección" },
        },
      },
      {
        name: "CTA de sección",
        icon: "megaphone",
        defaultPropsJson: {
          title: "¿Listo para empezar?",
          subtitle: "Contáctanos hoy y descubre cómo podemos ayudarte",
          ctaPrimary: { text: "Comenzar ahora", link: "#" },
          ctaSecondary: { text: "Hablar con ventas", link: "#" },
          bgColor: "#2563eb",
          alignment: "center",
        },
        propsSchemaJson: {
          title: { type: "text", label: "Título" },
          subtitle: { type: "text", label: "Subtítulo" },
          ctaPrimary: { type: "cta", label: "CTA Primario" },
          ctaSecondary: { type: "cta", label: "CTA Secundario" },
          bgColor: { type: "color", label: "Color de fondo" },
          alignment: { type: "select", label: "Alineación", options: ["left", "center", "right"] },
        },
      },
      {
        name: "WhatsApp flotante",
        icon: "message-circle",
        defaultPropsJson: {
          phone: "+521234567890",
          message: "Hola, me interesa saber más sobre sus servicios",
          position: "bottom-right",
          delay: 1000,
        },
        propsSchemaJson: {
          phone: { type: "text", label: "Teléfono" },
          message: { type: "text", label: "Mensaje" },
          position: { type: "select", label: "Posición", options: ["bottom-left", "bottom-right"] },
          delay: { type: "number", label: "Delay (ms)" },
        },
      },
    ],
  },
  {
    category: "Blog y contenido dinámico",
    items: [
      {
        name: "Grid de artículos",
        icon: "newspaper",
        defaultPropsJson: {
          count: 3,
          categoryFilter: "",
          showDate: true,
          showAuthor: true,
          showCategory: true,
        },
        propsSchemaJson: {
          count: { type: "number", label: "Artículos a mostrar" },
          categoryFilter: { type: "text", label: "Filtrar categoría" },
          showDate: { type: "toggle", label: "Mostrar fecha" },
          showAuthor: { type: "toggle", label: "Mostrar autor" },
          showCategory: { type: "toggle", label: "Mostrar categoría" },
        },
      },
      {
        name: "Artículo destacado",
        icon: "sticky-note",
        defaultPropsJson: { articleMode: "latest", imageSize: "large" },
        propsSchemaJson: {
          articleMode: { type: "select", label: "Selección", options: ["latest", "manual"] },
          imageSize: { type: "select", label: "Tamaño", options: ["small", "medium", "large"] },
        },
      },
      {
        name: "Texto enriquecido",
        icon: "align-left",
        defaultPropsJson: {
          content: "<h2>Título de sección</h2><p>Contenido de texto libre para páginas informativas.</p>",
          fontSize: 16,
          maxWidth: 800,
        },
        propsSchemaJson: {
          content: { type: "richtext", label: "Contenido" },
          fontSize: { type: "number", label: "Tamaño base" },
          maxWidth: { type: "number", label: "Ancho máximo (px)" },
        },
      },
    ],
  },
];

async function main() {
  console.log("Iniciando seed...");

  await prisma.blockType.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.pageVersion.deleteMany();
  await prisma.page.deleteMany();
  await prisma.site.deleteMany();
  await prisma.tenantUser.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.create({
    data: {
      email: "admin@clickin.app",
      passwordHash,
      name: "Admin Click In",
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      name: "Click In Demo",
      primaryColor: "#2563eb",
      secondaryColor: "#f59e0b",
      fontPreference: "inter",
      defaultLanguage: "es",
    },
  });

  await prisma.tenantUser.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  const site = await prisma.site.create({
    data: {
      tenantId: tenant.id,
      subdomain: "demo",
      defaultLanguage: "es",
      status: "DRAFT",
    },
  });

  const homePage = await prisma.page.create({
    data: {
      siteId: site.id,
      title: "Inicio",
      slug: "",
      status: "PUBLISHED",
      language: "es",
      sortOrder: 0,
      seoJson: {
        metaTitle: "Click In Demo - Inicio",
        metaDescription: "Plataforma de gestión digital empresarial",
        schemaType: "WebPage",
        indexable: true,
      },
    },
  });

  const pages = [
    { title: "Servicios", slug: "servicios", parentId: homePage.id },
    { title: "Nosotros", slug: "nosotros", parentId: homePage.id },
    { title: "Blog", slug: "blog", parentId: homePage.id },
    { title: "Contacto", slug: "contacto", parentId: homePage.id },
  ];

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    await prisma.page.create({
      data: {
        siteId: site.id,
        parentId: p.parentId,
        title: p.title,
        slug: p.slug,
        status: "PUBLISHED",
        language: "es",
        sortOrder: i + 1,
        seoJson: {
          metaTitle: `Click In Demo - ${p.title}`,
          metaDescription: `${p.title} de Click In Demo`,
          schemaType: "WebPage",
          indexable: true,
        },
      },
    });
  }

  const blogCategory = await prisma.blogCategory.create({
    data: { siteId: site.id, name: "General", slug: "general" },
  });

  await prisma.blogPost.create({
    data: {
      siteId: site.id,
      title: "Bienvenido a Click In",
      slug: "bienvenido-a-click-in",
      excerpt: "Descubre cómo Click In puede transformar la presencia digital de tu empresa.",
      contentHtml: "<p>Contenido de ejemplo del primer artículo del blog.</p>",
      categoryId: blogCategory.id,
      authorId: user.id,
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoJson: {
        metaTitle: "Bienvenido a Click In - Blog",
        metaDescription: "Descubre cómo Click In transforma tu presencia digital",
        schemaType: "Article",
        indexable: true,
      },
      tags: ["bienvenida", "clickin"],
    },
  });

  for (const category of blockTypes) {
    for (const item of category.items) {
      await prisma.blockType.create({
        data: {
          name: item.name,
          category: category.category,
          icon: item.icon,
          defaultPropsJson: item.defaultPropsJson,
          propsSchemaJson: item.propsSchemaJson,
        },
      });
    }
  }

  console.log("Seed completado.");
  console.log("  Usuario: admin@clickin.app / admin123");
  console.log(`  Tenant: ${tenant.id}`);
  console.log(`  Site: ${site.id}`);
  console.log(`  Block types: ${blockTypes.reduce((acc, c) => acc + c.items.length, 0)}`);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
