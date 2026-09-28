import type { Metadata, Viewport } from "next";
import { Alex_Brush } from "next/font/google";
import "./globals.css";

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
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
      className={`${alexBrush.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-x-hidden bg-[#0d0c0b] text-white selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
