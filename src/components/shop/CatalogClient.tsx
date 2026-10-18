"use client";

import { useMemo, useState } from "react";
import type { Dress } from "@/types/dress";
import { DressCard } from "@/components/shop/DressCard";

/**
 * The catalogue wall: one filter row, then the dresses.
 *
 * Filtering lives here (not in the URL) so the wall reacts instantly — the collections are
 * few enough that a chip row is easier to understand than a sidebar.
 */
export function CatalogClient({ dresses }: { dresses: Dress[] }) {
  const collections = useMemo(
    () => ["All dresses", ...Array.from(new Set(dresses.map((d) => d.collection)))],
    [dresses]
  );
  const [active, setActive] = useState("All dresses");

  const visible =
    active === "All dresses" ? dresses : dresses.filter((d) => d.collection === active);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {collections.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={on}
              className={`cursor-pointer border px-4 py-2 text-[10px] tracking-[0.24em] uppercase transition-colors duration-300 ${
                on
                  ? "border-transparent bg-[#1c1815] text-[#f3ead9]"
                  : "border-[#7c6a52]/40 text-[#5b4a35] hover:border-[#1c1815]/60 hover:text-[#1c1815]"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-center font-allura text-[19px] text-[#8a6a3b]">
        {visible.length} {visible.length === 1 ? "dress" : "dresses"} in the wardrobe
      </p>

      <div className="mt-10 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((dress, i) => (
          <DressCard key={dress.id} dress={dress} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
