import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annuaire des artisans à Abidjan (Plombier, Électricien, Maçon...) | BARA",
  description: "Trouvez rapidement un artisan qualifié et vérifié dans les 13 communes d'Abidjan. Contact direct et gratuit sur WhatsApp.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
