"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [typeCompte, setTypeCompte] = useState<"particulier" | "artisan">("particulier");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Créer un compte</h1>
        <p className="text-gray-600 text-center mb-8">
          Rejoignez BARA en quelques secondes
        </p>

        {/* Choix du type de compte */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setTypeCompte("particulier")}
            className={`flex-1 py-2.5 rounded-lg font-medium border ${
              typeCompte === "particulier"
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Particulier
          </button>
          <button
            type="button"
            onClick={() => setTypeCompte("artisan")}
            className={`flex-1 py-2.5 rounded-lg font-medium border ${
              typeCompte === "artisan"
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Artisan
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="07 00 00 00 00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="••••••••"
            />
          </div>

          {typeCompte === "artisan" && (
            <div>
              <label className="block text-sm font-medium mb-1">Métier principal</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option>Plombier</option>
                <option>Électricien</option>
                <option>Maçon</option>
                <option>Peintre</option>
                <option>Autre</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 mt-2"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-orange-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}