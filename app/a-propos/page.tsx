export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">À propos de BARA</h1>

      <div className="prose prose-lg text-gray-700 space-y-6">
        <p>
          <strong>BARA</strong> est une plateforme ivoirienne de mise en relation
          entre les artisans et les particuliers à Abidjan.
        </p>

        <p>
          Notre mission est simple : permettre aux habitants d’Abidjan de trouver
          rapidement un artisan de confiance (plombier, électricien, maçon,
          peintre, etc.) et aider les artisans à développer leur activité grâce
          à une meilleure visibilité.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Pourquoi BARA ?</h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>Trouver un artisan près de chez soi en quelques clics</li>
          <li>Consulter les avis et notes des autres clients</li>
          <li>Contacter facilement les professionnels (WhatsApp + demande de devis)</li>
          <li>Aider les artisans locaux à obtenir plus de clients</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Notre vision</h2>
        <p>
          Nous voulons devenir la référence de la mise en relation artisan-particulier
          en Côte d’Ivoire, en commençant par Abidjan, avec simplicité, confiance
          et proximité.
        </p>

        <p className="mt-10 text-gray-600">
          BARA – Abidjan, Côte d’Ivoire
        </p>
      </div>
    </div>
  );
}