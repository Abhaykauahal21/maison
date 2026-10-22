/**
 * The Dress — the shop's single product shape.
 *
 * The storefront (/dresses), the product page (/dresses/[slug]) and the bag all speak this
 * one type, so a dress added to the catalogue immediately renders everywhere it appears.
 */

export interface DressImage {
  src: string;
  alt: string;
}

/** Every dress carries its own chapter — the story below the product on its page. */
export interface DressStory {
  /** Story heading, e.g. "The day I stopped dressing for the room." */
  title: string;
  /** One entry per paragraph (rendered in the manuscript reading style). */
  paragraphs: string[];
  /** Optional photos woven into the story. */
  images: DressImage[];
}

/** A label/value row in the craft sheet, e.g. ["Fabric", "100% Cotton Voile"]. */
export type DressSpec = [label: string, value: string];

/** The atelier's own notes on how the dress is made, kept and sent. Shown as tabs on the product page. */
export interface DressCraft {
  /** One italic line in the maker's voice, shown above the sheet. */
  quote: string;
  /** Fabric, fit, length… in reading order (two columns on desktop). */
  details: DressSpec[];
  /** One instruction per line. */
  care: string[];
  provenance: DressSpec[];
}

/** A film of the dress. Both files live under /public. */
export interface DressVideo {
  src: string;
  poster?: string;
}

export interface Dress {
  id: string;
  /** URL segment, unique. Generated from the name, editable in the admin. */
  slug: string;
  name: string;
  /** One poetic line under the name. */
  tagline: string;
  /** Price in INR. */
  price: number;
  /** Original price, shown struck-through when present and higher than price. */
  compareAtPrice?: number | null;
  /** Collection it belongs to, e.g. "The Dream". */
  collection: string;
  /** Category, e.g. "Gown", "Maxi Dress". */
  category: string;
  color: string;
  fabric: string;
  description: string;
  sizes: string[];
  stock: number;
  /** Shown pinned on the catalogue card. */
  featured: boolean;
  /** Unpublished dresses disappear from the shop but stay in the admin. */
  published: boolean;
  /** First image is the card/hero image. */
  images: DressImage[];
  story: DressStory;
  craft: DressCraft;
  /** Optional: the film section shows a quiet placeholder until one is added. */
  video?: DressVideo;
  createdAt: string;
  updatedAt: string;
}

/** A line in the cart. */
export interface CartItem {
  id: string;
  slug: string;
  name: string;
  size: string;
  price: number;
  image: string;
  qty: number;
}
