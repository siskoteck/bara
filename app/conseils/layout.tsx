import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conseils & Prévention Maison à Abidjan (Climatisation, Plomberie, Électricité) | BARA",
  description: "Guides pratiques rédigés avec les artisans d'Abidjan pour entretenir votre maison, éviter les pannes et réduire vos factures.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
