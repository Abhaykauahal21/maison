import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { CatalogClient } from "@/components/shop/CatalogClient";
import { SEED_DRESSES } from "@/data/seed-dresses";
import { tornPaperClip } from "@/lib/torn-paper";

export const metadata = {
  title: "The Dresses — Maison D'Vine",
  description:
    "Every dress in the Maison D'Vine wardrobe — made to order in India, cut for the story you are already living.",
};

export default function DressesRoute() {
  const dresses = SEED_DRESSES.filter((d) => d.published);

  return (
    <main
      id="dresses"
      className="relative min-h-screen w-full max-w-full min-w-0 overflow-x-clip bg-[#0e0d0c]"
    >
      <Navbar solid />

      {/* ---------------- Opening plate ---------------- */}
      <section className="relative flex min-h-[64svh] items-center justify-center overflow-hidden pt-28 pb-20">
        <Image
          src="/images/story/CrimsonGownAmongSunlitRuins.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0e0d0c]/85 via-[#0e0d0c]/70 to-[#0e0d0c]"
        />

        <div className="relative mx-auto max-w-[820px] px-6 text-center">
          <p className="font-allura text-[26px] leading-none text-[#d9b877] sm:text-[30px]">
            Maison D&rsquo;Vine
          </p>
          <h1 className="mt-4 font-serif text-[clamp(40px,9vw,86px)] leading-[0.95] text-[#f3ead9]">
            The Dresses
          </h1>
          <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-8 text-[#f3ead9]/70 italic">
            Every piece is cut to order, one dress at a time — and every one carries the story it
            was born from.
          </p>
          <span className="mt-9 block h-14 w-px bg-gradient-to-b from-[#d9b877]/70 to-transparent mx-auto" />
        </div>
      </section>

      {/* ---------------- The wardrobe, on torn parchment ---------------- */}
      <section
        className="relative z-30 -mt-6 pb-32 md:-mt-10 md:pb-40"
        style={{
          clipPath: tornPaperClip,
          background:
            "radial-gradient(120% 100% at 50% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)",
        }}
      >
        <div className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 md:pt-32">
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-[0.4em] text-[#8a6a3b] uppercase">
              The Wardrobe
            </p>
            <h2 className="mt-3 font-serif text-[clamp(28px,4vw,40px)] leading-tight text-[#1c1815]">
              Choose the one that already feels like you
            </h2>
          </div>

          <CatalogClient dresses={dresses} />

          <p className="mx-auto mt-20 max-w-[560px] text-center text-[13px] leading-7 text-[#5b4a35]/80 italic">
            Dress sizes are cut generously and finished by hand. If you are between two sizes, we
            will help you choose — write to us on WhatsApp and we will answer personally.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
