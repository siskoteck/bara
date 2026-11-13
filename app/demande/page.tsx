"use client";

import { useState } from "react";
import Link from "next/link";

export default function DemandePage() {
  const [envoye, setEnvoye] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border p-10">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-3">Demande envoyée !</h1>
          <p className="text-gray-600 mb-8">
            Des artisans vont bientôt vous contacter. Vérifiez votre téléphone.
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Type de travaux *
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="">Choisir une catégorie</option>
            <option>Plomberie</option>
            <option>Électricité</option>
            <option>Maçonnerie</option>
            <option>Peinture</option>
            <option>Climatisation</option>
            <option>Menuiserie</option>
            <option>Carrelage</option>
            <option>Serrurerie</option>
            <option>Autre</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description du besoin *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Expliquez clairement ce dont vous avez besoin..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {/* Quartier */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Quartier / Commune *
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="">Sélectionner</option>
            <option>Cocody</option>
            <option>Yopougon</option>
            <option>Abobo</option>
            <option>Marcory</option>
            <option>Plateau</option>
            <option>Koumassi</option>
            <option>Treichville</option>
            <option>Adjamé</option>
            <option>Port-Bouët</option>
            <option>Autre</option>
          </select>
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Votre numéro de téléphone *
          </label>
          <input
            type="tel"
            required
            placeholder="07 00 00 00 00"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {/* Budget (optionnel) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Budget approximatif (optionnel)
          </label>
          <input
            type="text"
            placeholder="Ex: 50 000 FCFA"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
        >
          Envoyer ma demande
        </button>
      </form>
    </div>
  );
}