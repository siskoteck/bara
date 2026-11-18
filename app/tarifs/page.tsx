"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDE_TARIFS_ABIDJAN } from "@/lib/tarifsAbidjan";

export default function TarifsPage() {
  const [recherche, setRecherche] = useState("");
  const [metierFiltre, setMetierFiltre] = useState("Tous");

  const listeMetiers = ["Tous", ...GUIDE_TARIFS_ABIDJAN.map((g) => g.metier)];

  const guidesFiltres = GUIDE_TARIFS_ABIDJAN.filter((guide) => {
    const correspondMetier =
      metierFiltre === "Tous" || guide.metier === metierFiltre;

    const terme = recherche.trim().toLowerCase();
    const correspondRecherche =
      !terme ||
      guide.metier.toLowerCase().includes(terme) ||
      guide.prestations.some((p) => p.prestation.toLowerCase().includes(terme));

    return correspondMetier && correspondRecherche;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          Transparence BARA Abidjan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Guide des tarifs indicatifs par métier
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Consultez les fourchettes de prix moyens constatés à Abidjan (en FCFA)
          pour préparer votre budget avant de contacter un artisan.
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une intervention (ex : fuite, climatiseur, peinture, serrure...)"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
        />

        <div className="flex flex-wrap gap-2">
          {listeMetiers.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetierFiltre(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                metierFiltre === m
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grilles tarifaires par métier */}
      {guidesFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
          Aucune prestation ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidesFiltres.map((guide) => (
            <div
              key={guide.metier}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{guide.icone}</span>
                    <h2 className="font-bold text-gray-900 text-lg">
                      {guide.metier}
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">
                    Déplacement : {guide.deplacementMoyen}
                  </span>
                </div>

                <div className="divide-y divide-gray-100 px-5">
                  {guide.prestations.map((item) => (
                    <div
                      key={item.prestation}
                      className="py-3.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.prestation}
                        </p>
                        <p className="text-[11px] text-gray-400">{item.unite}</p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg shrink-0">
                        {item.prixMin} – {item.prixMax} F
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/artisans?metier=${encodeURIComponent(guide.metier)}`}
                  className="text-xs font-semibold text-gray-700 hover:text-orange-600"
                >
                  Voir les artisans ({guide.metier}) →
                </Link>
                <Link
                  href="/demande"
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note légale & CTA */}
      <div className="mt-10 bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
        <p className="text-xs sm:text-sm text-orange-900 mb-4">
          <strong>Note importante :</strong> Ces tarifs sont fournis à titre
          indicatif (hors coût des pièces de rechange ou matériaux spécifiques) et
          peuvent varier selon la complexité du chantier ou l&apos;urgence.
        </p>
        <Link
          href="/demande"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition"
        >
          Poster ma demande gratuitement
        </Link>
      </div>
    </div>
  );
}
