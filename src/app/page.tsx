import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { EditorialSection } from "@/components/editorial/EditorialSection";
import { DreamSection } from "@/components/dream/DreamSection";
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
      {STORY_GATE_ENABLED ? (
        // The Dream is shown only as a small dimmed, locked peek (Step 1 stays hidden); everything after it is fully visible.
        // (flip STORY_GATE_ENABLED to false to release the Dream)
        <>
          <StoryGate
            className="-mt-1.5 sm:-mt-2 md:-mt-3.5 lg:-mt-5 xl:-mt-6"
            height="clamp(340px,26vw,520px)"
            tornTop={false}
            maskVeil={false}
          >
            <DreamSection />
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
          <DreamSection />
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
