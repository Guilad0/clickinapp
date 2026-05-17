import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { postId } = await params;

  await prisma.blogPost.update({
    where: { id: postId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  return NextResponse.json({ message: "Artículo publicado" });
}
