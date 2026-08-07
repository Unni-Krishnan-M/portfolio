import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — there's an unrelated package-lock.json in the
  // parent directory that Turbopack would otherwise try to resolve against.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three.js and its ecosystem ship large ESM bundles; keeping them out of the
  // shared chunk means the 3D hero only costs anything on devices that load it.
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "framer-motion"],
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
