import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SacolaDrawer } from "@/components/sacola-drawer";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nobre DNA — assessoria editorial",
    template: "%s · Nobre DNA",
  },
  description:
    "Assessoria editorial: leitura crítica, preparação, revisão, projeto gráfico e circulação de livros sobre origem, continuidade e legado.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Nobre DNA",
    title: "Nobre DNA — assessoria editorial",
    description:
      "O livro é seu. O trabalho de mesa é nosso. Diagnóstico gratuito do seu original.",
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
        <CartProvider>
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
          <SacolaDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
