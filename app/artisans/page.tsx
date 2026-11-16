import Link from "next/link";
import AvisList from "@/components/artisans/AvisList";

export default function ArtisanProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // Données temporaires (plus tard on les récupérera depuis Supabase)
  const artisan = {
    id: params.id,
    nom: "Kouassi Jean",
    metier: "Plombier",
    quartier: "Cocody, Riviera",
    note: 4.8,
    avis: 24,
    description:
      "Plombier professionnel avec plus de 8 ans d'expérience à Abidjan. Interventions rapides pour fuites, installations sanitaires, chauffe-eau et débouchage.",
    zones: ["Cocody", "Plateau", "Marcory"],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/artisans"
        className="text-orange-600 hover:underline text-sm mb-6 inline-block"
      >
        ← Retour aux artisans
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* En-tête */}
        <div className="bg-orange-600 text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{artisan.nom}</h1>
              <p className="text-orange-100 text-xl mt-1">{artisan.metier}</p>
              <p className="text-orange-100 mt-2">{artisan.quartier}</p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold">★ {artisan.note}</div>
              <div className="text-orange-100">{artisan.avis} avis</div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Colonne gauche */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">À propos</h2>
                <p className="text-gray-700 leading-relaxed">
                  {artisan.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Zones d’intervention
                </h2>
                <div className="flex flex-wrap gap-2">
                  {artisan.zones.map((zone) => (
                    <span
                      key={zone}
                      className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avis */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Avis des clients</h2>
                <AvisList artisanId={artisan.id} />
              </div>
            </div>

            {/* Colonne droite - Contact */}
            <div>
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Contacter</h3>

                <a
                  href={`https://wa.me/2250700000000`}
                  target="_blank"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700 mb-3"
                >
                  WhatsApp
                </a>

                <Link
                  href="/demande"
                  className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg font-medium hover:bg-orange-700"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}