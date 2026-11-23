import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SacolaDrawer } from "@/components/sacola-drawer";
import { Abertura } from "@/components/abertura";
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
        <Abertura />
        <CartProvider>
          <SiteNav />
          <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-almond focus:px-5 focus:py-3 focus:text-ink">Ir para o conteúdo</a>
          <main id="conteudo">{children}</main>
          <SiteFooter />
          <SacolaDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
