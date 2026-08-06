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
    default: "Editora Nobre DNA — livros sobre origem e legado",
    template: "%s · Editora Nobre DNA",
  },
  description:
    "Casa editorial dedicada a obras sobre origem, continuidade e o que uma geração entrega à seguinte.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Editora Nobre DNA",
    title: "Editora Nobre DNA",
    description:
      "Livros sobre origem, continuidade e legado. Catálogo curto, tiragem limitada.",
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
