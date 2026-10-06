import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { EditorialSection } from "@/components/editorial/EditorialSection";
import { DreamSection } from "@/components/dream/DreamSection";
import { StepSection } from "@/components/step/StepSection";
import { GardenSection } from "@/components/garden/GardenSection";
import { IndiaSection } from "@/components/india/IndiaSection";
import { OurStorySection } from "@/components/story/OurStorySection";
import { FaqSection } from "@/components/faq/FaqSection";
import { BlogSection } from "@/components/blog/BlogSection";
import { CloserChapterSection } from "@/components/closer/CloserChapterSection";
import { Footer } from "@/components/layout/footer";
import { StoryGate, STORY_GATE_ENABLED } from "@/components/gate/StoryGate";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full max-w-full min-w-0 bg-[#0e0d0c] relative overflow-x-clip">
      {/* Sticky Top-level Global Navigation */}
      <Navbar />

      <Hero />
      <EditorialSection />
      <DreamSection />
      {STORY_GATE_ENABLED ? (
        // Step 1 is shown only as a small blurred, locked peek; everything after it stays fully visible.
        // (flip STORY_GATE_ENABLED to false to release Step 1 as well)
        <>
          <StoryGate>
            <StepSection />
          </StoryGate>
          <GardenSection />
          <IndiaSection />
          <OurStorySection />
          <FaqSection />
          <BlogSection />
          <CloserChapterSection />
          <Footer />
        </>
      ) : (
        <>
          <StepSection />
          <GardenSection />
          <IndiaSection />
          <OurStorySection />
          <FaqSection />
          <BlogSection />
          <CloserChapterSection />
          <Footer />
        </>
      )}
    </main>
  );
}
