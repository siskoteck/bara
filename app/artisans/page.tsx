"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { METIERS, COMMUNES } from "@/lib/constantes";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import {
  GrilleArtisansSkeleton,
  FallbackErreurBara,
} from "@/components/shared/BaraSkeletons";
import type { Artisan } from "@/lib/types";

function ListeArtisansContenu() {
  const searchParams = useSearchParams();

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreurChargement, setErreurChargement] = useState(false);

  const [filtreMetier, setFiltreMetier] = useState(
    searchParams.get("metier") || "Tous"
  );
  const [filtreCommune, setFiltreCommune] = useState(
    searchParams.get("commune") || "Toutes"
  );
  const [recherche, setRecherche] = useState("");
  const [uniquementDisponibles, setUniquementDisponibles] = useState(false);

  const chargerDonnees = useCallback(async () => {
    setLoading(true);
    setErreurChargement(false);

    const [resSession, resArtisans] = await Promise.all([
      supabase.auth.getSession(),
      supabase
        .from("artisans")
        .select("*")
        .order("verifie", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

    setUtilisateurConnecte(Boolean(resSession.data.session?.user));

    if (resArtisans.error) {
      setErreurChargement(true);
    } else if (resArtisans.data) {
      setArtisans(resArtisans.data as Artisan[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  const artisansFiltres = artisans.filter((a) => {
    const matchMetier =
      filtreMetier === "Tous" ||
      (a.metier || "").toLowerCase() === filtreMetier.toLowerCase();

    const matchCommune =
      filtreCommune === "Toutes" ||
      (a.commune || "").toLowerCase() === filtreCommune.toLowerCase();

    const matchDispo = !uniquementDisponibles || a.disponible !== false;

    const terme = recherche.trim().toLowerCase();
    const matchRecherche =
      !terme ||
      (a.name || "").toLowerCase().includes(terme) ||
      (a.metier || "").toLowerCase().includes(terme) ||
      (a.quartier || "").toLowerCase().includes(terme) ||
      (a.description || "").toLowerCase().includes(terme);

    return matchMetier && matchCommune && matchDispo && matchRecherche;
  });

  function reinitialiserFiltres() {
    setFiltreMetier("Tous");
    setFiltreCommune("Toutes");
    setRecherche("");
    setUniquementDisponibles(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Annuaire des artisans à Abidjan
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {loading
              ? "Recherche des professionnels disponibles près de chez vous..."
              : `${artisansFiltres.length} artisan(s) trouvé(s) près de chez vous.`}
          </p>
        </div>

        {!utilisateurConnecte && (
          <Link
            href="/auth/register"
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            + Inscrire mon activité
          </Link>
        )}
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="🔍 Nom, quartier (Zone 3, Riviera, Yopougon)..."
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
          />

          <select
            aria-label="Filtrer par métier"
            value={filtreMetier}
            onChange={(e) => setFiltreMetier(e.target.value)}
            className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-orange-500"
          >
            <option value="Tous">Tous les métiers</option>
            {METIERS.map((m: string) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrer par commune"
            value={filtreCommune}
            onChange={(e) => setFiltreCommune(e.target.value)}
            className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-orange-500"
          >
            <option value="Toutes">Toutes les communes d&apos;Abidjan</option>
            {COMMUNES.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={uniquementDisponibles}
              onChange={(e) => setUniquementDisponibles(e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span>🟢 Afficher uniquement les artisans disponibles maintenant</span>
          </label>

          {(filtreMetier !== "Tous" ||
            filtreCommune !== "Toutes" ||
            recherche !== "" ||
            uniquementDisponibles) && (
            <button
              type="button"
              onClick={reinitialiserFiltres}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              ✕ Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <GrilleArtisansSkeleton />
      ) : erreurChargement ? (
        <FallbackErreurBara onReessayer={chargerDonnees} />
      ) : artisansFiltres.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
          <p className="text-lg font-extrabold text-gray-900 mb-2">
            Aucun artisan ne correspond à ces critères
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Essayez d&apos;élargir votre recherche à toute la ville d&apos;Abidjan ou
            publiez gratuitement votre demande de travail.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reinitialiserFiltres}
              className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
            >
              Voir tous les artisans
            </button>
            <Link
              href="/demande"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
            >
              📋 Poster une demande gratuite
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisansFiltres.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArtisansPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <GrilleArtisansSkeleton />
        </div>
      }
    >
      <ListeArtisansContenu />
    </Suspense>
  );
}