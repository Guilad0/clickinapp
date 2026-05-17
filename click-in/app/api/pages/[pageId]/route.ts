import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { pageId } = await params;

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { versions: { orderBy: { publishedAt: "desc" }, take: 10 } },
  });

  if (!page) {
    return NextResponse.json({ error: "Página no encontrada" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { pageId } = await params;
  const body = await request.json();

  const page = await prisma.page.update({
    where: { id: pageId },
    data: {
      ...body,
      status: body.status || "PENDING_CHANGES",
    },
  });

  return NextResponse.json(page);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { pageId } = await params;

  await prisma.page.delete({ where: { id: pageId } });

  return NextResponse.json({ message: "Página eliminada" });
}
