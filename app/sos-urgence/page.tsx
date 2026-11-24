"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { COMMUNES } from "@/lib/constantes";
import {
  GrilleArtisansSkeleton,
  FallbackErreurBara,
} from "@/components/shared/BaraSkeletons";

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
  const [erreurChargement, setErreurChargement] = useState(false);

  const [urgenceChoisie, setUrgenceChoisie] = useState("Tous");
  const [communeChoisie, setCommuneChoisie] = useState("Toutes");

  const chargerUrgences = useCallback(async () => {
    setLoading(true);
    setErreurChargement(false);

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

    if (resArtisans.error) {
      setErreurChargement(true);
    } else if (resArtisans.data) {
      setArtisansDispos(resArtisans.data as Artisan[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    chargerUrgences();
  }, [chargerUrgences]);
  function genererWhatsAppUrgent(
    tel: string | null,
    nomArtisan: string,
    metier: string
  ) {
    let chiffres = (tel || "").replace(/\D/g, "");
    if (chiffres.length === 10 && chiffres.startsWith("0")) {
      chiffres = "225" + chiffres;
    } else if (chiffres.startsWith("00225")) {
      chiffres = chiffres.slice(2);
    }
    const texte = encodeURIComponent(
      `🚨 URGENCE BARA Abidjan : Bonjour ${nomArtisan}, j'ai besoin d'un ${metier} en urgence. Êtes-vous disponible pour intervenir rapidement ?`
    );
    return `https://wa.me{chiffres}?text=${texte}`;
  }

  const artisansUrgenceFiltres = artisansDispos.filter((a) => {
    const matchMetier =
      urgenceChoisie === "Tous" ||
      (a.metier || "").toLowerCase() === urgenceChoisie.toLowerCase();

    const matchCommune =
      communeChoisie === "Toutes" ||
      (a.commune || "").toLowerCase() === communeChoisie.toLowerCase();

    return matchMetier && matchCommune;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-md">
        <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full">
          🚨 DÉPANNAGE RAPIDE • ABIDJAN 24H/7J
        </span>
        <h1 className="text-2xl sm:text-4xl font-black mt-3">
          SOS Urgence Artisan à Abidjan
        </h1>
        <p className="text-red-50 text-xs sm:text-sm mt-2 max-w-2xl">
          Fuite d&apos;eau, coupure électrique, porte bloquée ou climatisation en
          panne ? Contactez immédiatement un artisan disponible dans votre commune.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6">
          {URGENCES_TYPES.map((u) => {
            const actif = urgenceChoisie === u.metier;
            return (
              <button
                key={u.metier}
                type="button"
                onClick={() => setUrgenceChoisie(u.metier)}
                className={`p-3 rounded-2xl text-left transition flex flex-col justify-between ${
                  actif
                    ? "bg-white text-red-700 font-extrabold shadow-md"
                    : "bg-white/15 hover:bg-white/25 text-white font-semibold"
                }`}
              >
                <span className="text-xl mb-1">{u.icone}</span>
                <span className="text-xs leading-tight">{u.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm font-bold text-gray-800">
          {loading
            ? "Recherche des artisans disponibles en urgence..."
            : `🟢 ${artisansUrgenceFiltres.length} artisan(s) disponible(s) immédiatement`}
        </p>

        <select
          value={communeChoisie}
          onChange={(e) => setCommuneChoisie(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white font-medium"
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
        <GrilleArtisansSkeleton count={6} />
      ) : erreurChargement ? (
        <FallbackErreurBara
          titre="Impossible de charger les artisans d'urgence"
          onReessayer={chargerUrgences}
        />
      ) : artisansUrgenceFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-800 font-bold mb-2">
            Aucun artisan disponible trouvé pour ce filtre d&apos;urgence.
          </p>
          <p className="text-xs text-gray-500 mb-5">
            Essayez sur toutes les communes d&apos;Abidjan ou publiez une demande
            urgente visible par tous les artisans.
          </p>
          <Link
            href="/demande"
            className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
          >
            🚨 Poster une demande urgente
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisansUrgenceFiltres.map((artisan) => {
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
                className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    {artisan.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={artisan.avatar_url}
                        alt={artisan.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-red-100 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-lg font-extrabold shrink-0">
                        {initiales}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="bg-green-100 text-green-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                          🟢 Disponible
                        </span>
                        {artisan.verifie && (
                          <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            ✓ Vérifié
                          </span>
                        )}
                      </div>

                      <h2 className="font-bold text-gray-900 text-base truncate">
                        {artisan.name}
                      </h2>
                      <p className="text-red-600 font-bold text-xs">
                        {artisan.metier}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">
                    📍 {artisan.commune || "Abidjan"}
                    {artisan.quartier ? ` (${artisan.quartier})` : ""}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/artisans/${artisan.id}`}
                    className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    Profil
                  </Link>

                  {utilisateurConnecte ? (
                    artisan.telephone && (
                      <a
                        href={genererWhatsAppUrgent(
                          artisan.telephone,
                          artisan.name,
                          artisan.metier
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0"
                      >
                        🚨 SOS WhatsApp
                      </a>
                    )
                  ) : (
                    <Link
                      href="/auth/login"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition shrink-0"
                    >
                      🔒 Contact urgent
                    </Link>
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
