"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  MessageCircle,
  Siren,
  ShieldAlert,
  Flame,
  HeartPulse,
  Zap,
  Droplets,
} from "lucide-react";
import { COMMUNES } from "@/lib/constantes";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import type { Artisan } from "@/lib/types";

const NUMEROS_URGENCE_OFFICIELS = [
  { service: "Police Secours", numero: "110", detail: "Urgence sécurité 24/7", Icone: ShieldAlert },
  { service: "Sapeurs-Pompiers (GSPM)", numero: "180", detail: "Incendie & secours", Icone: Flame },
  { service: "SAMU Abidjan", numero: "185", detail: "Urgence médicale", Icone: HeartPulse },
  { service: "CIE Dépannage", numero: "179", detail: "Coupure & danger électrique", Icone: Zap },
  { service: "SODECI Dépannage", numero: "175", detail: "Fuite réseau & eau", Icone: Droplets },
];

const METIERS_URGENCE = [
  "Tous", "Plombier", "Électricien", "Climatisation / Froid", "Serrurier", "Mécanicien auto",
];

export function SosUrgenceClient({ artisansInitiaux }: { artisansInitiaux: Artisan[] }) {
  const [commune, setCommune] = useState("Toutes");
  const [metier, setMetier] = useState("Tous");

  const artisansUrgence = artisansInitiaux.filter((a) => {
    const matchCommune = commune === "Toutes" || (a.commune || "").toLowerCase() === commune.toLowerCase();
    const matchMetier = metier === "Tous" || (a.metier || "").toLowerCase().includes(metier.toLowerCase());
    return matchCommune && matchMetier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-xs font-extrabold px-3 py-1 rounded-full mb-2">
          <Siren className="w-4 h-4" />
          <span>DÉPANNAGE RAPIDE À ABIDJAN</span>
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          SOS Urgence Artisan — Intervention immédiate
        </h1>
        <p className="text-red-100 text-xs sm:text-sm mt-2 max-w-2xl">
          Fuite d&apos;eau, coupure électrique, panne de climatisation ou porte bloquée : contactez directement un artisan disponible près de chez vous sur WhatsApp.
            </p>
          </div>
          <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-green-600 text-white font-black text-sm sm:text-base px-6 py-4 rounded-2xl shadow-lg transition shrink-0">
            <MessageCircle className="w-6 h-6" />
            <span>SOS WhatsApp BARA Direct</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-2xl">
          <select aria-label="Choisir la commune d'intervention" value={commune} onChange={(e) => setCommune(e.target.value)} className="bg-white text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold">
            <option value="Toutes">Toutes les communes d&apos;Abidjan</option>
            {COMMUNES.map((c: string) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <select aria-label="Type de dépannage urgent" value={metier} onChange={(e) => setMetier(e.target.value)} className="bg-white text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold">
            {METIERS_URGENCE.map((m) => (<option key={m} value={m}>{m === "Tous" ? "Tous les dépannages urgents" : m}</option>))}
          </select>
        </div>
      </div>

      <section aria-label="Numéros d'urgence officiels en Côte d'Ivoire" className="bg-white rounded-3xl border border-red-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-600" />
            <span>Numéros d&apos;urgence officiels (Côte d&apos;Ivoire)</span>
          </h2>
          <span className="text-[11px] font-semibold text-gray-500">Appuyez sur un numéro pour appeler immédiatement</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {NUMEROS_URGENCE_OFFICIELS.map(({ service, numero, detail, Icone }) => (
            <a key={numero} href={`tel:${numero}`} className="group border border-gray-200 hover:border-red-500 bg-gray-50 hover:bg-red-50 rounded-2xl p-3.5 transition flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-1">
                <Icone className="w-4 h-4 text-red-600" />
                <span className="text-xl font-black text-red-700">{numero}</span>
              </div>
              <p className="text-xs font-extrabold text-gray-900">{service}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{detail}</p>
            </a>
          ))}
        </div>
      </section>

      {artisansUrgence.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
          <p className="text-lg font-extrabold text-gray-900 mb-2">Aucun artisan disponible trouvé pour ce filtre précis</p>
          <p className="text-sm text-gray-600 mb-6">Élargissez à toutes les communes d&apos;Abidjan ou publiez une demande urgente.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => { setCommune("Toutes"); setMetier("Tous"); }} className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl">Afficher tout Abidjan</button>
            <Link href="/demande" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl">Poster une demande urgente</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisansUrgence.map((artisan) => (<ArtisanCard key={artisan.id} artisan={artisan} urgence />))}
        </div>
      )}
    </div>
  );
}