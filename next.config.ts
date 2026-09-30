import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // every quality value used by an <Image> must be listed here (Garden uses 85 and 90)
    qualities: [75, 85, 90, 100],
  },
};

export default nextConfig;
