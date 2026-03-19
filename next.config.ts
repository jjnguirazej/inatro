import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Removido para deploy no Hostinger - use apenas para Docker
  
  // Desabilita cache agressivo para evitar versões antigas
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Headers para controlar cache
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
