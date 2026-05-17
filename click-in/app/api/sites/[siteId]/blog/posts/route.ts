import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { siteId } = await params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const pageRaw = searchParams.get("page");
  const page = pageRaw ? parseInt(pageRaw) : 1;
  const limit = 20;

  const where: Record<string, unknown> = { siteId };
  if (status) where.status = status;
  if (category) where.categoryId = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { contentHtml: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: where as Prisma.BlogPostWhereInput,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.blogPost.count({ where: where as Prisma.BlogPostWhereInput }),
  ]);

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
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

  const post = await prisma.blogPost.create({
    data: {
      siteId,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? null,
      contentHtml: body.contentHtml ?? null,
      featuredImageUrl: body.featuredImageUrl ?? null,
      categoryId: body.categoryId ?? null,
      authorId: body.authorId || session.user.id,
      status: body.status ?? "DRAFT",
      language: body.language ?? "es",
      seoJson: body.seoJson ?? undefined,
      tags: body.tags ?? [],
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
