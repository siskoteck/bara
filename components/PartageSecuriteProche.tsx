"use client";

import { useState } from "react";

interface PartageSecuriteProps {
  id: string | number;
  nom: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  verifie?: boolean | null;
  estConnecte?: boolean;
}

export function PartageSecuriteProche({
  id,
  nom,
  metier,
  commune,
  quartier,
  telephone,
  verifie,
  estConnecte = false,
}: PartageSecuriteProps) {
  const [copie, setCopie] = useState(false);

  const origine =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://vercel.app";
  const urlFiche = `${origine}/artisans/${id}`;

  const localisation = [commune || "Abidjan", quartier]
    .filter(Boolean)
    .join(" - ");

  const statutVerification = verifie
    ? "✅ Profil vérifié par BARA Abidjan"
    : "⏳ Profil inscrit sur BARA Abidjan";

  const messageSecurite = [
    "🛡️ *INFO SÉCURITÉ - INTERVENTION À DOMICILE (BARA)*",
    "",
    "Je fais intervenir cet artisan chez moi aujourd'hui :",
    `• *Nom :* ${nom}`,
    `• *Métier :* ${metier}`,
    `• *Zone :* ${localisation}`,
    estConnecte && telephone ? `• *Téléphone :* ${telephone}` : null,
    `• *Statut :* ${statutVerification}`,
    "",
    `Fiche complète et photos : ${urlFiche}`,
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");

  const lienWhatsApp = `https://wa.me{encodeURIComponent(messageSecurite)}`;

  function copierMessage() {
    navigator.clipboard.writeText(messageSecurite);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }

  return (
    <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🛡️</span>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-blue-950">
            Sécurité visite à domicile
          </h3>
          <p className="text-xs text-blue-800 mt-1 leading-relaxed">
            Vous recevez cet artisan chez vous ? Prévenez un proche ou un voisin
            en lui envoyant automatiquement sa fiche et son statut de vérification.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-3.5">
            <a
              href={lienWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <span>📲</span> Partager à un proche sur WhatsApp
            </a>

            <button
              type="button"
              onClick={copierMessage}
              className="bg-white hover:bg-blue-100/50 text-blue-900 border border-blue-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition"
            >
              {copie ? "✅ Infos copiées !" : "📋 Copier les infos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
