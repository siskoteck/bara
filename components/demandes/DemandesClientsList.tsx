"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Wrench, Calendar, MessageCircle, Volume2, Wallet } from "lucide-react";
import { genererLienWhatsApp } from "@/lib/whatsapp";

export interface DemandeClientItem {
  id: string;
  titre?: string | null;
  metier: string | null;
  commune: string | null;
  quartier?: string | null;
  description: string | null;
  telephone?: string | null;
  budget?: string | null;
  photos?: string[] | null;
  audio_url?: string | null;
  created_at: string;
}

export function DemandesClientsList({
  demandesInitiales,
}: {
  demandesInitiales: DemandeClientItem[];
}) {
  const [filtreMetier, setFiltreMetier] = useState("");
  const [filtreCommune, setFiltreCommune] = useState("");

  const metiers = useMemo(
    () =>
      Array.from(
        new Set(demandesInitiales.map((d) => d.metier).filter(Boolean))
      ) as string[],
    [demandesInitiales]
  );

  const communes = useMemo(
    () =>
      Array.from(
        new Set(demandesInitiales.map((d) => d.commune).filter(Boolean))
      ) as string[],
    [demandesInitiales]
  );

  const visibles = demandesInitiales.filter(
    (d) =>
      (!filtreMetier || d.metier === filtreMetier) &&
      (!filtreCommune || d.commune === filtreCommune)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block bg-orange-100 text-orange-800 text-xs font-extrabold px-3 py-1 rounded-full mb-2">
            ESPACE ARTISANS • ABIDJAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Demandes de travaux en cours ({visibles.length})
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Contactez directement les clients d&apos;Abidjan sur WhatsApp pour proposer votre devis.
          </p>
        </div>

        <Link
          href="/demande"
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition shadow-xs"
        >
          + Publier un besoin
        </Link>
      </div>

      {/* Filtres rapides */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-xs">
        <select
          aria-label="Filtrer par métier"
          value={filtreMetier}
          onChange={(e) => setFiltreMetier(e.target.value)}
          className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white"
        >
          <option value="">Tous les métiers</option>
          {metiers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrer par commune"
          value={filtreCommune}
          onChange={(e) => setFiltreCommune(e.target.value)}
          className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white"
        >
          <option value="">Toutes les communes</option>
          {communes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {visibles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center space-y-3">
          <p className="text-lg font-extrabold text-gray-900">
            Aucune demande disponible pour ce filtre
          </p>
          <p className="text-sm text-gray-600">
            Réinitialisez les filtres pour afficher l&apos;ensemble des chantiers à Abidjan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibles.map((demande) => {
            const dateStr = new Date(demande.created_at).toLocaleDateString(
              "fr-FR",
              { day: "numeric", month: "short" }
            );
            const lienWa = demande.telephone
              ? genererLienWhatsApp(demande.telephone, "Client BARA")
              : "";

            return (
              <article
                key={demande.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{demande.metier || "Travaux"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-700 shrink-0" />
                    <span>
                      {demande.commune || "Abidjan"}
                      {demande.quartier ? ` (${demande.quartier})` : ""}
                    </span>
                    {demande.budget && (
                      <span className="inline-flex items-center gap-1 ml-2 text-emerald-700 font-bold">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>{demande.budget}</span>
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-gray-800 leading-relaxed">
                    {demande.description}
                  </p>

                  {demande.audio_url && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-orange-700 shrink-0" />
                      <audio controls src={demande.audio_url} className="w-full h-8" />
                    </div>
                  )}

                  {Array.isArray(demande.photos) && demande.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-1">
                      {demande.photos.map((url, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={url}
                          alt={`Photo besoin ${i + 1}`}
                          className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {lienWa && (
                  <div className="pt-3 border-t border-gray-100">
                    <a
                      href={lienWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contacter le client sur WhatsApp</span>
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}