"use client";

import { useState } from "react";
import Link from "next/link";
import { CONSEILS_ABIDJAN, ArticleConseil } from "@/lib/conseilsAbidjan";

export default function ConseilsPage() {
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [articleOuvert, setArticleOuvert] = useState<ArticleConseil | null>(
    null
  );

  const categories = [
    "Tous",
    ...Array.from(new Set(CONSEILS_ABIDJAN.map((c) => c.categorie))),
  ];

  const articlesFiltres =
    categorieActive === "Tous"
      ? CONSEILS_ABIDJAN
      : CONSEILS_ABIDJAN.filter((c) => c.categorie === categorieActive);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          Guides Pratiques • Abidjan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Conseils & Prévention pour votre maison
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Astuces d&apos;entretien adaptées au climat d&apos;Abidjan pour éviter
          les pannes coûteuses et prolonger la durée de vie de vos équipements.
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategorieActive(cat);
              setArticleOuvert(null);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
              categorieActive === cat
                ? "bg-orange-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Vue détaillée d'un guide sélectionné */}
      {articleOuvert ? (
        <article className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
          <button
            type="button"
            onClick={() => setArticleOuvert(null)}
            className="text-sm font-semibold text-orange-600 hover:underline"
          >
            ← Retour à tous les conseils
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl">{articleOuvert.icone}</span>
            <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {articleOuvert.categorie}
            </span>
            <span className="text-xs text-gray-400">
              • Lecture : {articleOuvert.tempsLecture}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {articleOuvert.titre}
          </h2>

          <p className="text-gray-600 text-base leading-relaxed border-b border-gray-100 pb-6">
            {articleOuvert.resume}
          </p>

          <div className="space-y-6">
            {articleOuvert.sections.map((sec) => (
              <div key={sec.sousTitre}>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {sec.sousTitre}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {sec.contenu}
                </p>
              </div>
            ))}
          </div>

          {/* Astuce Pro */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-amber-900 uppercase mb-1">
              💡 Le conseil de l&apos;artisan BARA
            </p>
            <p className="text-sm text-amber-950">{articleOuvert.astucePro}</p>
          </div>

          {/* Appel à l'action vers le métier concerné */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-base">
                Besoin d&apos;un {articleOuvert.metierLie} vérifié à Abidjan ?
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Comparez les profils près de chez vous ou postez votre demande gratuitement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href={`/artisans?metier=${encodeURIComponent(
                  articleOuvert.metierLie
                )}`}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Voir les {articleOuvert.metierLie}s
              </Link>
              <Link
                href="/demande"
                className="bg-white text-gray-900 hover:bg-gray-100 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Poster un besoin
              </Link>
            </div>
          </div>
        </article>
      ) : (
        /* Grille des articles */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articlesFiltres.map((article) => (
            <div
              key={article.slug}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:border-orange-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                    <span>{article.icone}</span> {article.categorie}
                  </span>
                  <span className="text-xs text-gray-400">
                    {article.tempsLecture}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {article.titre}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {article.resume}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setArticleOuvert(article);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-sm font-bold text-orange-600 hover:underline"
                >
                  Lire le guide complet →
                </button>

                <Link
                  href={`/artisans?metier=${encodeURIComponent(
                    article.metierLie
                  )}`}
                  className="text-xs font-medium text-gray-500 hover:text-gray-800"
                >
                  Trouver un {article.metierLie}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
