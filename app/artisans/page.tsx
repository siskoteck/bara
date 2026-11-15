import { Suspense } from "react";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";

const METIERS = ["Plombier", "Électricien", "Maçon", "Peintre", "Autre"];
const COMMUNES = [
  "Cocody",
  "Yopougon",
  "Abobo",
  "Marcory",
  "Plateau",
  "Koumassi",
];

type Props = {
  searchParams: Promise<{ metier?: string; commune?: string }>;
};

export default function ArtisansPage({ searchParams }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artisans à Abidjan</h1>
          <p className="text-gray-600 mt-1">
            Trouvez un professionnel de confiance près de chez vous
          </p>
        </div>

        <Link
          href="/demande"
          className="mt-4 md:mt-0 bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-700"
        >
          Poster une demande
        </Link>
      </div>

      <Suspense
        fallback={<p className="text-gray-500">Chargement des artisans…</p>}
      >
        <ListeArtisans searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ListeArtisans({ searchParams }: Props) {
  const { metier, commune } = await searchParams;
  const supabase = createSupabaseClient();

  let requete = supabase
    .from("artisans")
    .select("id, name, metier, commune, photo_url, verifie, note, avis")
    .order("note", { ascending: false, nullsFirst: false });

  if (metier) requete = requete.eq("metier", metier);
  if (commune) requete = requete.eq("commune", commune);

  const { data: artisans, error } = await requete;

  if (error) {
    console.error("Erreur Supabase:", error);
  }

  return (
    <>
      {/* Filtres */}
      <form
        action="/artisans"
        method="get"
        className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-wrap gap-3"
      >
        <select
          name="metier"
          defaultValue={metier ?? ""}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Tous les métiers</option>
          {METIERS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          name="commune"
          defaultValue={commune ?? ""}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Toutes les communes</option>
          {COMMUNES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
        >
          Filtrer
        </button>

        {(metier || commune) && (
          <Link
            href="/artisans"
            className="px-3 py-2 text-sm text-gray-600 hover:underline"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-6">
          Impossible de charger les artisans pour le moment.
        </p>
      )}

      {!error && (!artisans || artisans.length === 0) && (
        <p className="text-gray-600">Aucun artisan trouvé pour ces critères.</p>
      )}

      {/* Liste des artisans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans?.map((artisan) => (
          <Link
            key={artisan.id}
            href={`/artisans/${artisan.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {artisan.name}
                  {artisan.verifie && (
                    <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓ Vérifié
                    </span>
                  )}
                </h3>
                {artisan.metier && (
                  <p className="text-orange-600 font-medium">{artisan.metier}</p>
                )}
                {artisan.commune && (
                  <p className="text-sm text-gray-500 mt-1">{artisan.commune}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                {artisan.note ? (
                  <>
                    <div className="text-yellow-500 font-semibold">
                      ★ {artisan.note}
                    </div>
                    <div className="text-xs text-gray-500">
                      {artisan.avis ?? 0} avis
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">Nouveau</div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-orange-600 font-medium">
                Voir le profil →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}