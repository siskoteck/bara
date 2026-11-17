"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { METIERS, COMMUNES, QUARTIERS_PAR_COMMUNE } from "@/lib/constantes";
import { genererLienWhatsApp } from "@/lib/whatsapp";
import { BannierePub } from "@/components/BannierePub";

interface Artisan {
  id: string;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  disponible?: boolean | null;
  note?: number | null;
  avis?: number | null;
  telephone: string | null;
  description: string | null;
  avatar_url?: string | null;
  verifie?: boolean | null;
}

function AnnuaireArtisansContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [metierFiltre, setMetierFiltre] = useState(
    searchParams.get("metier") || ""
  );
  const [communeFiltre, setCommuneFiltre] = useState(
    searchParams.get("commune") || ""
  );
  const [quartierFiltre, setQuartierFiltre] = useState(
    searchParams.get("quartier") || ""
  );
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMetierFiltre(searchParams.get("metier") || "");
    setCommuneFiltre(searchParams.get("commune") || "");
    setQuartierFiltre(searchParams.get("quartier") || "");
  }, [searchParams]);

  const quartiersDisponibles = communeFiltre
    ? QUARTIERS_PAR_COMMUNE[communeFiltre] || []
    : [];

  useEffect(() => {
    async function chargerArtisans() {
      setLoading(true);
      let query = supabase
        .from("artisans")
        .select("*")
        .order("verifie", { ascending: false });

      if (metierFiltre) {
        query = query.eq("metier", metierFiltre);
      }
      if (communeFiltre) {
        query = query.eq("commune", communeFiltre);
      }
      if (quartierFiltre.trim()) {
        query = query.ilike("quartier", `%${quartierFiltre.trim()}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setArtisans(data);
      }
      setLoading(false);
    }

    chargerArtisans();
  }, [metierFiltre, communeFiltre, quartierFiltre]);

  function appliquerFiltres(
    nouveauMetier: string,
    nouvelleCommune: string,
    nouveauQuartier: string
  ) {
    setMetierFiltre(nouveauMetier);
    setCommuneFiltre(nouvelleCommune);
    setQuartierFiltre(nouveauQuartier);

    const params = new URLSearchParams();
    if (nouveauMetier) params.set("metier", nouveauMetier);
    if (nouvelleCommune) params.set("commune", nouvelleCommune);
    if (nouveauQuartier.trim()) params.set("quartier", nouveauQuartier.trim());

    const queryString = params.toString();
    router.replace(queryString ? `/artisans?${queryString}` : "/artisans");
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Trouver un artisan à Abidjan
        </h1>
        <p className="text-gray-600 mt-1">
          Filtrez par métier, commune et sous-quartier pour contacter directement un professionnel.
        </p>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="filtre-metier"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Métier
          </label>
          <select
            id="filtre-metier"
            value={metierFiltre}
            onChange={(e) =>
              appliquerFiltres(e.target.value, communeFiltre, quartierFiltre)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-800 text-sm"
          >
            <option value="">Tous les métiers</option>
            {METIERS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filtre-commune"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Commune
          </label>
          <select
            id="filtre-commune"
            value={communeFiltre}
            onChange={(e) =>
              appliquerFiltres(metierFiltre, e.target.value, "")
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-800 text-sm"
          >
            <option value="">Toutes les communes</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filtre-quartier"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Sous-quartier
          </label>
          <input
            id="filtre-quartier"
            type="text"
            list="liste-quartiers-annuaire"
            value={quartierFiltre}
            onChange={(e) =>
              appliquerFiltres(metierFiltre, communeFiltre, e.target.value)
            }
            placeholder={
              quartiersDisponibles.length > 0
                ? `Ex: ${quartiersDisponibles[0]}...`
                : "Ex: Angré, Zone 4, Niangon..."
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
          />
          <datalist id="liste-quartiers-annuaire">
            {quartiersDisponibles.map((q) => (
              <option key={q} value={q} />
            ))}
          </datalist>
        </div>
      </div>

      {(metierFiltre || communeFiltre || quartierFiltre) && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => appliquerFiltres("", "", "")}
            className="px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-xl border border-orange-200 transition"
          >
            ✕ Réinitialiser tous les filtres
          </button>
        </div>
      )}

      {/* Bannière Publicitaire */}
      <BannierePub emplacement="annuaire" />

      {/* Résultats */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Recherche des artisans en cours...
        </div>
      ) : artisans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Aucun artisan trouvé pour ces critères
          </p>
          <p className="text-gray-600 mb-6">
            Essayez d&apos;élargir votre recherche ou postez directement votre besoin.
          </p>
          <Link
            href="/demande"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
          >
            Poster une demande gratuitement
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisans.map((artisan) => {
            const initiales = artisan.name
              ? artisan.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "A";

            return (
              <div
                key={artisan.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {artisan.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={artisan.avatar_url}
                        alt={artisan.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-lg font-bold border border-orange-200 shrink-0">
                        {initiales}
                      </div>
                    )}

                    <div>
                      <h2 className="font-bold text-lg text-gray-900">
                        {artisan.name}
                      </h2>
                      <p className="text-orange-600 font-medium text-sm">
                        {artisan.metier}
                      </p>
                      {artisan.commune && (
                        <p className="text-gray-500 text-xs mt-0.5">
                          📍 {artisan.commune}
                          {artisan.quartier ? ` (${artisan.quartier})` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges : Note, Vérifié, Disponibilité */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {artisan.note ? (
                      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        ★ {artisan.note} ({artisan.avis ?? 0})
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">
                        Nouveau
                      </span>
                    )}

                    {artisan.verifie && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        ✓ Vérifié
                      </span>
                    )}

                    {artisan.disponible !== false && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        🟢 Disponible
                      </span>
                    )}
                  </div>

                  {artisan.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {artisan.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/artisans/${artisan.id}`}
                    className="flex-1 text-center py-2.5 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Voir le profil
                  </Link>
                  {artisan.telephone && (
                    <a
                      href={genererLienWhatsApp(
                        artisan.telephone,
                        artisan.name,
                        artisan.metier,
                        artisan.commune
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 px-3 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ArtisansPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-500">
          Chargement de l&apos;annuaire...
        </div>
      }
    >
      <AnnuaireArtisansContent />
    </Suspense>
  );
}
