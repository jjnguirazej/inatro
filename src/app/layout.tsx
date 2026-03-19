import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="pt" suppressHydrationWarning style={{colorScheme: 'light'}}>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Prevent FOUC - Force CSS variables before render */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: #ffffff;
              --foreground: #171717;
              color-scheme: light;
            }
            html {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            body {
              background: #ffffff;
              color: #171717;
              min-height: 100vh;
            }
          `
        }} />
      </head>
      <body 
        className={`${geist.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
