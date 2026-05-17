import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/client";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { pageId } = await params;

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) {
    return NextResponse.json({ error: "Página no encontrada" }, { status: 404 });
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.pageVersion.create({
      data: {
        pageId: page.id,
        blocksJson: (page.blocksJson as Prisma.InputJsonValue) ?? undefined,
        seoJson: (page.seoJson as Prisma.InputJsonValue) ?? undefined,
        publishedBy: session.user.id,
      },
    });

    await tx.page.update({
      where: { id: pageId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
  });

  return NextResponse.json({ message: "Página publicada" });
}
