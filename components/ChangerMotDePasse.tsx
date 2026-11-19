"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function ChangerMotDePasse() {
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  async function handleChangerMotDePasse(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setSucces(false);

    if (nouveauMotDePasse.length < 6) {
      setErreur("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (nouveauMotDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setEnCours(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: nouveauMotDePasse,
      });

      if (error) throw error;

      setSucces(true);
      setNouveauMotDePasse("");
      setConfirmation("");
    } catch (err: any) {
      setErreur(err.message || "Impossible de modifier le mot de passe.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          🔐 Sécurité & Mot de passe
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Modifiez votre mot de passe de connexion à votre espace BARA Abidjan.
        </p>

        <form onSubmit={handleChangerMotDePasse} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                placeholder="6 caractères minimum"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white"
              />
            </div>
          </div>

          {erreur && (
            <div className="text-red-600 text-xs bg-red-50 border border-red-200 p-3 rounded-xl">
              {erreur}
            </div>
          )}

          {succes && (
            <div className="text-green-800 text-xs font-semibold bg-green-50 border border-green-200 p-3 rounded-xl">
              ✅ Votre mot de passe a été mis à jour avec succès !
            </div>
          )}

          <button
            type="submit"
            disabled={enCours}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {enCours ? "Mise à jour..." : "Mettre à jour mon mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
