"use client";

import { METIERS, COMMUNES } from "@/lib/constantes";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DemandePage() {
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const metierChoisi = formData.get("categorie") as string;
    const communeChoisie = formData.get("quartier") as string;

    const nouvelleDemande = {
      titre: `${metierChoisi} - ${communeChoisie}`,
      metier: metierChoisi,
      "Quartier / commune": communeChoisie,
      "Description du besoin": (formData.get("description") as string).trim(),
      telephone: (formData.get("telephone") as string).trim(),
      budget: ((formData.get("budget") as string) || "").trim() || null,
      categorie: metierChoisi,
      statut: "ouverte",
    };

    const { error } = await supabase.from("demandes").insert([nouvelleDemande]);

    if (error) {
      console.error(error);
      setError("Erreur lors de l'envoi : " + error.message);
      setLoading(false);
      return;
    }

    setEnvoye(true);
    setLoading(false);
  }

  if (envoye) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border p-10">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-3">Demande envoyée !</h1>
          <p className="text-gray-600 mb-8">
            Des artisans qualifiés vont bientôt vous contacter.
          </p>
          <Link
            href="/"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Poster une demande</h1>
      <p className="text-gray-600 mb-8">
        Décrivez votre besoin, des artisans qualifiés vous répondront.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border p-8 space-y-6"
      >
        {/* Métier recherché (depuis lib/constantes.ts) */}
        <div>
          <label htmlFor="categorie" className="block text-sm font-medium mb-2">
            Métier recherché *
          </label>
          <select
            id="categorie"
            name="categorie"
            required
            defaultValue=""
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
          >
            <option value="" disabled>
              Choisir un métier
            </option>
            {METIERS.map((metier) => (
              <option key={metier} value={metier}>
                {metier}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description du besoin *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Expliquez clairement ce dont vous avez besoin..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {/* Commune (depuis lib/constantes.ts) */}
        <div>
          <label htmlFor="quartier" className="block text-sm font-medium mb-2">
            Commune à Abidjan *
          </label>
          <select
            id="quartier"
            name="quartier"
            required
            defaultValue=""
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
          >
            <option value="" disabled>
              Choisir une commune
            </option>
            {COMMUNES.map((commune) => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium mb-2">
            Votre numéro de téléphone (WhatsApp) *
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            required
            pattern="[0-9 +]{8,16}"
            title="Entrez un numéro valide, par exemple 07 00 00 00 00"
            placeholder="07 00 00 00 00"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-2">
            Budget approximatif (optionnel)
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            placeholder="Ex: 50 000 FCFA"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </form>
    </div>
  );
}
