import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { DressProduct } from "@/components/shop/DressProduct";
import { DressStory } from "@/components/shop/DressStory";
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

  const sameCollection = shop.filter((d) => d.id !== dress.id && d.collection === dress.collection);
  const others = shop.filter((d) => d.id !== dress.id && d.collection !== dress.collection);
  const related = [...sameCollection, ...others].slice(0, 3);

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

          {related.length > 0 && (
            <div className="mt-24 border-t border-[#7c6a52]/25 pt-16 md:mt-28">
              <div className="text-center">
                <p className="text-[10px] tracking-[0.4em] text-[#8a6a3b] uppercase">
                  More from the maison
                </p>
                <h3 className="mt-3 font-serif text-[clamp(24px,3.4vw,34px)] leading-tight text-[#1c1815]">
                  Other dresses in the wardrobe
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
