"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AvisClient {
  id: number | string;
  created_at: string;
  auteur: string;
  note: number;
  commentaire: string | null;
}

interface Props {
  artisanId: string;
  artisanNom: string;
  avisInitiaux: AvisClient[];
}

export function AvisArtisanSection({
  artisanId,
  artisanNom,
  avisInitiaux,
}: Props) {
  const [avis, setAvis] = useState<AvisClient[]>(avisInitiaux);
  const [auteur, setAuteur] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [message, setMessage] = useState("");

  const noteMoyenne =
    avis.length > 0
      ? (avis.reduce((acc, item) => acc + Number(item.note), 0) / avis.length).toFixed(1)
      : null;

  async function handleAjouterAvis(e: React.FormEvent) {
    e.preventDefault();
    if (!auteur.trim()) return;

    setEnvoiEnCours(true);
    setMessage("");

    const { data, error } = await supabase
      .from("avis")
      .insert([
        {
          artisan_id: artisanId,
          auteur: auteur.trim(),
          note,
          commentaire: commentaire.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      setMessage("Erreur : " + error.message);
    } else if (data) {
      setAvis((prev) => [data as AvisClient, ...prev]);
      setAuteur("");
      setNote(5);
      setCommentaire("");
      setMessage("✅ Merci ! Votre avis a bien été publié.");
    }

    setEnvoiEnCours(false);
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            ⭐ Avis des clients ({avis.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Retours d&apos;expérience vérifiés à Abidjan
          </p>
        </div>

        {noteMoyenne && (
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-right">
            <span className="text-lg font-black text-amber-700">
              {noteMoyenne} / 5
            </span>
            <p className="text-[11px] text-amber-800 font-semibold">
              Note moyenne
            </p>
          </div>
        )}
      </div>

      {/* Formulaire ajout d'avis */}
      <form
        onSubmit={handleAjouterAvis}
        className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-3"
      >
        <p className="text-xs font-extrabold text-gray-800">
          Vous avez fait appel à {artisanNom} ? Laissez votre avis :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="avis-auteur" className="sr-only">
              Votre nom
            </label>
            <input
              id="avis-auteur"
              type="text"
              required
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              placeholder="Votre nom (ex: Koffi M.)"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="avis-note" className="sr-only">
              Note sur 5
            </label>
            <select
              id="avis-note"
              value={note}
              onChange={(e) => setNote(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white font-semibold"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5 - Excellent travail)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5 - Très satisfait)</option>
              <option value={3}>⭐⭐⭐ (3/5 - Correct)</option>
              <option value={2}>⭐⭐ (2/5 - Moyen)</option>
              <option value={1}>⭐ (1/5 - Déçu)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="avis-commentaire" className="sr-only">
            Commentaire
          </label>
          <textarea
            id="avis-commentaire"
            rows={2}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Décrivez brièvement la qualité, la ponctualité ou le tarif..."
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
          />
        </div>

        {message && (
          <p className="text-xs font-bold text-emerald-700">{message}</p>
        )}

        <button
          type="submit"
          disabled={envoiEnCours}
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {envoiEnCours ? "Publication..." : "Publier mon avis"}
        </button>
      </form>

      {/* Liste des avis */}
      {avis.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucun avis publié pour le moment. Soyez le premier à partager votre
          expérience !
        </p>
      ) : (
        <div className="space-y-3">
          {avis.map((item) => (
            <div
              key={item.id}
              className="border border-gray-100 rounded-2xl p-4 bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-gray-900">
                  {item.auteur}
                </span>
                <span className="text-xs font-extrabold text-amber-600">
                  {"⭐".repeat(Math.min(5, Math.max(1, Number(item.note))))}
                </span>
              </div>
              {item.commentaire && (
                <p className="text-xs sm:text-sm text-gray-700 mt-1.5 leading-relaxed">
                  {item.commentaire}
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}