"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { METIERS, COMMUNES } from "@/lib/constantes";
import {
  GrilleArtisansSkeleton,
  FallbackErreurBara,
} from "@/components/shared/BaraSkeletons";

interface Artisan {
  id: string;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  description: string | null;
  avatar_url: string | null;
  verifie: boolean | null;
  disponible: boolean | null;
  derniere_activite?: string | null;
  recommandations?: number;
}

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
  function genererLienWhatsApp(tel: string | null, nomArtisan: string) {
    let chiffres = (tel || "").replace(/\D/g, "");
    if (chiffres.length === 10 && chiffres.startsWith("0")) {
      chiffres = "225" + chiffres;
    } else if (chiffres.startsWith("00225")) {
      chiffres = chiffres.slice(2);
    }
    const texte = encodeURIComponent(
      "Bonjour " +
        nomArtisan +
        ", j'ai vu votre profil sur BARA Abidjan et j'aimerais vous contacter pour un travail."
    );
    return "https://wa.me" + chiffres + "?text=" + texte;
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Annuaire des artisans à Abidjan
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {loading
            ? "Recherche des professionnels disponibles près de chez vous..."
            : `${artisansFiltres.length} artisan(s) trouvé(s) près de chez vous.`}
        </p>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un nom, un quartier (Angré, Zone 4...)"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
          />

          <select
            value={filtreMetier}
            onChange={(e) => setFiltreMetier(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            <option value="Tous">Tous les métiers</option>
            {METIERS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={filtreCommune}
            onChange={(e) => setFiltreCommune(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            <option value="Toutes">Toutes les communes</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={uniquementDisponibles}
              onChange={(e) => setUniquementDisponibles(e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span>🟢 Afficher uniquement les artisans disponibles immédiatement</span>
          </label>

          {(filtreMetier !== "Tous" ||
            filtreCommune !== "Toutes" ||
            recherche ||
            uniquementDisponibles) && (
            <button
              type="button"
              onClick={() => {
                setFiltreMetier("Tous");
                setFiltreCommune("Toutes");
                setRecherche("");
                setUniquementDisponibles(false);
              }}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <GrilleArtisansSkeleton count={6} />
      ) : erreurChargement ? (
        <FallbackErreurBara
          titre="Impossible de charger l'annuaire des artisans"
          onReessayer={chargerDonnees}
        />
      ) : artisansFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-700 font-semibold mb-2">
            Aucun artisan ne correspond à cette recherche.
          </p>
          <p className="text-xs text-gray-500 mb-5">
            Essayez d&apos;élargir votre recherche à toute la ville d&apos;Abidjan ou postez votre besoin.
          </p>
          <Link
            href="/demande"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            + Poster une demande gratuite
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisansFiltres.map((artisan) => {
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
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:border-orange-300 transition"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    {artisan.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={artisan.avatar_url}
                        alt={artisan.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-orange-100 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-lg font-extrabold shrink-0">
                        {initiales}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {artisan.verifie && (
                          <span className="bg-green-100 text-green-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            ✓ Vérifié
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            artisan.disponible !== false
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {artisan.disponible !== false
                            ? "🟢 Disponible"
                            : "🟠 Occupé"}
                        </span>
                      </div>

                      <h2 className="font-bold text-gray-900 text-base truncate">
                        {artisan.name}
                      </h2>
                      <p className="text-orange-600 font-semibold text-xs">
                        {artisan.metier}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-2">
                    📍 {artisan.commune || "Abidjan"}
                    {artisan.quartier ? ` (${artisan.quartier})` : ""}
                  </p>

                  {typeof artisan.recommandations === "number" &&
                    artisan.recommandations > 0 && (
                      <p className="text-xs text-orange-700 font-semibold mb-2">
                        👍 Recommandé par {artisan.recommandations} habitant(s)
                      </p>
                    )}

                  {artisan.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {artisan.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/artisans/${artisan.id}`}
                    className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    Voir le profil
                  </Link>

                  {utilisateurConnecte ? (
                    artisan.telephone && (
                      <a
                        href={genererLienWhatsApp(
                          artisan.telephone,
                          artisan.name
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition shrink-0"
                      >
                        💬 WhatsApp
                      </a>
                    )
                  ) : (
                    <Link
                      href="/auth/login"
                      title="Connectez-vous pour contacter cet artisan"
                      className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold px-3 py-2.5 rounded-xl transition shrink-0"
                    >
                      🔒 Contact
                    </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <GrilleArtisansSkeleton count={6} />
        </div>
      }
    >
      <ListeArtisansContenu />
    </Suspense>
  );
}
