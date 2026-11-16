import Link from "next/link";
import { cacheLife } from "next/cache";
import { supabase } from "@/lib/supabase";
import { genererLienWhatsApp } from "@/lib/whatsapp";

export async function ArtisansRecommandes() {
  "use cache";
  cacheLife("hours");

  const { data: artisansRecommandes } = await supabase
    .from("artisans")
    .select("id, name, metier, commune, telephone, avatar_url, verifie")
    .order("verifie", { ascending: false })
    .limit(6);

  if (!artisansRecommandes || artisansRecommandes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-orange-50/50 border-t border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Artisans recommandés à Abidjan
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Des professionnels disponibles dans votre commune
            </p>
          </div>
          <Link
            href="/artisans"
            className="text-orange-600 font-medium hover:underline text-sm"
          >
            Voir tout l&apos;annuaire →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artisansRecommandes.map((artisan) => {
            const initiales = artisan.name
              ? artisan.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "A";

            return (
              <div
                key={artisan.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {artisan.avatar_url ? (
                      <img
                        src={artisan.avatar_url}
                        alt={artisan.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-lg font-bold border border-orange-200 shrink-0">
                        {initiales}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {artisan.name}
                      </h3>
                      <p className="text-orange-600 font-medium text-sm">
                        {artisan.metier}
                      </p>
                      {artisan.commune && (
                        <p className="text-gray-500 text-xs mt-0.5">
                          📍 {artisan.commune}
                        </p>
                      )}
                    </div>
                  </div>

                  {artisan.verifie && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span>✓</span> Profil vérifié
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/artisans/${artisan.id}`}
                    className="flex-1 text-center py-2.5 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Voir le profil
                  </Link>
                  {artisan.telephone && (
                    <a
                      href={genererLienWhatsApp(
                        artisan.telephone,
                        artisan.name,
                        artisan.metier,
                        artisan.commune
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 px-3 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
