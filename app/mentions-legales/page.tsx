import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — BARA Abidjan",
  description:
    "Mentions légales officielles de la plateforme BARA Abidjan : éditeur, hébergement, contact et responsabilité.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-gray-800">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
          Informations juridiques
        </span>
        <h1 className="text-3xl font-black text-gray-900 mt-1">
          Mentions légales
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Dernière mise à jour : Novembre 2026
        </p>
      </div>

      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900">
          1. Éditeur de la plateforme
        </h2>
        <p className="text-sm leading-relaxed">
          La plateforme <strong>BARA Abidjan</strong> (accessible à l&apos;adresse{" "}
          <strong>bara-six-beta.vercel.app</strong>) est un service numérique de
          mise en relation directe entre particuliers, entreprises et artisans
          exerçant dans le District Autonome d&apos;Abidjan (Côte d&apos;Ivoire).
        </p>
        <ul className="text-sm space-y-1.5 text-gray-700">
          <li>
            <strong>Zone d&apos;activité :</strong> Abidjan, Côte d&apos;Ivoire
          </li>
          <li>
            <strong>Contact e-mail :</strong>{" "}
            <a
              href="mailto:cv2tcv2t@gmail.com"
              className="text-orange-600 font-semibold hover:underline"
            >
              cv2tcv2t@gmail.com
            </a>
          </li>
          <li>
            <strong>Support WhatsApp :</strong>{" "}
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-semibold hover:underline"
            >
              Contacter l&apos;équipe BARA sur WhatsApp
            </a>
          </li>
        </ul>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900">
          2. Hébergement technique
        </h2>
        <p className="text-sm leading-relaxed">
          Le site web est hébergé par <strong>Vercel Inc.</strong> (440 N
          Barranca Ave #4133, Covina, CA 91723, États-Unis). Les données et
          comptes utilisateurs sont hébergés de manière sécurisée via{" "}
          <strong>Supabase Inc.</strong>
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900">
          3. Nature du service et responsabilité
        </h2>
        <p className="text-sm leading-relaxed">
          BARA agit exclusivement en qualité d&apos;intermédiaire technique de
          mise en relation. Les devis, tarifs, délais et prestations sont
          convenus directement entre le client et l&apos;artisan choisi. Le
          badge <em>« Identité vérifiée »</em> atteste du contrôle de la pièce
          d&apos;identité et du numéro WhatsApp fournis par le professionnel
          lors de son inscription.
        </p>
      </section>

      <div className="flex flex-wrap gap-4 text-sm font-bold">
        <Link href="/confidentialite" className="text-orange-600 hover:underline">
          Consulter la Politique de confidentialité →
        </Link>
        <Link href="/contact" className="text-gray-600 hover:underline">
          Nous contacter
        </Link>
      </div>
    </div>
  );
}