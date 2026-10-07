import { Navbar } from "@/components/layout/Navbar";
import { AboutPage } from "@/components/about/AboutPage";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "About — Maison D'Vine",
  description:
    "Maison D'Vine was born from a simple belief: every woman carries a story, and what she wears should feel like a part of it.",
};

export default function AboutRoute() {
  return (
    <main id="about" className="relative min-h-screen w-full max-w-full min-w-0 overflow-x-clip bg-[#0e0d0c]">
      <Navbar solid />
      <AboutPage />
      <Footer />
    </main>
  );
}
