import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { siteId } = await params;

  const pages = await prisma.page.findMany({
    where: { siteId, language: "es" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      _count: {
        select: { children: true },
      },
    },
  });

  return NextResponse.json(pages);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { siteId } = await params;

  const body = await request.json();
  const { title, slug, parentId, language = "es" } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "Título y slug son requeridos" },
      { status: 400 }
    );
  }

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
