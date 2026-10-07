import { Navbar } from "@/components/layout/Navbar";
import { FounderPage } from "@/components/founder/FounderPage";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "The Founder's Story — Maison D'Vine",
  description: "A letter from Virender Rawat, founder of Maison D'Vine, on why every dress begins as a story.",
};

export default function FounderRoute() {
  return (
    <main id="founder" className="relative min-h-screen w-full max-w-full min-w-0 overflow-x-clip bg-[#0e0d0c]">
      <Navbar solid />
      <FounderPage />
      <Footer />
    </main>
  );
}
