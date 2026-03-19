import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache busting: força reload automático adicionando timestamp
  // Remove output standalone para Hostinger
  
  // Gera Build ID único baseado em timestamp
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Adiciona versão aos assets para forçar reload
  env: {
    NEXT_PUBLIC_BUILD_TIME: Date.now().toString(),
  },
  
  // Headers para controlar cache e CSS
  async headers() {
    return [
      {
        // Páginas HTML - NUNCA fazer cache
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
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
          {
            key: "Surrogate-Control",
            value: "no-store",
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
