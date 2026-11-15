import Link from "next/link";
import AuthButtons from "./AuthButtons";
export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">BARA</span>
            <span className="text-sm text-gray-500 hidden sm:inline">Abidjan</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/artisans" className="text-gray-700 hover:text-orange-600">
              Artisans
            </Link>
            <Link href="/demande" className="text-gray-700 hover:text-orange-600">
              Poster une demande
            </Link>
            <Link href="/comment-ca-marche" className="text-gray-700 hover:text-orange-600">
              Comment ça marche
            </Link>
          </nav>

          {/* Boutons de connexion / compte */}
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}