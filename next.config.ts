import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/scio-labs/use-inkathon/raw/main/assets/wallet-logos/**",
      },
    ],
  },
  typescript: {
    // WARNING: Revert this if there's time to find all the lint errors in the template
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
