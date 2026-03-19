import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CacheBuster from "@/components/CacheBuster";

const geist = Geist({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "INATRO – Carta Pronta",
  description: "Verificação de disponibilidade de cartas de condução",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cache busting: adiciona timestamp para forçar reload
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || Date.now();
  
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {/* Cache busting meta tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="version" content={buildTime.toString()} />
        
        {/* Force reload on stale content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Adiciona timestamp a todas as navegações
                var buildTime = '${buildTime}';
                
                // Intercepta navegação do Next.js
                if (typeof window !== 'undefined') {
                  window.addEventListener('popstate', function() {
                    if (!window.location.search.includes('v=')) {
                      window.location.search = 'v=' + buildTime;
                    }
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geist.className} bg-gray-100 min-h-screen antialiased`} suppressHydrationWarning>
        <CacheBuster />
        {children}
      </body>
    </html>
  );
}
