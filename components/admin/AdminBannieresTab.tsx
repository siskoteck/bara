"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export interface BanniereAdmin {
  id: string | number;
  created_at?: string;
  titre: string;
  description?: string | null;
  image_url?: string | null;
  lien?: string | null;
  actif: boolean;
}

interface Props {
  bannieres: BanniereAdmin[];
  setBannieres: React.Dispatch<React.SetStateAction<BanniereAdmin[]>>;
}

export function AdminBannieresTab({ bannieres, setBannieres }: Props) {
  const [titreBan, setTitreBan] = useState("");
  const [descBan, setDescBan] = useState("");
  const [imageBan, setImageBan] = useState("");
  const [lienBan, setLienBan] = useState("");
  const [ajoutBan, setAjoutBan] = useState(false);

  async function handleAjouterBanniere(e: React.FormEvent) {
    e.preventDefault();
    if (!titreBan.trim()) return;

    setAjoutBan(true);
    const { data, error } = await supabase
      .from("bannieres")
      .insert([
        {
          titre: titreBan.trim(),
          description: descBan.trim() || null,
          image_url: imageBan.trim() || null,
          lien: lienBan.trim() || null,
          actif: true,
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else if (data) {
      setBannieres((prev) => [data as BanniereAdmin, ...prev]);
      setTitreBan("");
      setDescBan("");
      setImageBan("");
      setLienBan("");
    }
    setAjoutBan(false);
  }

  async function toggleBanniereActif(
    id: string | number,
    statutActuel: boolean
  ) {
    const nouveauStatut = !statutActuel;
    const { error } = await supabase
      .from("bannieres")
      .update({ actif: nouveauStatut })
      .eq("id", id);

    if (!error) {
      setBannieres((prev) =>
        prev.map((b) => (b.id === id ? { ...b, actif: nouveauStatut } : b))
      );
    }
  }

  async function supprimerBanniere(id: string | number) {
    if (!confirm("Supprimer cette bannière publicitaire ?")) return;
    const { error } = await supabase.from("bannieres").delete().eq("id", id);
    if (!error) {
      setBannieres((prev) => prev.filter((b) => b.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAjouterBanniere}
        className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4"
      >
        <h2 className="text-lg font-extrabold text-gray-900">
          ➕ Ajouter une bannière publicitaire
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ban-titre"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Titre *
            </label>
            <input
              id="ban-titre"
              type="text"
              required
              value={titreBan}
              onChange={(e) => setTitreBan(e.target.value)}
              placeholder="Ex: Promotion climatisation Cocody"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="ban-lien"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Lien de redirection (optionnel)
            </label>
            <input
              id="ban-lien"
              type="text"
              value={lienBan}
              onChange={(e) => setLienBan(e.target.value)}
              placeholder="Ex: /artisans?metier=Climatisation"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ban-desc"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Description courte
            </label>
            <input
              id="ban-desc"
              type="text"
              value={descBan}
              onChange={(e) => setDescBan(e.target.value)}
              placeholder="Texte affiché sous le titre..."
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="ban-img"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              URL de l&apos;image (optionnel)
            </label>
            <input
              id="ban-img"
              type="url"
              value={imageBan}
              onChange={(e) => setImageBan(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={ajoutBan}
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {ajoutBan ? "Ajout en cours..." : "Publier la bannière"}
        </button>
      </form>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-gray-900 mb-4">
          Bannières enregistrées ({bannieres.length})
        </h3>

        {bannieres.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune bannière créée.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {bannieres.map((b) => (
              <div
                key={b.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        b.actif
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.actif ? "Active" : "Masquée"}
                    </span>
                    <span className="font-bold text-sm text-gray-900">
                      {b.titre}
                    </span>
                  </div>
                  {b.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {b.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleBanniereActif(b.id, b.actif)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50"
                  >
                    {b.actif ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => supprimerBanniere(b.id)}
                    className="text-xs font-bold text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}