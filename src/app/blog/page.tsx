import { Navbar } from "@/components/layout/Navbar";
import { BlogSection } from "@/components/blog/BlogSection";

export const metadata = {
  title: "Blog & Journal — Maison D'Vine",
  description: "Stories, atelier journals, and archival reflections from Maison D'Vine.",
};

export default function BlogPageRoute() {
  return (
    <main className="min-h-screen w-full bg-[#0e0d0c] relative pt-20">
      <Navbar />
      <BlogSection />
    </main>
  );
}
