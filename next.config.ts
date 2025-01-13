import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  skipMiddlewareUrlNormalize: false,
  skipTrailingSlashRedirect: false,
};

export default nextConfig;
