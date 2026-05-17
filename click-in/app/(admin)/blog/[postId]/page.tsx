import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/cms/blog/blog-editor";

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.tenantId) return null;

  const { postId } = await params;

  const site = await prisma.site.findUnique({
    where: { tenantId: session.user.tenantId },
  });
  if (!site) return null;

  if (postId === "new") {
    return <BlogEditor postId="new" siteId={site.id} />;
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
  });

  if (!post) notFound();

  return (
    <BlogEditor
      postId={post.id}
      siteId={site.id}
      initialData={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        contentHtml: post.contentHtml || "",
        status: post.status,
        categoryId: post.categoryId || "",
        tags: (post.tags as string[]) || [],
        seoJson: (post.seoJson as Record<string, unknown>) || {},
      }}
    />
  );
}
