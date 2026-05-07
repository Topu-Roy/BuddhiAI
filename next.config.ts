import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bwjcur3siq.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
