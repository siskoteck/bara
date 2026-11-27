import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demander un devis gratuit à un artisan à Abidjan | BARA",
  description: "Décrivez votre besoin de travaux ou dépannage à Abidjan et recevez des propositions d'artisans disponibles près de chez vous.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
