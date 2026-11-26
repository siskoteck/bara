"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { COMMUNES } from "@/lib/constantes";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import { GrilleArtisansSkeleton } from "@/components/shared/BaraSkeletons";
import type { Artisan } from "@/lib/types";

const METIERS_URGENCE = [
  "Tous",
  "Plombier",
  "Électricien",
  "Climatisation / Froid",
  "Serrurier",
  "Mécanicien Auto",
];

export default function SosUrgencePage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [commune, setCommune] = useState("Toutes");
  const [metier, setMetier] = useState("Tous");

  useEffect(() => {
    async function chargerUrgences() {
      const { data } = await supabase
        .from("artisans")
        .select("*")
        .neq("disponible", false)
        .order("verifie", { ascending: false })
        .order("created_at", { ascending: false });

      if (data) {
        setArtisans(data as Artisan[]);
      }
      setLoading(false);
    }

    chargerUrgences();
  }, []);

  const artisansUrgence = artisans.filter((a) => {
    const matchCommune =
      commune === "Toutes" ||
      (a.commune || "").toLowerCase() === commune.toLowerCase();
    const matchMetier =
      metier === "Tous" ||
      (a.metier || "").toLowerCase().includes(metier.toLowerCase());
    return matchCommune && matchMetier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <span className="inline-block bg-white/20 text-xs font-extrabold px-3 py-1 rounded-full mb-2">
          🚨 DÉPANNAGE RAPIDE À ABIDJAN
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          SOS Urgence Artisan — Intervention immédiate
        </h1>
        <p className="text-red-100 text-xs sm:text-sm mt-2 max-w-2xl">
          Fuite d&apos;eau, coupure électrique, panne de climatisation ou porte
          bloquée : contactez directement un artisan disponible près de chez vous
          sur WhatsApp.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 max-w-2xl">
          <select
            aria-label="Choisir la commune d'intervention"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            className="bg-white text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold"
          >
            <option value="Toutes">📍 Toutes les communes d&apos;Abidjan</option>
            {COMMUNES.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Type de dépannage urgent"
            value={metier}
            onChange={(e) => setMetier(e.target.value)}
            className="bg-white text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold"
          >
            {METIERS_URGENCE.map((m) => (
              <option key={m} value={m}>
                {m === "Tous" ? "🛠️ Tous les dépannages urgents" : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <GrilleArtisansSkeleton />
      ) : artisansUrgence.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
          <p className="text-lg font-extrabold text-gray-900 mb-2">
            Aucun artisan disponible trouvé pour ce filtre précis
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Élargissez à toutes les communes d&apos;Abidjan ou publiez une
            demande urgente.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCommune("Toutes");
                setMetier("Tous");
              }}
              className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl"
            >
              Afficher tout Abidjan
            </button>
            <Link
              href="/demande"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl"
            >
              Poster une demande urgente
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisansUrgence.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} urgence />
          ))}
        </div>
      )}
    </div>
  );
}