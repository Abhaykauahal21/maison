import Image from "next/image";
import Link from "next/link";
import type { Dress } from "@/types/dress";
import { formatPrice } from "@/config/shop";

/**
 * A dress on the catalogue wall — a printed plate on parchment.
 *
 * The first image is the card image; hovering lifts it a little and slides up the
 * "view" band, so the page stays quiet until you go looking for something.
 */
export function DressCard({ dress, priority = false }: { dress: Dress; priority?: boolean }) {
  const price = formatPrice(dress.price);
  const compare =
    dress.compareAtPrice && dress.compareAtPrice > dress.price
      ? formatPrice(dress.compareAtPrice)
      : null;
  const soldOut = dress.stock <= 0;

  return (
    <Link href={`/dresses/${dress.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden border border-[#7c6a52]/30 bg-[#e9dcc6] shadow-[0_6px_18px_rgba(48,33,18,0.10)]">
        <Image
          src={dress.images[0].src}
          alt={dress.images[0].alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 30vw"
          className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] ${
            soldOut ? "opacity-60 grayscale" : ""
          }`}
        />

        {/* inner hairline, like a mount around a photograph */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[6px] border border-[#f8f2e8]/45"
        />

        {dress.featured && !soldOut && (
          <span
            className="absolute top-3 -left-1 -rotate-[4deg] bg-[#d6c291]/95 px-3.5 py-1 font-allura text-[17px] leading-none text-[#4a3a22] shadow-[0_2px_5px_rgba(60,40,20,0.25)]"
            style={{
              clipPath:
                "polygon(0 10%, 4% 0, 96% 4%, 100% 22%, 97% 100%, 3% 96%)",
            }}
          >
            Atelier&rsquo;s pick
          </span>
        )}

        {soldOut && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="border border-[#7c6a52]/50 bg-[#f8f2e8]/85 px-4 py-2 text-[10px] tracking-[0.32em] text-[#5b4a35] uppercase">
              Sold out
            </span>
          </span>
        )}

        {/* hover band */}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[#1c1815]/92 py-2.5 text-center text-[10px] tracking-[0.3em] text-[#f3ead9] uppercase transition-transform duration-500 ease-out group-hover:translate-y-0">
          View the dress
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[9.5px] tracking-[0.3em] text-[#8a6a3b] uppercase">
          {dress.collection}
        </p>
        <h3 className="mt-1.5 font-serif text-[21px] leading-tight text-[#1c1815] transition-colors duration-300 group-hover:text-[#8a6a3b]">
          {dress.name}
        </h3>
        <p className="mt-0.5 font-allura text-[18px] leading-snug text-[#8a6a3b]">
          {dress.tagline}
        </p>
        <p className="mt-2.5 flex items-baseline gap-2.5 text-[13px] text-[#3b322a]">
          <span>{price}</span>
          {compare && (
            <span className="text-[12px] text-[#998a76] line-through">{compare}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
