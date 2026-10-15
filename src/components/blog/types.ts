export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; caption: string };

export interface BlogPost {
  id: string;
  image: string;
  date: string;
  category: string;
  title: string;
  description: string;
  href?: string;
  content: ArticleBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "dress-that-feels-like-you",
    image: "/images/blog-one-image.webp",
    date: "MAY 18, 2025",
    category: "STYLE GUIDE",
    title: "How Fashion Influences Confidence",
    description:
      "There are mornings when getting dressed feels ordinary. You open the wardrobe. You choose something. You leave. And there are other mornings when the decision feels strangely important. You...",
    href: "/blog/dress-that-feels-like-you",
    content: [
      {
        type: "p",
        text: "Every woman has, at some point, stood in front of a mirror in a dress that was beautiful and still not quite hers. It is not a question of size or price. It is a question of story.",
      },
      { type: "h2", text: "Start with the feeling, not the trend" },
      {
        type: "p",
        text: "Before you look at silhouettes or swatches, ask yourself how you want to feel when you walk into the room. Grounded? Weightless? A little bit unforgettable? Words like these are a better compass than any season's lookbook.",
      },
      {
        type: "quote",
        text: "The right dress does not change who you are. It lets her arrive.",
      },
      { type: "h2", text: "Silhouette, colour, and the small details" },
      {
        type: "p",
        text: "Flowing skirts move with you and soften a room; structured bodices give a quiet confidence. Colour works the same way: ivory for beginnings, crimson for the moments you refuse to shrink, noir for everything unsaid. Then look closer. A hand-finished seam, a hidden ribbon, a neckline that catches the light.",
      },
      {
        type: "image",
        src: "/images/blog-3-image.webp",
        alt: "Close details of a Maison D'Vine gown",
        caption: "Details are where a dress begins to speak.",
      },
      { type: "h2", text: "Trust the first breath" },
      {
        type: "p",
        text: "When you slip a dress on, notice the first breath you take. If it deepens, you have likely found the one. If you catch yourself adjusting, explaining, apologising, keep looking. Your story deserves a dress that needs no introduction.",
      },
    ],
  },
  {
    id: "a-day-at-maison-dvine",
    image: "/images/blog-2-image.webp",
    date: "JAN 28, 2025",
    category: "BEHIND THE SCENES",
    title: "How Stories Influence Fashion Design: From Emotion to Garment",
    description:
      "A Dress Can Begin Before the Fabric. When we think about fashion design, we often imagine a sketch. A silhouette. A fabric swatch. A colour palette. A designer standing over...",
    href: "/blog/a-day-at-maison-dvine",
    content: [
      {
        type: "p",
        text: "The atelier wakes slowly. Before the first machine hums, there is light on the cutting table, a pot of tea going cold, and a sketchbook left open at yesterday's unfinished line.",
      },
      { type: "h2", text: "Morning: the sketchbook" },
      {
        type: "p",
        text: "Every Maison D'Vine piece begins as a feeling written down as a drawing. We sketch the way a woman moves in it, how the hem might catch a breeze, where the fabric should rest and where it should let go. Most sketches never leave the page. The ones that do earn their place slowly.",
      },
      {
        type: "image",
        src: "/images/blog-one-image.webp",
        alt: "Maison D'Vine atelier at work",
        caption: "From sketchbook to silk: the first draft is always the bravest.",
      },
      { type: "h2", text: "Afternoon: fabric, fitting, patience" },
      {
        type: "p",
        text: "Silks are draped, pinned and re-pinned on the form. Fittings are conversations: what does she want to feel, and what is the fabric willing to do? Some days a single sleeve takes hours. We have made peace with that.",
      },
      {
        type: "quote",
        text: "We do not rush a dress. We wait until it is ready to be worn.",
      },
      { type: "h2", text: "Evening: the final stitch" },
      {
        type: "p",
        text: "The last stitch is always done by hand, quietly, after the studio empties. It is a small ritual, a way of saying the dress is finished and now belongs to someone else's story.",
      },
    ],
  },
  {
    id: "places-that-inspire-us",
    image: "/images/blog-3-image.webp",
    date: "JAN 12, 2025",
    category: "INSPIRATION",
    title: "Dream to Eternity: A Journey Told Through Fashion",
    description:
      "Before the Dress, There Was a Journey. A woman does not remain the same woman throughout her life. She dreams. She becomes. She remembers. She achieves. She returns. She learns....",
    href: "/blog/places-that-inspire-us",
    content: [
      {
        type: "p",
        text: "Inspiration rarely arrives in a grand moment. More often it is the light on an old wall at four in the afternoon, or the sound of a courtyard after rain.",
      },
      { type: "h2", text: "Quiet streets" },
      {
        type: "p",
        text: "We collect small things: a doorway painted a faded green, laundry drifting on a balcony, the pattern a shadow makes across stone steps. These moments find their way into our colour stories long before they become a collection.",
      },
      {
        type: "quote",
        text: "Beauty is usually standing very quietly in the corner of the room.",
      },
      { type: "h2", text: "Grand estates and ruined gardens" },
      {
        type: "p",
        text: "Old havelis, crumbling arches, gardens that have grown wild: there is a romance in things that have been loved for a long time. It reminds us that the best clothes, like the best places, are made to be lived in.",
      },
      {
        type: "image",
        src: "/images/blog-2-image.webp",
        alt: "An old estate in warm evening light",
        caption: "Where the evening light lingers, a new silhouette begins.",
      },
      { type: "h2", text: "Carrying them with us" },
      {
        type: "p",
        text: "We do not copy places, we carry them. A pleat that echoes a stairwell, a shade borrowed from a market at dusk. When you wear a Maison D'Vine piece, you are wearing a little of everywhere that ever moved us.",
      },
    ],
  },
];

export const getPostBySlug = (slug: string) => BLOG_POSTS.find((p) => p.id === slug);

/** Rough reading time in minutes (~200 wpm), never less than 1. */
export const getReadMinutes = (post: BlogPost) => {
  const words = post.content
    .map((b) => ("text" in b ? b.text : b.caption))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};
