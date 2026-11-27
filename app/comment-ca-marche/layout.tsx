import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche — Trouver un artisan ou inscrire son activité | BARA Abidjan",
  description: "Découvrez comment contacter gratuitement un artisan vérifié à Abidjan sur WhatsApp ou développer votre clientèle locale.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
