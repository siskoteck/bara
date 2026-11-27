import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chantiers & Demandes de travaux en cours à Abidjan | BARA",
  description: "Consultez les besoins publiés par les habitants d'Abidjan et proposez vos services d'artisan directement.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
