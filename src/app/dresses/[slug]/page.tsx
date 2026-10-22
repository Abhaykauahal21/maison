import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { DressProduct } from "@/components/shop/DressProduct";
import { DressStory } from "@/components/shop/DressStory";
import { DressCraft } from "@/components/shop/DressCraft";
import { DressTactility } from "@/components/shop/DressTactility";
import { DressFilm } from "@/components/shop/DressFilm";
import { DressCard } from "@/components/shop/DressCard";
import { SEED_DRESSES } from "@/data/seed-dresses";
import { tornPaperClip } from "@/lib/torn-paper";

const shop = SEED_DRESSES.filter((d) => d.published);

export function generateStaticParams() {
  return shop.map((dress) => ({ slug: dress.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dress = shop.find((d) => d.slug === slug);
  if (!dress) return { title: "The Dresses — Maison D'Vine" };
  return {
    title: `${dress.name} — Maison D'Vine`,
    description: dress.description,
  };
}

export default async function DressRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dress = shop.find((d) => d.slug === slug);
  if (!dress) notFound();

  // Only the dress's own collection: someone reading an Echo dress is shown Echo, a Dream dress shows Dream.
  const related = shop
    .filter((d) => d.id !== dress.id && d.collection === dress.collection)
    .slice(0, 3);

  return (
    <main
      id="dresses"
      className="relative min-h-screen w-full max-w-full min-w-0 overflow-x-clip bg-[#0e0d0c]"
    >
      <Navbar solid />

      <DressProduct dress={dress} />

      {/* ---------------- The story, on torn parchment ---------------- */}
      <section
        className="relative z-30 -mt-6 pb-32 md:-mt-10 md:pb-40"
        style={{
          clipPath: tornPaperClip,
          background:
            "radial-gradient(120% 100% at 50% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)",
        }}
      >
        <div className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 md:pt-32">
          <DressStory dress={dress} />

          <div className="mt-24 border-t border-[#7c6a52]/25 pt-16 md:mt-28">
            <DressCraft dress={dress} />
          </div>

          <div className="mt-20 md:mt-24">
            <DressTactility dress={dress} />
          </div>

          <div className="mt-20 md:mt-24">
            <DressFilm dress={dress} />
          </div>

          {related.length > 0 && (
            <div className="mt-24 border-t border-[#7c6a52]/25 pt-16 md:mt-28">
              <div className="text-center">
                <p className="text-[10px] tracking-[0.4em] text-[#8a6a3b] uppercase">
                  More from {dress.collection}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(24px,3.4vw,34px)] leading-tight text-[#1c1815]">
                  Continue the chapter
                </h3>
              </div>
              <div className="mt-12 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((d) => (
                  <DressCard key={d.id} dress={d} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
