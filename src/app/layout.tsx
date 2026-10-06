import type { Metadata, Viewport } from "next";
import { Alex_Brush, Allura } from "next/font/google";
import { SiteLoader } from "@/components/common/SiteLoader";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { OffscreenPause } from "@/components/common/OffscreenPause";
import "./globals.css";

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f0e0d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MAISON D'VINE — Not Just Dresses, But Stories",
  description:
    "Every Maison D’Vine creation is inspired by a story — of her, of you, of every woman who dreams, feels, and evolves.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${alexBrush.variable} ${allura.variable} antialiased`}
    >
      <head>
        {/* Always start at the top after a reload (the loader plays first, then the hero) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{history.scrollRestoration="manual"}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#0d0c0b] text-white selection:bg-white/20 selection:text-white">
        <SmoothScroll />
        <SiteLoader />
        {children}
        <OffscreenPause />
      </body>
    </html>
  );
}
