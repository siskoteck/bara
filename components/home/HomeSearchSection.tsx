"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Droplets, Zap, Snowflake, Hammer, BrickWall, Paintbrush,
  Grid2x2, Car, Search, MapPin, ShieldCheck, Camera,
  MessageSquareHeart, Wrench, ArrowRight,
} from "lucide-react";
import { METIERS, COMMUNES } from "@/lib/constantes";

const CATEGORIES_POPULAIRES = [
  { nom: "Plombier", Icone: Droplets, desc: "Fuites, robinetterie, sanitaires" },
  { nom: "Électricien", Icone: Zap, desc: "Pannes, tableaux, éclairage" },
  { nom: "Climatisation / Froid", Icone: Snowflake, desc: "Entretien split, gaz, frigo" },
  { nom: "Menuisier bois", Icone: Hammer, desc: "Portes, placards, meubles" },
  { nom: "Maçon", Icone: BrickWall, desc: "Construction, rénovation, dalles" },
  { nom: "Peintre en bâtiment", Icone: Paintbrush, desc: "Intérieur, façade, décoration" },
  { nom: "Carreleur", Icone: Grid2x2, desc: "Pose sol, mur, salle de bain" },
  { nom: "Mécanicien auto", Icone: Car, desc: "Diagnostic, entretien auto" },
];

export interface StatsReellesBara {
  artisansVerifies: number;
  photosRealisations: number;
  avisClients: number;
}
export function HomeSearchSection({ stats }: { stats: StatsReellesBara }) {
  const router = useRouter();
  const [metierChoisi, setMetierChoisi] = useState("");
  const [communeChoisie, setCommuneChoisie] = useState("");

  function lancerRecherche(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (metierChoisi) params.set("metier", metierChoisi);
    if (communeChoisie) params.set("commune", communeChoisie);
    const query = params.toString();
    router.push(query ? `/artisans?${query}` : "/artisans");
  }

  const aDesStatsReelles =
    stats.artisansVerifies > 0 || stats.photosRealisations > 0 || stats.avisClients > 0;

  return (
    <>
      <section className="bg-gradient-to-br from-orange-600 via-orange-600 to-amber-600 text-white pt-10 pb-14 sm:pt-16 sm:pb-20">
        <div className="animate-bara-fade-up max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-extrabold px-3.5 py-1 rounded-full mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>DISTRICT D&apos;ABIDJAN • 13 COMMUNES</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight tracking-tight">
            Trouvez un artisan de confiance à Abidjan
          </h1>
          <p className="text-orange-50 text-base sm:text-lg mb-7 max-w-2xl mx-auto">
            Plombiers, électriciens, maçons, menuisiers ou frigoristes près de chez vous. Contact direct et gratuit sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 max-w-lg mx-auto">
            <Link href="/artisans" className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-white text-orange-800 hover:bg-orange-50 font-black text-sm px-6 py-3.5 rounded-2xl shadow-md transition">
              <Search className="w-4 h-4" />
              <span>Je cherche un artisan</span>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-md transition">
              <Wrench className="w-4 h-4" />
              <span>Je suis artisan</span>
            </Link>
          </div>
          <form onSubmit={lancerRecherche} className="bg-white p-3 rounded-2xl shadow-xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 text-gray-800">
            <select aria-label="Choisir un métier" value={metierChoisi} onChange={(e) => setMetierChoisi(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white font-medium">
              <option value="">Quel métier recherchez-vous ?</option>
              {METIERS.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
            <select aria-label="Choisir une commune" value={communeChoisie} onChange={(e) => setCommuneChoisie(e.target.value)} className="sm:w-52 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white font-medium">
              <option value="">Toutes les communes</option>
              {COMMUNES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-3 rounded-xl transition shrink-0">
              <Search className="w-4 h-4" />
              <span>Rechercher</span>
            </button>
          </form>
        </div>
      </section>      {aDesStatsReelles && (
        <section className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.artisansVerifies > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                <div>
                  <p className="text-lg font-black text-gray-900">{stats.artisansVerifies} artisan{stats.artisansVerifies > 1 ? "s" : ""} vérifié{stats.artisansVerifies > 1 ? "s" : ""}</p>
                  <p className="text-xs text-gray-600">Identité &amp; WhatsApp contrôlés</p>
                </div>
              </div>
            )}
            {stats.photosRealisations > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0"><Camera className="w-5 h-5" /></div>
                <div>
                  <p className="text-lg font-black text-gray-900">{stats.photosRealisations} photo{stats.photosRealisations > 1 ? "s" : ""} de chantiers</p>
                  <p className="text-xs text-gray-600">Réalisations réelles à Abidjan</p>
                </div>
              </div>
            )}
            {stats.avisClients > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0"><MessageSquareHeart className="w-5 h-5" /></div>
                <div>
                  <p className="text-lg font-black text-gray-900">{stats.avisClients} avis client{stats.avisClients > 1 ? "s" : ""}</p>
                  <p className="text-xs text-gray-600">Retours après intervention</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-gray-600 shrink-0"><MapPin className="w-3.5 h-3.5 text-orange-700" /><span>Communes :</span></span>
          <Link href="/artisans" className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-600 text-white shrink-0">Tout Abidjan</Link>
          {COMMUNES.map((c) => (<Link key={c} href={`/artisans?commune=${encodeURIComponent(c)}`} className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-700 shrink-0 transition">{c}</Link>))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Métiers populaires à Abidjan</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Sélectionnez une spécialité pour voir les artisans disponibles</p>
          </div>
          <Link href="/artisans" className="inline-flex items-center gap-1 text-xs sm:text-sm text-orange-700 font-extrabold hover:underline shrink-0"><span>Tout l&apos;annuaire</span><ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES_POPULAIRES.map(({ nom, Icone, desc }) => (
            <Link key={nom} href={`/artisans?metier=${encodeURIComponent(nom)}`} className="group bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-5 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors"><Icone className="w-6 h-6" /></div>
              <span className="font-extrabold text-sm text-gray-900 group-hover:text-orange-700 transition-colors">{nom}</span>
              <span className="text-[11px] text-gray-600 line-clamp-1">{desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}