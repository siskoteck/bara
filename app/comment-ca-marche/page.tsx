import Link from "next/link";

export default function CommentCaMarchePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">
        Comment ça marche ?
      </h1>
      <p className="text-center text-gray-600 mb-12">
        BARA simplifie la mise en relation entre particuliers et artisans à Abidjan.
      </p>

      {/* Pour les particuliers */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-orange-600">
          Pour les particuliers
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg">Décrivez votre besoin</h3>
              <p className="text-gray-600">
                Indiquez le type de travaux, votre quartier et une description claire.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg">Recevez des propositions</h3>
              <p className="text-gray-600">
                Des artisans proches de chez vous vous contactent rapidement.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg">Choisissez et évaluez</h3>
              <p className="text-gray-600">
                Sélectionnez l’artisan qui vous convient et laissez un avis après le travail.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/demande"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
          >
            Poster une demande
          </Link>
        </div>
      </section>

      {/* Pour les artisans */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-orange-600">
          Pour les artisans
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg">Créez votre profil</h3>
              <p className="text-gray-600">
                Inscrivez-vous, indiquez vos métiers et vos zones d’intervention.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg">Recevez des demandes</h3>
              <p className="text-gray-600">
                Les particuliers vous contactent directement selon votre profil.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg">Développez votre activité</h3>
              <p className="text-gray-600">
                Gagnez en visibilité et recevez plus de clients à Abidjan.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/auth/register"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
          >
            Créer mon profil artisan
          </Link>
        </div>
      </section>
    </div>
  );
}