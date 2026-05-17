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

  const versions = await prisma.pageVersion.findMany({
    where: { pageId },
    orderBy: { publishedAt: "desc" },
    take: 50,
    include: { publisher: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(versions);
}
