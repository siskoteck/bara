export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      <p className="text-gray-600 mb-8">
        Une question ? Une suggestion ? Écrivez-nous.
      </p>

      <form className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email ou Téléphone</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
        </div>
        <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700">
          Envoyer
        </button>
      </form>
    </div>
  );
}