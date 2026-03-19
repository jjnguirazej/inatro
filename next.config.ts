import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Removido para deploy no Hostinger - use apenas para Docker
  
  // Desabilita cache agressivo para evitar versões antigas
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Headers para controlar cache e CSS
  async headers() {
    return [
      {
        // Páginas HTML - sem cache
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // CSS/JS do Next.js - cache com hash
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "text/css; charset=utf-8",
          },
        ],
      },
      {
        source: "/_next/static/chunks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Imagens - cache moderado
        source: "/:path*.{jpg,jpeg,png,gif,svg,webp,ico}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
