import Image from "next/image";
import type { Dress } from "@/types/dress";

/**
 * The dress in motion. Set `video` on the dress (see types/dress.ts) and it plays here; until
 * then the section holds the dress's own photograph with a quiet note, so the page never
 * shows a broken player.
 */
export function DressFilm({ dress }: { dress: Dress }) {
  const { video } = dress;
  const poster = video?.poster ?? dress.images[0].src;

  return (
    <section aria-labelledby="film-heading">
      <div className="flex items-center justify-center gap-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#8a6a3b]">03 / 03</p>
        <span className="h-px w-12 bg-[#8a6a3b]/45" />
        <p className="text-[10px] tracking-[0.3em] text-[#8a6a3b] uppercase">The Film</p>
      </div>
      <h2
        id="film-heading"
        className="mt-5 text-center font-serif text-[clamp(26px,4vw,40px)] leading-tight font-semibold text-[#1c1815]"
      >
        See {dress.name} Move
      </h2>

      <div className="relative mx-auto mt-10 aspect-video w-full max-w-[960px] overflow-hidden border border-[#7c6a52]/25 bg-[#1c1815]">
        {video ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={poster}
            className="h-full w-full object-cover"
          >
            <source src={video.src} />
          </video>
        ) : (
          <>
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover opacity-45 blur-[2px]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#f6ecd9]/60 text-[#f6ecd9]">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <p className="font-allura text-[26px] text-[#f6ecd9]">The film is being cut</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
