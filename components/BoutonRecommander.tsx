"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BoutonRecommanderProps {
  artisanId: string | number;
  commune: string | null;
  compteurInitial: number;
}

export function BoutonRecommander({
  artisanId,
  commune,
  compteurInitial,
}: BoutonRecommanderProps) {
  const [compteur, setCompteur] = useState<number>(compteurInitial || 0);
  const [dejaRecommande, setDejaRecommande] = useState(false);
  const [enCours, setEnCours] = useState(false);

  const cleStockage = `bara_reco_${artisanId}`;

  useEffect(() => {
    setCompteur(compteurInitial || 0);
    if (typeof window !== "undefined") {
      const dejaFait = localStorage.getItem(cleStockage);
      if (dejaFait === "true") {
        setDejaRecommande(true);
      }
    }
  }, [artisanId, compteurInitial, cleStockage]);

  async function handleRecommander() {
    if (dejaRecommande || enCours) return;

    setEnCours(true);
    try {
      const { data, error } = await supabase.rpc("recommander_artisan", {
        artisan_uuid: artisanId,
      });

      if (error) throw error;

      const nouveauTotal = typeof data === "number" ? data : compteur + 1;
      setCompteur(nouveauTotal);
      setDejaRecommande(true);

      if (typeof window !== "undefined") {
        localStorage.setItem(cleStockage, "true");
      }
    } catch (err) {
      console.error("Erreur recommandation:", err);
      alert("Impossible d'enregistrer votre recommandation pour le moment.");
    } finally {
      setEnCours(false);
    }
  }

  const zoneAffichee = commune || "Abidjan";

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
      <button
        type="button"
        onClick={handleRecommander}
        disabled={dejaRecommande || enCours}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
          dejaRecommande
            ? "bg-orange-50 border-orange-300 text-orange-700 cursor-default"
            : "bg-white hover:bg-orange-50 border-gray-300 text-gray-800 hover:border-orange-400"
        }`}
      >
        <span>{dejaRecommande ? "🧡" : "👍"}</span>
        <span>
          {dejaRecommande
            ? "Artisan recommandé"
            : "Je recommande cet artisan"}
        </span>
        <span className="bg-orange-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
          {compteur}
        </span>
      </button>

      {compteur > 0 && (
        <span className="text-xs text-gray-600 font-medium">
          Recommandé par{" "}
          <strong className="text-gray-900">
            {compteur} {compteur > 1 ? "habitants" : "habitant"}
          </strong>{" "}
          de {zoneAffichee}
        </span>
      )}
    </div>
  );
}
