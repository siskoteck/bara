import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide des tarifs des artisans à Abidjan (Prix moyens en FCFA) | BARA",
  description: "Consultez les fourchettes de prix indicatives en FCFA pour vos travaux de plomberie, électricité, climatisation, maçonnerie et mécanique à Abidjan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
