import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@deno/kv"],
};

export default nextConfig;
