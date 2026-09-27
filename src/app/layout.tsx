import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Alex_Brush, Montserrat } from "next/font/google";
import { MagneticCursor } from "@/components/ui/MagneticCursor";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
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
      className={`${cormorant.variable} ${alexBrush.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="h-full overflow-x-hidden bg-[#0d0c0b] text-white selection:bg-white/20 selection:text-white">
        <MagneticCursor />
        {children}
      </body>
    </html>
  );
}
