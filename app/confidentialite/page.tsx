import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — BARA Abidjan",
  description:
    "Protection des données personnelles des utilisateurs et artisans sur BARA Abidjan conformément à la législation ivoirienne.",
};

export default function ConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-gray-800">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
          Protection des données
        </span>
        <h1 className="text-3xl font-black text-gray-900 mt-1">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Conforme à la loi n° 2013-450 relative à la protection des données à
          caractère personnel en Côte d&apos;Ivoire (ARTCI)
        </p>
      </div>

      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900">
          1. Données collectées
        </h2>
        <p className="text-sm leading-relaxed">
          Nous collectons uniquement les informations nécessaires au bon
          fonctionnement de la mise en relation : nom ou raison sociale, métier,
          commune et quartier d&apos;intervention à Abidjan, numéro de
          téléphone / WhatsApp, photos de réalisations et avis clients.
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900">
          2. Confidentialité des coordonnées et utilisation
        </h2>
        <p className="text-sm leading-relaxed">
          Les numéros WhatsApp des artisans sont affichés uniquement aux
          membres connectés afin d&apos;éviter le démarchage abusif. Vos
          données ne sont jamais revendues ni louées à des tiers.
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900">
          3. Vos droits (Accès, rectification, suppression)
        </h2>
        <p className="text-sm leading-relaxed">
          Vous pouvez modifier votre profil ou supprimer définitivement votre
          compte à tout moment depuis votre espace{" "}
          <Link
            href="/mon-profil"
            className="text-orange-600 font-semibold hover:underline"
          >
            Mon profil
          </Link>{" "}
          ou en écrivant à{" "}
          <a
            href="mailto:cv2tcv2t@gmail.com"
            className="text-orange-600 font-semibold hover:underline"
          >
            cv2tcv2t@gmail.com
          </a>
          .
        </p>
      </section>

      <div className="flex flex-wrap gap-4 text-sm font-bold">
        <Link
          href="/mentions-legales"
          className="text-orange-600 hover:underline"
        >
          ← Voir les Mentions légales
        </Link>
      </div>
    </div>
  );
}