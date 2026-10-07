export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    docs: string;
  };
  creator: string;
}

export const siteConfig: SiteConfig = {
  name: "Maison d'Vine",
  shortName: "Maison",
  description:
    "A production-grade, scalable Next.js frontend architecture with modern design system tokens, strict TypeScript, and API-ready service contracts.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/hero-single-girl.webp",
  links: {
    github: "https://github.com",
    docs: "/docs",
  },
  creator: "Frontend Architecture Team",
};
