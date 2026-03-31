import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: true,
  transpilePackages: ["@jogwa-log/data-access"],
};

export default nextConfig;
