import { auth } from "@/lib/auth/auth";
import { EditorShell } from "@/components/cms/editor/editor-shell";

interface Props {
  params: Promise<{ pageId: string }>;
}

export default async function EditorPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) return null;

  const { pageId } = await params;

  return <EditorShell pageId={pageId} />;
}
