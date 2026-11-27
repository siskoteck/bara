import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacter l'équipe BARA Abidjan — Support & Partenariats",
  description: "Une question, une demande de badge vérifié ou un partenariat à Abidjan ? Contactez l'équipe BARA par message ou WhatsApp.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
