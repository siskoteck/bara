import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#064E3B] text-emerald-100 mt-16 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 : Présentation BARA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white text-[#064E3B] font-black text-base">
                B
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                BARA
              </span>
              <span className="text-xs font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                Abidjan
              </span>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              L&apos;annuaire des artisans qualifiés et vérifiés à Abidjan.
              Trouvez rapidement un professionnel de confiance près de chez vous.
            </p>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/artisans"
                  className="hover:text-amber-300 transition"
                >
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link
                  href="/tarifs"
                  className="hover:text-amber-300 transition"
                >
                  Guide des tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/conseils"
                  className="hover:text-amber-300 transition"
                >
                  Conseils & Prévention
                </Link>
              </li>
              <li>
                <Link
                  href="/demande"
                  className="hover:text-amber-300 transition"
                >
                  Poster une demande
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Espace Pro & Aide */}
          <div>
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider mb-3">
              Espace Pro & Aide
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-amber-300 transition"
                >
                  Inscrire mon activité
                </Link>
              </li>
              <li>
                <Link
                  href="/comment-ca-marche"
                  className="hover:text-amber-300 transition"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-300 transition"
                >
                  Formulaire de contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Assistance & Badge Vérifié */}
          <div>
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider mb-3">
              Assistance & Badge Vérifié
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed mb-3">
              Une question, un partenariat publicitaire ou une demande de badge
              vérifié ? Contactez notre équipe à Abidjan.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <span>💬</span> Contacter l&apos;équipe BARA
            </Link>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-10 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
          <p>© 2026 BARA Abidjan. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/mentions-legales"
              className="hover:text-white transition"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:text-white transition"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
