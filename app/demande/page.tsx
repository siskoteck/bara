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

    const nouvelleDemande = {
      titre: `${formData.get("categorie")} - ${formData.get("quartier")}`,
      metier: formData.get("categorie") as string,
      "Quartier / commune": formData.get("quartier") as string,
      "Description du besoin": formData.get("description") as string,
      telephone: formData.get("telephone") as string,
      budget: (formData.get("budget") as string) || null,
      categorie: formData.get("categorie") as string,
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
            Des artisans vont bientôt vous contacter.
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
        {/* Type de travaux */}
        <div>
          <label htmlFor="categorie" className="block text-sm font-medium mb-2">
            Type de travaux *
          </label>
          <select
            id="categorie"
            name="categorie"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="">Choisir une catégorie</option>
            <option value="Plomberie">Plomberie</option>
            <option value="Électricité">Électricité</option>
            <option value="Maçonnerie">Maçonnerie</option>
            <option value="Peinture">Peinture</option>
            <option value="Climatisation">Climatisation</option>
            <option value="Menuiserie">Menuiserie</option>
            <option value="Carrelage">Carrelage</option>
            <option value="Serrurerie">Serrurerie</option>
            <option value="Fer forgé">Fer forgé</option>
            <option value="Plâtrerie">Plâtrerie</option>
            <option value="Carrelage & Faïence">Carrelage & Faïence</option>
            <option value="Étanchéité">Étanchéité</option>
            <option value="Charpente">Charpente</option>
            <option value="Couverture">Couverture</option>
            <option value="Vitrerie">Vitrerie</option>
            <option value="Aluminium">Aluminium</option>
            <option value="Nettoyage">Nettoyage</option>
            <option value="Jardinage">Jardinage</option>
            <option value="Déménagement">Déménagement</option>
            <option value="Autre">Autre</option>
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

        {/* Quartier / Commune */}
        <div>
          <label htmlFor="quartier" className="block text-sm font-medium mb-2">
            Quartier / Commune *
          </label>
          <select
            id="quartier"
            name="quartier"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="">Sélectionner</option>
            <option value="Abobo">Abobo</option>
            <option value="Adjamé">Adjamé</option>
            <option value="Attécoubé">Attécoubé</option>
            <option value="Cocody">Cocody</option>
            <option value="Koumassi">Koumassi</option>
            <option value="Marcory">Marcory</option>
            <option value="Plateau">Plateau</option>
            <option value="Port-Bouët">Port-Bouët</option>
            <option value="Treichville">Treichville</option>
            <option value="Yopougon">Yopougon</option>
            <option value="Anyama">Anyama</option>
            <option value="Bingerville">Bingerville</option>
            <option value="Songon">Songon</option>
            <option value="Brofodoumé">Brofodoumé</option>
            <option value="Grand-Bassam">Grand-Bassam</option>
            <option value="Bonoua">Bonoua</option>
            <option value="Dabou">Dabou</option>
            <option value="Jacqueville">Jacqueville</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium mb-2">
            Votre numéro de téléphone *
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            required
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