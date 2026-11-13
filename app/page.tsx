import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trouvez un artisan de confiance à Abidjan
          </h1>
          <p className="text-xl mb-8 text-orange-100">
            Plombiers, électriciens, maçons, peintres… Trouvez le bon professionnel rapidement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artisans"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50"
            >
              Trouver un artisan
            </Link>
            <Link
              href="/demande"
              className="bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-800"
            >
              Poster une demande
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Catégories populaires
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Plomberie",
              "Électricité",
              "Maçonnerie",
              "Peinture",
              "Climatisation",
              "Menuiserie",
              "Carrelage",
              "Serrurerie",
               "Informatique",
                "Reparation téléphone",
                 "Mecanique auto",
                  "Climatisation automobile",
            ].map((cat) => (
              <Link
                key={cat}
                href={`/artisans?categorie=${cat.toLowerCase()}`}
                className="bg-gray-50 hover:bg-orange-50 border border-gray-200 rounded-xl p-6 text-center transition"
              >
                <div className="text-lg font-medium text-gray-800">{cat}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Décrivez votre besoin</h3>
              <p className="text-gray-600">
                Expliquez ce dont vous avez besoin et votre quartier à Abidjan.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Recevez des propositions</h3>
              <p className="text-gray-600">
                Des artisans qualifiés vous contactent rapidement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Choisissez et notez</h3>
              <p className="text-gray-600">
                Sélectionnez l’artisan et laissez un avis après le travail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes artisan ?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Rejoignez BARA et développez votre activité à Abidjan.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50"
          >
            Créer mon profil artisan
          </Link>
        </div>
      </section>
    </div>
  );
}