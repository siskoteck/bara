"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { METIERS, COMMUNES } from "@/lib/constantes";
import { ArtisansRecommandes } from "@/components/ArtisansRecommandes";
import { BannierePub } from "@/components/BannierePub";

const CATEGORIES_POPULAIRES = [
  { nom: "Plombier", icone: "🚰" },
  { nom: "Électricien", icone: "⚡" },
  { nom: "Maçon", icone: "🧱" },
  { nom: "Peintre", icone: "🎨" },
  { nom: "Menuisier", icone: "🪚" },
  { nom: "Carreleur", icone: "📐" },
  { nom: "Climatisation / Froid", icone: "❄️" },
  { nom: "Mécanicien", icone: "🔧" },
];

export default function HomePage() {
  const router = useRouter();
  const [metierChoisi, setMetierChoisi] = useState("");
  const [communeChoisie, setCommuneChoisie] = useState("");

  function lancerRecherche(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (metierChoisi) params.set("metier", metierChoisi);
    if (communeChoisie) params.set("commune", communeChoisie);

    const query = params.toString();
    router.push(query ? `/artisans?${query}` : "/artisans");
  }

  return (
    <div>
      {/* Hero & Barre de recherche rapide */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Disponible dans les 13 communes d&apos;Abidjan
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Trouvez un artisan de confiance à Abidjan
          </h1>
          <p className="text-orange-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Plombiers, électriciens, maçons, menuisiers ou frigoristes près de
            chez vous. Contact direct et gratuit sur WhatsApp.
          </p>

          {/* Barre de recherche */}
          <form
            onSubmit={lancerRecherche}
            className="bg-white p-3 rounded-2xl shadow-lg max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 text-gray-800"
          >
            <select
              value={metierChoisi}
              onChange={(e) => setMetierChoisi(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Quel métier recherchez-vous ?</option>
              {METIERS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={communeChoisie}
              onChange={(e) => setCommuneChoisie(e.target.value)}
              className="sm:w-52 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-orange-500"
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
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition shrink-0"
            >
              Rechercher
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/demande"
              className="underline text-orange-100 hover:text-white font-medium"
            >
              Ou postez votre besoin gratuitement →
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Métiers populaires à Abidjan
          </h2>
          <Link
            href="/artisans"
            className="text-sm text-orange-600 font-medium hover:underline"
          >
            Tout l&apos;annuaire →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_POPULAIRES.map((cat) => (
            <Link
              key={cat.nom}
              href={`/artisans?metier=${encodeURIComponent(cat.nom)}`}
              className="bg-white border border-gray-200 hover:border-orange-400 rounded-2xl p-5 text-center shadow-sm hover:shadow transition flex flex-col items-center gap-2"
            >
              <span className="text-3xl">{cat.icone}</span>
              <span className="font-semibold text-sm text-gray-800">
                {cat.nom}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bannière Publicitaire Partenaire */}
      <BannierePub emplacement="accueil" />

      {/* Artisans Recommandés */}
      <ArtisansRecommandes />

      {/* Bandeau d'inscription artisan */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Vous êtes artisan à Abidjan ?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl">
              Créez votre fiche professionnelle gratuitement, montrez vos
              réalisations et recevez des clients directement sur WhatsApp.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl transition shrink-0"
          >
            Créer mon profil artisan
          </Link>
        </div>
      </section>
    </div>
  );
}
