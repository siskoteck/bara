import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOS Urgence Artisan Abidjan 24/7 — Dépannage rapide | BARA",
  description: "Fuite d'eau, coupure électrique, panne de clim ou serrure bloquée à Abidjan : contactez immédiatement un artisan disponible sur WhatsApp.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
