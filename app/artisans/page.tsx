import Link from "next/link";

export default function ArtisansPage() {
  // Données temporaires (plus tard on les prendra de la base de données)
  const artisans = [
    {
      id: 1,
      nom: "Kouassi Jean",
      metier: "Plombier",
      quartier: "Cocody",
      note: 4.8,
      avis: 24,
    },
    {
      id: 2,
      nom: "Traoré Awa",
      metier: "Électricienne",
      quartier: "Yopougon",
      note: 4.6,
      avis: 18,
    },
    {
      id: 3,
      nom: "Koné Ibrahim",
      metier: "Maçon",
      quartier: "Abobo",
      note: 4.9,
      avis: 31,
    },
    {
      id: 4,
      nom: "Bamba Fatou",
      metier: "Peintre",
      quartier: "Marcory",
      note: 4.7,
      avis: 15,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artisans à Abidjan</h1>
          <p className="text-gray-600 mt-1">
            Trouvez un professionnel de confiance près de chez vous
          </p>
        </div>

        <Link
          href="/demande"
          className="mt-4 md:mt-0 bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-700"
        >
          Poster une demande
        </Link>
      </div>

      {/* Filtres simples */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-wrap gap-3">
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
          <option>Toutes les catégories</option>
          <option>Plomberie</option>
          <option>Électricité</option>
          <option>Maçonnerie</option>
          <option>Peinture</option>
          <option>Climatisation</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
          <option>Toutes les communes</option>
          <option>Cocody</option>
          <option>Yopougon</option>
          <option>Abobo</option>
          <option>Marcory</option>
          <option>Plateau</option>
          <option>Koumassi</option>
        </select>
      </div>

      {/* Liste des artisans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <Link
            key={artisan.id}
            href={`/artisans/${artisan.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {artisan.nom}
                </h3>
                <p className="text-orange-600 font-medium">{artisan.metier}</p>
                <p className="text-sm text-gray-500 mt-1">{artisan.quartier}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-500 font-semibold">
                  ★ {artisan.note}
                </div>
                <div className="text-xs text-gray-500">
                  {artisan.avis} avis
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-orange-600 font-medium">
                Voir le profil →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}