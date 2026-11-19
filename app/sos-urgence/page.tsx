"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { COMMUNES } from "@/lib/constantes";

interface Artisan {
  id: string;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  avatar_url: string | null;
  verifie: boolean | null;
  disponible: boolean | null;
  recommandations?: number;
}

const URGENCES_TYPES = [
  { label: "Toutes les urgences", metier: "Tous", icone: "🚨" },
  { label: "Fuite d'eau / Canalisation", metier: "Plombier", icone: "🚰" },
  { label: "Panne courant / Court-circuit", metier: "Électricien", icone: "⚡" },
  { label: "Porte bloquée / Serrure", metier: "Serrurier / Soudeur", icone: "🔑" },
  { label: "Clim en panne / Chaleur", metier: "Frigoriste / Climatisation", icone: "❄️" },
  { label: "Dépannage Auto / Moto", metier: "Mécanicien auto / moto", icone: "🚗" },
];
export default function SosUrgencePage() {
  const [artisansDispos, setArtisansDispos] = useState<Artisan[]>([]);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(false);
  const [loading, setLoading] = useState(true);

  const [urgenceChoisie, setUrgenceChoisie] = useState("Tous");
  const [communeChoisie, setCommuneChoisie] = useState("Toutes");

  useEffect(() => {
    async function chargerUrgences() {
      const [resSession, resArtisans] = await Promise.all([
        supabase.auth.getSession(),
        supabase
          .from("artisans")
          .select("*")
          .neq("disponible", false)
          .order("verifie", { ascending: false })
          .order("recommandations", { ascending: false }),
      ]);

      setUtilisateurConnecte(Boolean(resSession.data.session?.user));

      if (resArtisans.data) {
        setArtisansDispos(resArtisans.data as Artisan[]);
      }
      setLoading(false);
    }

    chargerUrgences();
  }, []);

  function genererWhatsAppUrgent(tel: string | null, nomArtisan: string, metier: string) {
    let chiffres = (tel || "").replace(/\D/g, "");
    if (chiffres.length === 10 && chiffres.startsWith("0")) {
      chiffres = "225" + chiffres;
    } else if (chiffres.startsWith("00225")) {
      chiffres = chiffres.slice(2);
    }
    const texte = encodeURIComponent(
      `🚨 *URGENCE DÉPANNAGE BARA ABIDJAN*\nBonjour ${nomArtisan}, j'ai une urgence (${metier}) et j'ai vu sur BARA que vous êtes disponible immédiatement. Pouvez-vous intervenir rapidement ?`
    );
    return "https://wa.me" + chiffres + "?text=" + texte;
  }

  const listeUrgence = artisansDispos.filter((a) => {
    const matchMetier =
      urgenceChoisie === "Tous" ||
      (a.metier || "").toLowerCase() === urgenceChoisie.toLowerCase();

    const matchCommune =
      communeChoisie === "Toutes" ||
      (a.commune || "").toLowerCase() === communeChoisie.toLowerCase();

    return matchMetier && matchCommune;
  });
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Bannière SOS Urgence */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            INTERVENTION EXPRESS ABIDJAN
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold">
          🚨 SOS Dépannage Urgent
        </h1>
        <p className="text-red-50 text-sm sm:text-base mt-2 max-w-2xl">
          Fuite d&apos;eau, coupure de courant ou porte bloquée ? Retrouvez
          uniquement les artisans <strong>disponibles immédiatement</strong> dans
          votre commune.
        </p>
      </div>

      {/* Sélection rapide du type d'urgence */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase text-gray-500 mb-3">
          1. Quelle est votre urgence ?
        </p>
        <div className="flex flex-wrap gap-2">
          {URGENCES_TYPES.map((u) => (
            <button
              key={u.label}
              type="button"
              onClick={() => setUrgenceChoisie(u.metier)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-2 ${
                urgenceChoisie === u.metier
                  ? "bg-red-600 text-white border-red-600 shadow-sm"
                  : "bg-white text-gray-800 border-gray-300 hover:border-red-400"
              }`}
            >
              <span>{u.icone}</span>
              <span>{u.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sélection de la commune */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-gray-500">
            2. Votre commune à Abidjan
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">
            {listeUrgence.length} artisan(s) disponible(s) immédiatement
          </p>
        </div>

        <select
          value={communeChoisie}
          onChange={(e) => setCommuneChoisie(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white sm:w-64"
        >
          <option value="Toutes">Toutes les communes d&apos;Abidjan</option>
          {COMMUNES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Recherche des artisans disponibles en urgence...
        </div>
      ) : listeUrgence.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="font-bold text-gray-900 mb-2">
            Aucun artisan disponible immédiatement pour ce filtre précis.
          </p>
          <p className="text-xs text-gray-600 mb-5">
            Sélectionnez « Toutes les communes d&apos;Abidjan » ou publiez une
            demande urgente pour alerter les artisans voisins.
          </p>
          <Link
            href="/demande"
            className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition"
          >
            🚨 Lancer une alerte dépannage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listeUrgence.map((artisan) => {
            const initiales = artisan.name
              ? artisan.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "A";

            return (
              <div
                key={artisan.id}
                className="bg-white rounded-2xl border-2 border-red-100 hover:border-red-300 p-5 shadow-sm flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                      Intervention rapide
                    </span>
                    {artisan.verifie && (
                      <span className="bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {artisan.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={artisan.avatar_url}
                        alt={artisan.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-extrabold shrink-0">
                        {initiales}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 text-base truncate">
                        {artisan.name}
                      </h2>
                      <p className="text-red-600 font-bold text-xs">
                        {artisan.metier}
                      </p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        📍 {artisan.commune || "Abidjan"}
                        {artisan.quartier ? ` (${artisan.quartier})` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions d'urgence selon statut de connexion */}
                <div className="pt-3 border-t border-gray-100 mt-2">
                  {utilisateurConnecte ? (
                    <div className="flex gap-2">
                      {artisan.telephone && (
                        <>
                          <a
                            href={genererWhatsAppUrgent(
                              artisan.telephone,
                              artisan.name,
                              artisan.metier
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
                          >
                            💬 WhatsApp Urgent
                          </a>
                          <a
                            href={"tel:" + artisan.telephone.replace(/\s+/g, "")}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition"
                          >
                            📞 Appeler
                          </a>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/artisans/${artisan.id}`}
                        className="text-xs font-bold text-gray-700 hover:underline"
                      >
                        Voir le profil
                      </Link>
                      <Link
                        href="/auth/login"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
                      >
                        🔒 Connexion pour appeler
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
