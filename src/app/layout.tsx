import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Le Nil et La Seine | Magazine Numérique Interactif",
  description: "Découvrez Le Nil et La Seine, un magazine interactif de fin d'études explorant 6 domaines clés (Politique, Historique, Économique, Médical, Éducatif, Sport) réalisé par la Faculté des Lettres, Université de Mansoura (2026).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-luxury-bg text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}


