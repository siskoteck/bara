"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const METIERS = ["Plombier", "Électricien", "Maçon", "Peintre", "Autre"];
const COMMUNES = [
  "Cocody",
  "Yopougon",
  "Abobo",
  "Marcory",
  "Plateau",
  "Koumassi",
  "Treichville",
  "Adjamé",
  "Port-Bouët",
  "Attécoubé",
  "Bingerville",
];

export default function DemandePage() {
  const [etat, setEtat] = useState<"chargement" | "deconnecte" | "pret">("chargement");
  const [telephoneInitial, setTelephoneInitial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) {
        setEtat("deconnecte");
        return;
      }
      setTelephoneInitial(user.user_metadata?.telephone ?? "");
      setEtat("pret");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const { error: insertError } = await supabase.from("demandes").insert({
        titre: (formData.get("titre") as string).trim(),
        metier: formData.get("metier") as string,
        commune: formData.get("commune") as string,
        description: (formData.get("description") as string).trim(),
        telephone: (formData.get("telephone") as string).trim(),
      });

      if (insertError) throw insertError;
      setEnvoye(true);
    } catch (err: any) {
      console.error("Erreur demande:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  if (etat === "chargement") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-gray-500">Chargement…</div>
    );
  }

  if (etat === "deconnecte") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Connectez-vous pour poster une demande</h1>
          <p className="text-gray-600 mb-6">
            Un compte gratuit permet de suivre vos demandes et d'être contacté par
            les artisans.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/register"
              className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-700"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (envoye) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Demande envoyée</h1>
          <p className="text-gray-600 mb-6">
            Les artisans du métier choisi peuvent maintenant la voir et vous
            contacter sur WhatsApp.
          </p>
          <Link
            href="/mes-demandes"
            className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-700"
          >
            Voir mes demandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-1">Poster une demande</h1>
        <p className="text-gray-600 mb-8">
          Décrivez votre besoin, les artisans concernés vous contacteront.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium mb-1">
              Titre de la demande
            </label>
            <input
              id="titre"
              name="titre"
              type="text"
              required
              minLength={3}
              maxLength={120}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Ex. : Fuite sous l'évier de la cuisine"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="metier" className="block text-sm font-medium mb-1">
                Métier recherché
              </label>
              <select
                id="metier"
                name="metier"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              >
                {METIERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="commune" className="block text-sm font-medium mb-1">
                Commune
              </label>
              <select
                id="commune"
                name="commune"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              >
                {COMMUNES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={10}
              maxLength={1500}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Expliquez le problème, le lieu, quand vous voulez que l'artisan passe…"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="block text-sm font-medium mb-1">
              Votre numéro WhatsApp
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              required
              autoComplete="tel"
              defaultValue={telephoneInitial}
              pattern="[0-9 +]{8,20}"
              title="Entrez un numéro valide, par exemple 07 00 00 00 00"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="07 00 00 00 00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce numéro sera visible par les artisans du métier choisi, pour qu'ils
              puissent vous contacter.
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Envoi…" : "Envoyer ma demande"}
          </button>
        </form>
      </div>
    </div>
  );
}