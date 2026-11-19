import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 : Présentation BARA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-orange-500">
                BARA
              </span>
              <span className="text-xs font-semibold bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full">
                Abidjan
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              L&apos;annuaire des artisans qualifiés et vérifiés à Abidjan.
              Trouvez rapidement un professionnel de confiance près de chez vous.
            </p>
          </div>
          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/artisans" className="hover:text-orange-400 transition">
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="hover:text-orange-400 transition">
                  Guide des tarifs
                </Link>
              </li>
              <li>
                <Link href="/conseils" className="hover:text-orange-400 transition">
                  Conseils & Prévention
                </Link>
              </li>
              <li>
                <Link href="/demande" className="hover:text-orange-400 transition">
                  Poster une demande
                </Link>
              </li>
            </ul>
          </div>
          {/* Colonne 3 : Espace Pro & Aide */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Espace Pro & Aide
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-orange-400 transition"
                >
                  Inscrire mon activité
                </Link>
              </li>
              <li>
                <Link
                  href="/comment-ca-marche"
                  className="hover:text-orange-400 transition"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition">
                  Formulaire de contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Colonne 4 : Support WhatsApp direct */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Assistance & Badge Vérifié
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Une question, un partenariat publicitaire ou une demande de badge
              vérifié ? Écrivez-nous directement sur WhatsApp.
            </p>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <span>💬</span> Nous écrire sur WhatsApp
            </a>
          </div>
        </div>
        {/* Bas de page */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 BARA Abidjan. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-gray-300">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-gray-300">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
