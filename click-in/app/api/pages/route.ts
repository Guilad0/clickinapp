import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const siteId = process.env.DEFAULT_SITE_ID;
  if (!siteId) {
    return NextResponse.json({ error: "DEFAULT_SITE_ID no configurado" }, { status: 500 });
  }

  const pages = await prisma.page.findMany({
    where: { siteId, language: "es" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { children: true } } },
  });

  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const siteId = process.env.DEFAULT_SITE_ID;
  if (!siteId) {
    return NextResponse.json({ error: "DEFAULT_SITE_ID no configurado" }, { status: 500 });
  }

  const body = await request.json();
  const { title, slug: slugInput, parentId, language = "es" } = body;

  if (!title) {
    return NextResponse.json({ error: "Título es requerido" }, { status: 400 });
  }

  const slug = slugInput || slugify(title);

  const maxSortPage = await prisma.page.findFirst({
    where: { siteId, parentId: parentId ?? null, language },
    orderBy: { sortOrder: "desc" },
  });

  const page = await prisma.page.create({
    data: {
      siteId,
      title,
      slug,
      parentId: parentId ?? null,
      language,
      sortOrder: (maxSortPage?.sortOrder ?? -1) + 1,
      status: "DRAFT",
    },
  });

  return NextResponse.json(page, { status: 201 });
}
