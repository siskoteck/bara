import Link from "next/link";
import { Search, Home, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 text-center shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-700 font-black text-2xl flex items-center justify-center mx-auto">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Oups, cette page est introuvable
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Le profil artisan ou la page que vous cherchez a peut-être été déplacé ou supprimé sur BARA Abidjan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm px-5 py-3 rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <Link
            href="/artisans"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-sm px-5 py-3 rounded-xl transition"
          >
            <Search className="w-4 h-4" />
            <span>Voir les artisans</span>
          </Link>
        </div>
        <div className="pt-2">
          <Link
            href="/demande"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:underline"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Poster un besoin de dépannage ou travaux</span>
          </Link>
        </div>
      </div>
    </div>
  );
}