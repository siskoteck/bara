import Link from "next/link";
import AuthButtons from "./AuthButtons";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo BARA Abidjan */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-orange-600">
              BARA
            </span>
            <span className="text-[11px] sm:text-xs font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full inline-block">
              Abidjan
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/sos-urgence"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full font-bold text-xs transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              SOS Urgence
            </Link>
            <Link
              href="/artisans"
              className="text-gray-700 hover:text-orange-600 font-medium text-sm transition"
            >
              Artisans
            </Link>
            <Link
              href="/tarifs"
              className="text-gray-700 hover:text-orange-600 font-medium text-sm transition"
            >
              Tarifs
            </Link>
            <Link
              href="/conseils"
              className="text-gray-700 hover:text-orange-600 font-medium text-sm transition"
            >
              Conseils
            </Link>
            <Link
              href="/demande"
              className="bg-orange-50 text-orange-600 hover:bg-orange-100 px-3.5 py-2 rounded-xl font-semibold text-sm transition"
            >
              + Besoin
            </Link>
          </nav>

          {/* Boutons de connexion / compte */}
          <AuthButtons />
        </div>

        {/* Navigation Mobile */}
        <nav className="flex md:hidden items-center justify-around border-t border-gray-100 py-2 text-xs font-medium text-gray-700">
          <Link
            href="/sos-urgence"
            className="text-red-600 font-extrabold py-1"
          >
            🚨 SOS
          </Link>
          <Link href="/artisans" className="hover:text-orange-600 py-1">
            🔍 Artisans
          </Link>
          <Link href="/tarifs" className="hover:text-orange-600 py-1">
            💰 Tarifs
          </Link>
          <Link href="/conseils" className="hover:text-orange-600 py-1">
            💡 Conseils
          </Link>
          <Link href="/demande" className="text-orange-600 font-semibold py-1">
            ➕ Besoin
          </Link>
        </nav>
      </div>
    </header>
  );
}
