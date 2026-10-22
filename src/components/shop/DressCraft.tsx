"use client";

import { useState } from "react";
import type { Dress, DressSpec } from "@/types/dress";

const TABS = [
  { id: "details", label: "Details" },
  { id: "care", label: "Care" },
  { id: "provenance", label: "Provenance & Shipping" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SpecGrid({ rows }: { rows: DressSpec[] }) {
  return (
    <dl className="grid gap-x-16 md:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-6 py-3.5">
          <dt className="w-[92px] shrink-0 text-[11px] font-semibold tracking-[0.08em] text-[#1c1815] uppercase">
            {label}
          </dt>
          <dd className="text-[13px] leading-6 text-[#5b4f43]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The craftsmanship sheet: one quote in the maker's voice, then Details / Care / Provenance tabs. */
export function DressCraft({ dress }: { dress: Dress }) {
  const [tab, setTab] = useState<TabId>("details");
  const { craft } = dress;

  return (
    <section aria-labelledby="craft-heading">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex items-center gap-4">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#8a6a3b]">01 / 03</p>
          <span className="h-px w-10 bg-[#8a6a3b]/45" />
          <h2
            id="craft-heading"
            className="text-[10px] tracking-[0.3em] text-[#8a6a3b] uppercase"
          >
            The Craftsmanship &amp; Atelier Protocol
          </h2>
        </div>

        <div role="tablist" aria-label="Dress information" className="flex gap-6">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`craft-tab-${t.id}`}
                aria-selected={on}
                aria-controls={`craft-panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`cursor-pointer border-b pb-1 text-[10.5px] tracking-[0.18em] uppercase transition-colors ${
                  on
                    ? "border-[#1c1815] font-semibold text-[#1c1815]"
                    : "border-transparent text-[#8a7d6c] hover:text-[#1c1815]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-8 max-w-[560px] font-serif text-[clamp(17px,2vw,20px)] leading-[1.5] text-[#1c1815] italic">
        &ldquo;{craft.quote}&rdquo;
      </p>

      <div
        role="tabpanel"
        id={`craft-panel-${tab}`}
        aria-labelledby={`craft-tab-${tab}`}
        className="mt-8 border-t border-[#7c6a52]/25 pt-3"
      >
        {tab === "details" && <SpecGrid rows={craft.details} />}
        {tab === "provenance" && <SpecGrid rows={craft.provenance} />}
        {tab === "care" && (
          <ul className="grid gap-x-16 md:grid-cols-2">
            {craft.care.map((line) => (
              <li
                key={line}
                className="flex gap-3 py-3.5 text-[13px] leading-6 text-[#5b4f43]"
              >
                <span aria-hidden="true" className="text-[#8a6a3b]">
                  •
                </span>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
