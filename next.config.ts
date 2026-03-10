import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "moodle.faculytics.ctr3.org",
      },
    ],
  },
};

export default nextConfig;
