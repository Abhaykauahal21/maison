"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dress } from "@/types/dress";
import { formatCurrency } from "@/lib/utils";
import { shopConfig, whatsappLink } from "@/config/shop";
import { useShopStore } from "@/store/shop-store";
import { useUiStore } from "@/store/ui-store";

/**
 * The product page: the dress on the left, everything you need to decide on the right.
 *
 * Size is chosen before the dress can be bagged — we would rather ask once here than
 * exchange a gown later. The bag itself lives in the drawer, so "Add to bag" hands off
 * immediately instead of holding the visitor on this page.
 */
export function DressProduct({ dress }: { dress: Dress }) {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const addToCart = useShopStore((s) => s.addToCart);
  const addToast = useUiStore((s) => s.addToast);

  const price = formatCurrency(dress.price, shopConfig.currency, shopConfig.locale);
  const compare =
    dress.compareAtPrice && dress.compareAtPrice > dress.price
      ? formatCurrency(dress.compareAtPrice, shopConfig.currency, shopConfig.locale)
      : null;
  const soldOut = dress.stock <= 0;

  const addToBag = () => {
    if (!size) {
      setError(true);
      return;
    }
    addToCart({
      id: dress.id,
      slug: dress.slug,
      name: dress.name,
      size,
      price: dress.price,
      image: dress.images[0].src,
    });
    addToast({
      type: "success",
      message: `${dress.name} added to your bag`,
      description: `Size ${size}`,
    });
  };

  const orderOnWhatsApp = () => {
    const message = [
      "Hello Maison D'Vine, I would like to order:",
      "",
      `• ${dress.name}${size ? ` — Size ${size}` : ""} — ${price}`,
      "",
      `I was looking at this dress: ${window.location.href}`,
      "",
      "Please share the payment and delivery details.",
    ].join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative w-full pt-28 pb-24 lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-[4vw]">
        <Link
          href="/dresses"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#f3ead9]/60 uppercase transition-colors hover:text-[#d9b877]"
        >
          <span aria-hidden="true">←</span> The Wardrobe
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* ---------------- Gallery ---------------- */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden border border-[#f3ead9]/12 bg-[#e9dcc6]">
              <Image
                src={dress.images[active].src}
                alt={dress.images[active].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 border border-[#f8f2e8]/30"
              />
              {dress.featured && (
                <span
                  className="absolute top-4 -left-1 -rotate-[4deg] bg-[#d6c291]/95 px-3.5 py-1 font-allura text-[18px] leading-none text-[#4a3a22] shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                  style={{ clipPath: "polygon(0 10%, 4% 0, 96% 4%, 100% 22%, 97% 100%, 3% 96%)" }}
                >
                  Atelier&rsquo;s pick
                </span>
              )}
            </div>

            {dress.images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {dress.images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === active}
                    className={`relative h-[92px] w-[70px] cursor-pointer overflow-hidden border bg-[#e9dcc6] transition-colors ${
                      i === active
                        ? "border-[#d9b877]"
                        : "border-[#f3ead9]/15 hover:border-[#f3ead9]/40"
                    }`}
                  >
                    <Image src={img.src} alt={img.alt} fill sizes="70px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------------- Buy box ---------------- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] tracking-[0.34em] text-[#d9b877] uppercase">
              {dress.collection} · {dress.category}
            </p>
            <h1 className="mt-3 font-serif text-[clamp(36px,5.5vw,58px)] leading-[1.02] text-[#f3ead9]">
              {dress.name}
            </h1>
            <p className="mt-2 font-allura text-[24px] leading-snug text-[#d9b877]">
              {dress.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-[24px] text-[#f3ead9]">{price}</span>
              {compare && (
                <span className="text-[15px] text-[#f3ead9]/40 line-through">{compare}</span>
              )}
              <span className="text-[11px] text-[#f3ead9]/45">inclusive of all taxes</span>
            </div>

            <p className="mt-6 max-w-[560px] text-[14.5px] leading-8 text-[#f3ead9]/75">
              {dress.description}
            </p>

            {/* size */}
            <div className="mt-9">
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] tracking-[0.3em] text-[#f3ead9]/70 uppercase">
                  Select a size
                </p>
                <span className="font-allura text-[17px] text-[#d9b877]">
                  Between sizes? Ask us
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {dress.sizes.map((s) => {
                  const on = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s);
                        setError(false);
                      }}
                      aria-pressed={on}
                      disabled={soldOut}
                      className={`min-w-[52px] cursor-pointer border px-3.5 py-2.5 text-[11px] tracking-[0.16em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                        on
                          ? "border-[#d9b877] bg-[#d9b877] text-[#1c1815]"
                          : "border-[#f3ead9]/25 text-[#f3ead9]/85 hover:border-[#d9b877] hover:text-[#d9b877]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {error && (
                <p className="mt-3 text-[12px] text-[#e0a08a]">
                  Please choose a size to continue.
                </p>
              )}
            </div>

            {/* actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={addToBag}
                disabled={soldOut}
                className="flex-1 cursor-pointer bg-[#f3ead9] py-4 text-[11px] tracking-[0.3em] text-[#1c1815] uppercase transition-colors duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {soldOut ? "Sold out" : "Add to bag"}
              </button>
              <button
                type="button"
                onClick={orderOnWhatsApp}
                className="flex-1 cursor-pointer border border-[#f3ead9]/45 py-4 text-[11px] tracking-[0.3em] text-[#f3ead9] uppercase transition-colors duration-300 hover:border-[#d9b877] hover:text-[#d9b877]"
              >
                Order on WhatsApp
              </button>
            </div>

            <p className="mt-4 text-[12px] leading-6 text-[#f3ead9]/50">
              {shopConfig.madeToOrderNote}
              {!soldOut && dress.stock <= 6 ? ` · only ${dress.stock} left` : ""}
            </p>

            {/* spec sheet */}
            <dl className="mt-9 border-t border-[#f3ead9]/12 text-[13px]">
              {[
                ["Fabric", dress.fabric],
                ["Colour", dress.color],
                ["Silhouette", dress.category],
                ["Collection", dress.collection],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex gap-6 border-b border-[#f3ead9]/10 py-3.5"
                >
                  <dt className="w-[92px] shrink-0 text-[10px] tracking-[0.22em] text-[#f3ead9]/45 uppercase">
                    {label}
                  </dt>
                  <dd className="text-[#f3ead9]/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
