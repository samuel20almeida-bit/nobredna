import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nobredna.vercel.app";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  metadataBase: new URL(siteUrl),
  title: {
    default: "NobreDNA — Casa de Legados",
    template: "%s · NobreDNA",
  },
  description:
    "Uma Casa editorial: acolhemos autoras, cuidamos de histórias e preservamos legados. Antes de existir um livro, existe uma vida.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NobreDNA",
    title: "NobreDNA — Casa de Legados",
    description:
      "Histórias reais em livros memoráveis. Autorais, coautorias e projetos editoriais.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
