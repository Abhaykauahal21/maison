import type { Dress } from "@/types/dress";

/**
 * The catalogue — the dresses the shop shows.
 *
 * This file is the source of truth for the storefront: both /dresses and each product page
 * read from it on the server, so the pages stay fast and static. Adding a dress means adding
 * an entry here; the product page, bag and related-dress row all follow automatically.
 *
 * Images are existing site assets, so the shop looks real immediately.
 */
export const SEED_DRESSES: Dress[] = [
  {
    id: "dress-solace",
    slug: "solace",
    name: "Solace",
    tagline: "In the moments I find myself.",
    price: 18500,
    compareAtPrice: 22000,
    collection: "The Echo",
    category: "Gown",
    color: "Ivory Floral",
    fabric: "Printed Silk Charmeuse with Hand-Rolled Hem",
    description:
      "A fluid silk gown cut on the bias, so it moves half a beat behind you. The dawn-toned floral print was painted in-house, and the bodice is quietly corseted — structure you feel, never see.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 12,
    featured: true,
    published: true,
    images: [
      { src: "/images/solace.webp", alt: "Maison D'Vine Solace gown in ivory floral silk" },
      { src: "/images/solace-2-image.webp", alt: "Model wearing the Solace gown" },
      { src: "/images/editorial/dress-i-had.webp", alt: "The Solace gown shown alone" },
    ],
    story: {
      title: "The dress she already had.",
      paragraphs: [
        "If life were a photograph, I wasn't the focus — I was the blur in the background, the quiet shape that gave balance to the scene but never claimed the light.",
        "Solace began as a question I kept avoiding: what would I wear if no one was watching? The answer arrived in dawn-toned silk, painted with a floral that exists nowhere in nature — because the dress wasn't meant to be seen. It was meant to be felt.",
        "Every hem is rolled by hand, every seam pressed twice. It is the slowest dress we make, and the quietest. The one that stays.",
      ],
      images: [
        { src: "/images/editorial/dress-i-had.webp", alt: "The Solace gown, shown without a background" },
      ],
    },
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "dress-longing",
    slug: "longing",
    name: "Longing",
    tagline: "In what lives between our hearts.",
    price: 24000,
    compareAtPrice: null,
    collection: "The Echo",
    category: "Gown",
    color: "Crimson",
    fabric: "Architectural Tulle with Silk Charmeuse Corsetry",
    description:
      "Crimson tulle built over a corseted silk charmeuse core — volume without weight. The skirt is cut in graduated layers so it holds its shape standing still and collapses beautifully in motion.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 8,
    featured: true,
    published: true,
    images: [
      { src: "/images/longing.webp", alt: "Maison D'Vine Longing gown in crimson tulle" },
      { src: "/images/longing-2-image.webp", alt: "Model wearing the Longing gown" },
      { src: "/images/editorial/VintageFloralPeonyMaxiDress.webp", alt: "The Longing gown shown alone" },
    ],
    story: {
      title: "The dress she borrowed.",
      paragraphs: [
        "Sometimes you borrow someone else's dress hoping it will carry the confidence you couldn't find in your own.",
        "That evening my room looked like a small disaster — clothes on the bed, the chair, the floor. Nothing was mine. Nothing felt like me. And then I put on a crimson gown that belonged to someone braver, and for one night I borrowed her courage too.",
        "Longing is that dress, rebuilt. The same impossible red, the same volume — but corseted for you, so the courage fits from the very first seam.",
      ],
      images: [
        { src: "/images/editorial/VintageFloralPeonyMaxiDress.webp", alt: "The Longing gown, shown without a background" },
      ],
    },
    createdAt: "2026-01-12T10:00:00.000Z",
    updatedAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "dress-reverie",
    slug: "reverie",
    name: "Reverie",
    tagline: "For the dreams I don't say out loud.",
    price: 21500,
    compareAtPrice: 26000,
    collection: "The Echo",
    category: "Gown",
    color: "Noir Satin",
    fabric: "Heavy Bias-Cut Satin with Covered Buttons",
    description:
      "Midnight satin, cut on the bias so it pours over the body instead of sitting on it. A low cowl back, twenty-two covered buttons, and a slit placed for walking — not for photographs.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 5,
    featured: false,
    published: true,
    images: [
      { src: "/images/reverie.webp", alt: "Maison D'Vine Reverie gown in noir satin" },
      { src: "/images/reverie-2image.png", alt: "Model wearing the Reverie gown" },
      { src: "/images/editorial/dress-borrowed.webp", alt: "The Reverie gown shown alone" },
    ],
    story: {
      title: "The dress she bought.",
      paragraphs: [
        "There are dresses you buy because they're beautiful. And then there are dresses you buy because you hope they'll turn you into someone else.",
        "I bought this one after seeing it once, and never stopped seeing it again. It waited in my wardrobe through two cities and one wrong address, unworn, unreturned — a promise I wasn't ready to keep.",
        "Reverie is that promise, kept. Satin heavy enough to feel like a decision, cut so it moves like a thought you finally said out loud.",
      ],
      images: [
        { src: "/images/editorial/dress-borrowed.webp", alt: "The Reverie gown, shown without a background" },
      ],
    },
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "dress-daydream",
    slug: "the-daydream",
    name: "The Daydream",
    tagline: "Light as a thought, bold as a beginning.",
    price: 16500,
    compareAtPrice: null,
    collection: "The Dream",
    category: "Gown",
    color: "Ivory Floral",
    fabric: "Organza-Lined Floral Chiffon",
    description:
      "The first dress of The Dream. Floating chiffon over a soft organza underside, with a floral that fades toward the hem — like a thought that only gets clearer the longer you hold it.",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 15,
    featured: true,
    published: true,
    images: [
      { src: "/images/daydream.webp", alt: "Maison D'Vine The Daydream ivory floral gown" },
      { src: "/images/story/Golden%20Window%20Reverie.webp", alt: "The Daydream gown by a sunlit window" },
    ],
    story: {
      title: "Before the dream, there was a daydream.",
      paragraphs: [
        "Every collection I make begins the same way: not with fabric, but with a moment I don't want to end. A morning that ran late on purpose. Light on the floor at four o'clock. A thought I kept having until it became a plan.",
        "The Daydream is the first chapter of that plan. It is the lightest thing we cut — chiffon that weighs almost nothing, printed with a floral that dissolves toward the hem, like a dream you only half remember by lunch.",
        "It is the dress I would wear to begin again. So that is what it is for.",
      ],
      images: [
        { src: "/images/story/Golden%20Window%20Reverie.webp", alt: "A woman in the Daydream gown by a sunlit window" },
      ],
    },
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "dress-awakening",
    slug: "the-awakening",
    name: "The Awakening",
    tagline: "For the day I chose myself.",
    price: 27500,
    compareAtPrice: 31000,
    collection: "The Dream",
    category: "Gown",
    color: "Noir",
    fabric: "Silk Crepe with Sculpted Shoulders",
    description:
      "A noir silk crepe gown with quietly sculpted shoulders and a column skirt that breaks into a soft train. The most formal dress we make — and the most personal.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 6,
    featured: true,
    published: true,
    images: [
      { src: "/images/awakening.webp", alt: "Maison D'Vine The Awakening noir silk gown" },
      { src: "/images/story/CrimsonGownAmongSunlitRuins.webp", alt: "The Awakening gown among sunlit ruins" },
    ],
    story: {
      title: "The day I chose myself.",
      paragraphs: [
        "There is a version of every woman that exists only in the wardrobe — the one she promises to become on a special day that never gets named.",
        "The Awakening is cut for that day. Sculpted shoulders for the weight she has been carrying alone; a column skirt so there is nothing to hide behind; a train that arrives slightly after she does, the way consequences used to.",
        "It is the last dress in the collection and the first one I made. Some stories refuse to be written in order.",
      ],
      images: [
        { src: "/images/story/CrimsonGownAmongSunlitRuins.webp", alt: "The Awakening gown among sunlit stone ruins" },
      ],
    },
    createdAt: "2026-02-05T10:00:00.000Z",
    updatedAt: "2026-02-05T10:00:00.000Z",
  },
];
