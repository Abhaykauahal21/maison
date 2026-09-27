import { Hero } from "@/components/home/Hero";
import { EditorialSection } from "@/components/editorial/EditorialSection";
import { DreamSection } from "@/components/dream/DreamSection";
import { StepSection } from "@/components/step/StepSection";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#0e0d0c]">
      <Hero />
      <EditorialSection />
      <DreamSection />
      <StepSection />
    </main>
  );
}
