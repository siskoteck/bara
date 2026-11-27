import Link from "next/link";
import { BadgeVerifie } from "@/components/BadgeVerifie";
import type { Artisan } from "@/lib/types";
import { genererLienWhatsAppArtisan } from "@/lib/utils";

interface ArtisanCardProps {
  artisan: Artisan;
  urgence?: boolean;
}

export function ArtisanCard({ artisan, urgence = false }: ArtisanCardProps) {
  const initiales = (artisan.name || "BA")
    .split(" ")
    .map((n) => n)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const estDisponible = artisan.disponible !== false;

  return (
    <div
      className={`animate-bara-fade-up bg-white rounded-3xl border hover:-translate-y-0.5 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between ${
        urgence
          ? "border-red-200 hover:border-red-400"
          : "border-gray-200 hover:border-orange-400"
      }`}
    >
      <div>
        <div className="flex items-start gap-3.5">
          <Link href={`/artisans/${artisan.id}`} className="shrink-0">
            {artisan.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artisan.avatar_url}
                alt={artisan.name}
                className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 font-black text-base flex items-center justify-center border border-orange-200">
                {initiales}
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {artisan.verifie && <BadgeVerifie taille="sm" />}
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  estDisponible
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {estDisponible ? "🟢 Disponible" : "⏳ Occupé"}
              </span>
            </div>

            <Link
              href={`/artisans/${artisan.id}`}
              className="font-extrabold text-gray-900 text-base hover:text-orange-600 transition line-clamp-1 block"
            >
              {artisan.name}
            </Link>

            <p className="text-xs font-bold text-orange-600 mt-0.5">
              🛠️ {artisan.metier}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3 flex flex-wrap items-center gap-2">
          <span>
            📍 {artisan.commune || "Abidjan"}
            {artisan.quartier ? ` (${artisan.quartier})` : ""}
          </span>
          {typeof artisan.recommandations === "number" &&
            artisan.recommandations > 0 && (
              <span className="font-bold text-amber-700">
                • ⭐ {artisan.recommandations} rec.
              </span>
            )}
        </p>

        {artisan.description && (
          <p className="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
            {artisan.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center gap-2">
        <Link
          href={`/artisans/${artisan.id}`}
          className="flex-1 text-center text-xs font-bold py-2.5 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 transition"
        >
          Voir profil
        </Link>

        {artisan.telephone && (
          <a
            href={genererLienWhatsAppArtisan(
              artisan.telephone,
              artisan.name,
              urgence
                ? `🚨 URGENCE BARA : Bonjour ${artisan.name}, j'ai besoin d'une intervention rapide (${artisan.metier}).`
                : undefined
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-extrabold py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-95 text-white transition shadow-xs"
          >
            💬 WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}