import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",  
  experimental: {
    testProxy: process.env.USE_TEST_PROXY === "1",
  },
};

export default nextConfig;
