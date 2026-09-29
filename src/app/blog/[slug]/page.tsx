import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BLOG_POSTS, getPostBySlug } from "@/components/blog/types";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Story not found — Maison D'Vine" };

  return {
    title: `${post.title} — Maison D'Vine Journal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.id !== post.id);

  return (
    <main className="relative min-h-screen w-full max-w-full overflow-x-clip bg-[#0e0d0c]">
      <Navbar />
      <BlogArticle post={post} related={related} />
      <Footer />
    </main>
  );
}
