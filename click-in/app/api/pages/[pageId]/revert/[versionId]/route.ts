import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ pageId: string; versionId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { pageId, versionId } = await params;

  const version = await prisma.pageVersion.findUnique({
    where: { id: versionId },
  });

  if (!version || version.pageId !== pageId) {
    return NextResponse.json({ error: "Versión no encontrada" }, { status: 404 });
  }

  await prisma.page.update({
    where: { id: pageId },
    data: {
      blocksJson: version.blocksJson ?? undefined,
      seoJson: version.seoJson ?? undefined,
      status: "PENDING_CHANGES",
    },
  });

  return NextResponse.json({ message: "Versión restaurada como borrador" });
}
