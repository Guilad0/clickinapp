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

  const assets = await prisma.asset.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(assets);
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

  const asset = await prisma.asset.create({
    data: {
      siteId,
      url: body.url,
      alt: body.alt ?? null,
      fileType: body.fileType ?? null,
      fileSize: body.fileSize ?? null,
      uploadedBy: session.user.id,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}
