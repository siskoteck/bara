import Link from "next/link";
import { METIERS, COMMUNES } from "@/lib/constantes";

// Associe une icône à chaque métier exact de lib/constantes.ts
const ICONES_METIERS: Record<string, string> = {
  "Plombier": "🔧",
  "Électricien": "⚡",
  "Maçon": "🧱",
  "Peintre": "🎨",
  "Menuisier": "🪚",
  "Carreleur": "🔲",
  "Soudeur / Ferronnier": "🔥",
  "Charpentier / Couvreur": "🏠",
  "Plaquiste": "📐",
  "Vitrier / Aluminium": "🪟",
  "Climatisation / Froid": "❄️",
  "Réparateur électroménager": "🧺",
  "Mécanicien auto": "🚗",
  "Technicien informatique": "💻",
  "Jardinier / Paysagiste": "🌿",
  "Nettoyage / Ménage": "🧹",
  "Déménageur": "🚚",
  "Couturier / Tailleur": "🧵",
  "Coiffeur / Coiffeuse": "✂️",
  "Autre": "🛠️",
};

// On affiche les 12 premiers métiers de lib/constantes.ts (sans "Autre")
const CATEGORIES_ACCUEIL = METIERS.filter((m) => m !== "Autre").slice(0, 12);

export default function HomePage() {
  return (
    <div>
      {/* Hero Section avec barre de recherche rapide */}
      <section className="bg-orange-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trouvez un artisan de confiance à Abidjan
          </h1>
          <p className="text-xl mb-10 text-orange-100">
            Plombiers, électriciens, maçons, peintres… Trouvez le bon professionnel rapidement.
          </p>

          {/* Barre de recherche rapide : Métier + Commune */}
          <form
            action="/artisans"
            method="GET"
            className="bg-white p-3 rounded-2xl shadow-lg max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 text-gray-800"
          >
            <div className="flex-1">
              <label htmlFor="search-metier" className="sr-only">
                Métier recherché
              </label>
              <select
                id="search-metier"
                name="metier"
                defaultValue=""
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-800"
              >
                <option value="">Tous les métiers</option>
                {METIERS.map((metier) => (
                  <option key={metier} value={metier}>
                    {metier}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="search-commune" className="sr-only">
                Commune à Abidjan
              </label>
              <select
                id="search-commune"
                name="commune"
                defaultValue=""
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-800"
              >
                <option value="">Toutes les communes</option>
                {COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="h-12 px-8 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition shrink-0"
            >
              Rechercher
            </button>
          </form>

          {/* Lien secondaire vers le dépôt de demande */}
          <div className="mt-6 text-sm text-orange-100">
            Vous préférez recevoir des devis ?{" "}
            <Link
              href="/demande"
              className="underline font-semibold text-white hover:text-orange-50"
            >
              Poster une demande gratuitement →
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Catégories populaires</h2>
          <Link
            href="/artisans"
            className="text-orange-600 font-medium hover:underline text-sm"
          >
            Voir tous les métiers →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES_ACCUEIL.map((metier) => (
            <Link
              key={metier}
              href={`/artisans?metier=${encodeURIComponent(metier)}`}
              className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-orange-500 hover:shadow-md transition text-center group"
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {ICONES_METIERS[metier] || "🛠️"}
              </span>
              <span className="font-medium text-gray-800 group-hover:text-orange-600">
                {metier}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Décrivez votre besoin</h3>
              <p className="text-gray-600">
                Expliquez ce dont vous avez besoin et votre quartier à Abidjan.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Recevez des propositions</h3>
              <p className="text-gray-600">
                Des artisans qualifiés vous contactent rapidement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Choisissez et notez</h3>
              <p className="text-gray-600">
                Sélectionnez l’artisan et laissez un avis après le travail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes artisan ?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Rejoignez BARA et développez votre activité à Abidjan.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50"
          >
            Créer mon profil artisan
          </Link>
        </div>
      </section>
    </div>
  );
}
