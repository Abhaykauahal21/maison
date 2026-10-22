"use client";

import type { Dress } from "@/types/dress";
import { formatPrice, shopConfig, whatsappLink } from "@/config/shop";

/**
 * "Choose your feeling, not your size": the two ways to be sure before a dress is cut.
 * Both are per-dress, so the request that reaches the atelier already names the gown.
 * Requests go over WhatsApp, like orders — there is no booking backend.
 */
export function DressTactility({ dress }: { dress: Dress }) {
  const fee = formatPrice(shopConfig.swatchFee);
  const consultFee = formatPrice(shopConfig.consultationFee);

  const open = (lines: string[]) =>
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");

  const requestSwatch = () =>
    open([
      "Hello Maison D'Vine, I would like a fabric swatch box for:",
      "",
      `• ${dress.name} (${dress.fabric}) — ${dress.color}`,
      "",
      `Dress: ${window.location.href}`,
      "",
      "Please share the payment and delivery details.",
    ]);

  const bookConsultation = () =>
    open([
      "Hello Maison D'Vine, I would like to book a bespoke fit consultation for:",
      "",
      `• ${dress.name}`,
      "",
      `Dress: ${window.location.href}`,
      "",
      "Please share the available slots.",
    ]);

  const cards = [
    {
      eyebrow: "Feel the chapter before it’s made.",
      title: "The Fabric Swatch",
      body: `Fabric is experienced, not simply seen. Request a swatch of ${dress.fabric.split(" with ")[0].toLowerCase()} and feel its texture, weight, colour and fall before we cut your chapter.`,
      priceLabel: "Swatch box",
      price: fee,
      cta: "Request a fabric swatch",
      onClick: requestSwatch,
      primary: false,
    },
    {
      eyebrow: "Made for your form.",
      title: "Bespoke Fit Consultation",
      body: "Your chapter begins with understanding you. A private 30-minute virtual consultation with our fit specialist to discuss measurements, proportions and preferred fit before production.",
      priceLabel: "Consultation fee",
      price: consultFee,
      cta: "Book your consultation",
      onClick: bookConsultation,
      primary: true,
    },
  ];

  return (
    <section aria-labelledby="tactility-heading">
      <div className="flex items-center justify-center gap-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#8a6a3b]">02 / 03</p>
        <span className="h-px w-12 bg-[#8a6a3b]/45" />
        <p className="text-[10px] tracking-[0.3em] text-[#8a6a3b] uppercase">Tactility</p>
      </div>
      <h2
        id="tactility-heading"
        className="mt-5 text-center font-serif text-[clamp(26px,4vw,40px)] leading-tight font-semibold text-[#1c1815]"
      >
        Choose Your Feeling, Not Your Size
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            className="flex flex-col border border-[#7c6a52]/25 bg-[#efe9dd]/80 p-6 sm:p-8"
          >
            <p className="text-[10px] tracking-[0.24em] text-[#7c6a52] uppercase">{c.eyebrow}</p>
            <h3 className="mt-3 font-serif text-[22px] tracking-[0.04em] text-[#1c1815] uppercase">
              {c.title}
            </h3>
            <p className="mt-4 flex-1 font-serif text-[14.5px] leading-[1.7] text-[#5b4f43] italic">
              {c.body}
            </p>

            <div className="mt-6 border-t border-[#7c6a52]/25 pt-5">
              <p className="text-[16px] tracking-[0.04em] text-[#1c1815] uppercase">
                {c.priceLabel}: {c.price}
              </p>
              <p className="mt-2.5 text-[11.5px] text-[#6f6252]">
                • {c.price} · Fully redeemable within {shopConfig.creditDays} days
              </p>
            </div>

            <button
              type="button"
              onClick={c.onClick}
              className={`mt-6 w-full cursor-pointer border border-[#1c1815] py-4 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                c.primary
                  ? "bg-[#1c1815] text-[#f6ecd9] hover:bg-[#3a2f24]"
                  : "text-[#1c1815] hover:bg-[#1c1815] hover:text-[#f6ecd9]"
              }`}
            >
              {c.cta} →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
