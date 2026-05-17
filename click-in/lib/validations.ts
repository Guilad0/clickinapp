import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const pageCreateSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  parentId: z.string().optional(),
  language: z.string().default("es"),
  blocksJson: z.any().optional(),
  seoJson: z.any().optional(),
});

export const pageUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones")
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "PENDING_CHANGES", "ERROR"]).optional(),
  language: z.string().optional(),
  blocksJson: z.any().optional(),
  seoJson: z.any().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
});

export const blogPostCreateSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones")
    .optional(),
  excerpt: z.string().max(200).optional(),
  contentHtml: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).default("DRAFT"),
  language: z.string().default("es"),
  seoJson: z.any().optional(),
  tags: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const seoSchema = z.object({
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(160).optional(),
  ogImage: z.string().optional(),
  schemaType: z
    .enum(["Article", "FAQPage", "LocalBusiness", "Product", "Service", "WebPage"])
    .optional(),
  indexable: z.boolean().default(true),
});
