import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
  middlewareClientMaxBodySize: "1gb",
};

export default nextConfig;
