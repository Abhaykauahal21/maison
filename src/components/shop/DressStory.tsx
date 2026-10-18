import Image from "next/image";
import type { Dress } from "@/types/dress";

/**
 * The dress's story, set like a page from a book — drop cap, generous leading, and the
 * collection's photograph mounted as a plate. This is what separates a Maison D'Vine dress
 * from a product: the reason it was made, told underneath the reason to buy it.
 */
export function DressStory({ dress }: { dress: Dress }) {
  const [lead, ...body] = dress.story.paragraphs;
  const [firstWord, ...restOfLead] = lead.split(" ");

  return (
    <article className="mx-auto max-w-[720px]">
      {/* opening rule */}
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-14 bg-[#8a6a3b]/45" />
        <p className="text-[10px] tracking-[0.42em] text-[#8a6a3b] uppercase">Her Story</p>
        <span className="h-px w-14 bg-[#8a6a3b]/45" />
      </div>

      <h2 className="mt-7 text-center font-serif text-[clamp(26px,4vw,40px)] leading-[1.25] text-[#1c1815] italic">
        {dress.story.title}
      </h2>

      <div className="mt-10 text-[16px] leading-[2.05] text-[#3b322a]">
        {lead && (
          <p>
            <span
              aria-hidden="true"
              className="float-left mt-1.5 mr-3 font-serif text-[62px] leading-[0.72] text-[#8a6a3b]"
            >
              {firstWord.charAt(0)}
            </span>
            {firstWord.slice(1)}
            {restOfLead.length > 0 ? ` ${restOfLead.join(" ")}` : ""}
          </p>
        )}

        {dress.story.images[0] && (
          <figure className="my-11 flex flex-col items-center">
            <div className="relative w-full max-w-[440px] -rotate-[1.4deg] border-[10px] border-white bg-white shadow-[0_14px_30px_rgba(48,33,18,0.22)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={dress.story.images[0].src}
                  alt={dress.story.images[0].alt}
                  fill
                  sizes="(max-width: 768px) 88vw, 640px"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-5 text-center font-allura text-[19px] text-[#8a6a3b]">
              {dress.name} · {dress.collection}
            </figcaption>
          </figure>
        )}

        {body.map((p, i) => (
          <p key={i} className={i === 0 ? "mt-6" : "mt-6"}>
            {p}
          </p>
        ))}

        {dress.story.images.slice(1).map((img, i) => (
          <figure
            key={img.src}
            className={`my-10 ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
          >
            <div className="border-[10px] border-white bg-white shadow-[0_8px_22px_rgba(48,33,18,0.16)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="720px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-3 text-center font-allura text-[19px] text-[#8a6a3b]">
              {img.alt}
            </p>
          </figure>
        ))}
      </div>
    </article>
  );
}
