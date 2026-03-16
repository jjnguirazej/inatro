import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INATRO – Carta Pronta",
  description: "Verificação de disponibilidade de cartas de condução",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`${geist.className} bg-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
