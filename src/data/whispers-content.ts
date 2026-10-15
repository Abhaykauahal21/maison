export interface WhisperImage {
  src: string;
  alt: string;
}

export interface WhisperTestimonial {
  id: string;
  whisper: string;
  message: string;
  response: string;
  author: string;
  location: string;
  /** Optional photo card displayed beside this whisper. */
  image?: WhisperImage;
}

export const defaultWhisperImage: WhisperImage = {
  src: "/images/hero-single-girl.webp",
  alt: "Maison D'Vine fashion editorial portrait",
};

/**
 * Default testimonial content. Keep image data here so a future admin/API can supply
 * the same shape without changing the scrapbook layout. A testimonial-specific image
 * overrides `defaultWhisperImage`.
 */
export const defaultWhispersContent: WhisperTestimonial[] = [
  {
    id: "whisper-001",
    whisper: "Whisper #001",
    message:
      "I really like the concept, it feels fresh. But honestly the prices look high for a brand that just started.",
    response:
      "A completely fair observation. Trust is earned, not demanded. Our pricing simply reflects the uncompromised cost of a slow, conscious, nine-month creation cycle. We appreciate you saying .",
    author: "Anonymous",
    location: "Delhi",
  },
  {
    id: "whisper-002",
    whisper: "Whisper #002",
    message:
      "Love the idea but I don't think I can spend 15k on a dress from a new brand right now.",
    response:
      "We deeply respect that boundary. Investing in a new vision requires certainty. You don't need to own a piece to be part of our dialogue, stay in the courtyard as long as you like.",
    author: "Anonymous",
    location: "Anonymous",
  },
  {
    id: "whisper-003",
    whisper: "Whisper #003",
    message:
      "I'm not the typical slow-fashion customer. I usually shop on impulse, but your story caught my attention. Curious to see where it leads.",
    response:
      "That's exactly the kind of honesty we want here. You don't have to fit the idea perfectly to be curious about it.",
    author: "Shreya Rao",
    location: "Mumbai, India",
    image: {
      src: "/images/whisper-mumbai.webp",
      alt: "Shreya Rao smiling in Mumbai",
    },
  },
];
