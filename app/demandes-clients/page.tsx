"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Demande = {
  id: number;
  created_at: string;
  titre: string | null;
  metier: string | null;
  categorie: string | null;
  commune: string | null;
  quartier: string | null;
  description: string | null;
  budget: string | null;
  statut: string | null;
  telephone: string | null;
};

function lienWhatsApp(demande: Demande) {
  if (!demande.telephone) return null;
  let chiffres = demande.telephone.replace(/\D/g, "");
  if (chiffres.length === 10) chiffres = "225" + chiffres;
  const message = `Bonjour, je suis artisan sur BARA. J'ai vu votre demande « ${
    demande.titre ?? demande.metier ?? "travaux"
  } » et je peux vous aider.`;
  return `https://whatsapp.com"fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function DemandesClientsPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [connecte, setConnecte] = useState(true);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [filtreMetier, setFiltreMetier] = useState("");
  const [filtreCommune, setFiltreCommune] = useState("");

  useEffect(() => {
    async function charger() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setConnecte(false);
        setChargement(false);
        return;
      }

      const { data, error } = await supabase.rpc("demandes_pour_artisans");
      if (error) {
        console.error(error);
        setErreur("Impossible de charger les demandes pour le moment.");
      } else {
        setDemandes((data as Demande[]) ?? []);
      }
      setChargement(false);
    }
    charger();
  }, []);

  const metiers = useMemo(
    () => Array.from(new Set(demandes.map((d) => d.metier).filter(Boolean))) as string[],
    [demandes]
  );
  const communes = useMemo(
    () => Array.from(new Set(demandes.map((d) => d.commune).filter(Boolean))) as string[],
    [demandes]
  );

  const visibles = demandes.filter(
    (d) =>
      (!filtreMetier || d.metier === filtreMetier) &&
      (!filtreCommune || d.commune === filtreCommune)
  );

  const contactsMasques = demandes.length > 0 && demandes.every((d) => !d.telephone);

  if (chargement) {
    return <p className="text-center text-gray-600 py-16">Chargement…</p>;
  }

  if (!connecte) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <p className="text-gray-700 mb-4">Connectez-vous pour voir les demandes de clients.</p>
        <Link
          href="/auth/login"
          className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-700"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Demandes de clients</h1>
      <p className="text-gray-600 mb-6">
        Les besoins postés par les particuliers à Abidjan.
      </p>

      {contactsMasques && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm p-3 rounded-lg mb-6">
          Les numéros des clients sont visibles uniquement pour les artisans dont le profil est
          vérifié. <Link href="/contact" className="underline font-medium">Contactez-nous</Link>{" "}
          pour faire vérifier le vôtre.
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filtreMetier}
          onChange={(e) => setFiltreMetier(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tous les métiers</option>
          {metiers.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={filtreCommune}
          onChange={(e) => setFiltreCommune(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toutes les communes</option>
          {communes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {erreur && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-6">{erreur}</div>
      )}

      {!erreur && visibles.length === 0 && (
        <p className="text-gray-600 py-8 text-center">
          Aucune demande à afficher pour le moment. Cette page est réservée aux artisans.
        </p>
      )}

      <div className="space-y-4">
        {visibles.map((d) => {
          const whatsapp = lienWhatsApp(d);
          return (
            <div key={d.id} className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {d.metier && (
                  <span className="text-xs font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                    {d.metier}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  📍 {[d.quartier, d.commune].filter(Boolean).join(", ") || "Abidjan"}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{dateCourte(d.created_at)}</span>
              </div>

              <h2 className="font-semibold text-lg">{d.titre ?? "Demande de travaux"}</h2>
              {d.description && (
                <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">{d.description}</p>
              )}
              {d.budget && (
                <p className="text-sm text-gray-600 mt-2">💰 Budget : {d.budget}</p>
              )}

              <div className="mt-4">
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Contacter sur WhatsApp
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">Contact réservé aux profils vérifiés</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}