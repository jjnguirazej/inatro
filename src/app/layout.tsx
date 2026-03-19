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
      </head>
      <body 
        className={`${geist.className} antialiased`}
        style={{
          background: 'var(--background)',
          color: 'var(--foreground)',
          minHeight: '100vh'
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
