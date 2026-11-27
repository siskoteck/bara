"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { METIERS, COMMUNES } from "@/lib/constantes";
import { ArtisansRecommandes } from "@/components/ArtisansRecommandes";
import { BannierePub } from "@/components/BannierePub";

const CATEGORIES_POPULAIRES = [
  { nom: "Plombier", icone: "🚰", desc: "Fuites, robinetterie, sanitaires" },
  { nom: "Électricien", icone: "⚡", desc: "Pannes, tableaux, éclairage" },
  { nom: "Climatisation / Froid", icone: "❄️", desc: "Entretien split, gaz, frigo" },
  { nom: "Menuisier", icone: "🪚", desc: "Portes, placards, meubles" },
  { nom: "Maçon", icone: "🧱", desc: "Construction, rénovation, dalles" },
  { nom: "Peintre", icone: "🎨", desc: "Intérieur, façade, décoration" },
  { nom: "Carreleur", icone: "📐", desc: "Pose sol, mur, salle de bain" },
  { nom: "Mécanicien", icone: "🔧", desc: "Diagnostic, entretien auto" },
];

const COMMUNES_RAPIDES = [
  "Treichville",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Koumassi",
  "Abobo",
  "Port-Bouët",
  "Bingerville",
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
    <div className="bg-gray-50/50">
      {/* Hero & Barre de recherche rapide */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-600 to-amber-600 text-white pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="animate-bara-fade-up max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-extrabold px-3.5 py-1 rounded-full mb-4">
            🇨🇮 DISPONIBLE DANS LES 13 COMMUNES D&apos;ABIDJAN
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight tracking-tight">
            Trouvez un artisan de confiance à Abidjan
          </h1>
          <p className="text-orange-50 text-base sm:text-xl mb-8 max-w-2xl mx-auto">
            Plombiers, électriciens, maçons, menuisiers ou frigoristes près de
            chez vous. Contact direct et gratuit sur WhatsApp.
          </p>

          {/* Barre de recherche */}
          <form
            onSubmit={lancerRecherche}
            className="bg-white p-3 rounded-2xl shadow-xl transition-all duration-300 focus-within:ring-4 focus-within:ring-amber-300/50 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 text-gray-800"
          >
            <select
              aria-label="Choisir un métier"
              value={metierChoisi}
              onChange={(e) => setMetierChoisi(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="">Quel métier recherchez-vous ?</option>
              {METIERS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              aria-label="Choisir une commune"
              value={communeChoisie}
              onChange={(e) => setCommuneChoisie(e.target.value)}
              className="sm:w-52 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-orange-500 font-medium"
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
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-3 rounded-xl transition shrink-0 shadow-xs"
            >
              🔍 Rechercher
            </button>
          </form>

          {/* Actions rapides & confiance */}
          <div className="mt-6 hidden sm:flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <Link
              href="/demande"
              className="bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold px-4 py-2 rounded-full transition"
            >
              📋 Poster un besoin gratuitement
            </Link>
            <Link
              href="/sos-urgence"
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-full shadow-xs transition"
            >
              🚨 Dépannage urgent 24/7
            </Link>
          </div>
        </div>
      </section>

      {/* Pilules d'accès rapide par communes d'Abidjan */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-extrabold text-gray-500 shrink-0">
            📍 Communes :
          </span>
          <Link
            href="/artisans"
            className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-600 text-white shadow-xs shrink-0"
          >
            Tout Abidjan
          </Link>
          {COMMUNES_RAPIDES.map((c) => (
            <Link
              key={c}
              href={`/artisans?commune=${encodeURIComponent(c)}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white hover:scale-105 active:scale-95 border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-600 shrink-0 transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Métiers populaires à Abidjan
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Sélectionnez une spécialité pour voir les artisans disponibles
            </p>
          </div>
          <Link
            href="/artisans"
            className="text-xs sm:text-sm text-orange-600 font-extrabold hover:underline shrink-0"
          >
            Tout l&apos;annuaire →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_POPULAIRES.map((cat) => (
            <Link
              key={cat.nom}
              href={`/artisans?metier=${encodeURIComponent(cat.nom)}`}
              className="group bg-white border border-gray-200 hover:border-orange-400 rounded-2xl p-5 text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center gap-1.5"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {cat.icone}
              </span>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                {cat.nom}
              </span>
              <span className="text-[11px] text-gray-500 line-clamp-1">
                {cat.desc}
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
        <div className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
              Espace Professionnel Abidjan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-2">
              Vous êtes artisan à Abidjan ?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl">
              Créez votre fiche professionnelle gratuitement, montrez vos
              réalisations et recevez des clients directement sur WhatsApp.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-8 py-4 rounded-2xl transition shrink-0 shadow-sm"
          >
            🛠️ Créer mon profil artisan
          </Link>
        </div>
      </section>
    </div>
  );
}