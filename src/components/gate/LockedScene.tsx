"use client";

import React from "react";
import { StoryLock } from "@/components/gate/StoryLock";

interface Props {
  seen: boolean;
  registered: boolean;
  maskVeil?: boolean;
}

/**
 * The locked scene, kept quiet: the unreleased page sits dimmed behind one small brass padlock
 * that drops in and settles, with a single line of script and one button underneath.
 * The lock never opens; once the visitor has registered the caption just says they will be kept posted.
 */
export const LockedScene: React.FC<Props> = ({ seen, registered, maskVeil = true })=> (
  <div className={`gate-scene absolute inset-0 z-30 overflow-hidden ${seen ? "is-in" : ""} ${registered ? "is-freed" : ""}`}>
    {/* even dim over the page, a touch darker toward the bottom where it fades into the footer */}
    <div aria-hidden="true" className={`gate-veil pointer-events-none absolute inset-0 bg-[#0e0d0c]/45 ${maskVeil ? "[mask-image:url(/images/step-bg-mobile.webp)] [mask-position:top] [mask-repeat:no-repeat] [mask-size:100%_auto] md:[mask-image:url(/images/step-bg.webp)] [-webkit-mask-image:url(/images/step-bg-mobile.webp)] md:[-webkit-mask-image:url(/images/step-bg.webp)] [-webkit-mask-position:top] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_auto]" : ""}`} />

    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-6 pt-[3%] text-center">
      <div className="gate-lock-drop">
        <StoryLock
          phase="locked"
          label="Coming soon"
          className="gate-no-key h-auto w-[clamp(46px,4.4vw,78px)] drop-shadow-[0_10px_14px_rgba(0,0,0,0.55)]"
        />
      </div>

      <p
        key={registered ? "freed" : "sealed"}
        className="gate-caption font-allura allura-regular font-script font-cursive text-[clamp(22px,2.3vw,42px)] leading-none text-[#f0d9a6] [text-shadow:0_2px_10px_rgba(0,0,0,0.7)]"
      >
        To be continued&hellip;
      </p>
    </div>
  </div>
);
