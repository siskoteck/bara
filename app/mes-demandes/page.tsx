"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Demande = {
  id: number;
  created_at: string;
  user_id: string;
  titre: string;
  metier: string;
  commune: string;
  description: string;
  telephone: string;
  statut: "ouverte" | "terminee";
};

function lienWhatsApp(telephone: string, message: string): string | null {
  const chiffres = telephone.replace(/\D/g, "");
  if (chiffres.length < 8) return null;
  const numero = chiffres.startsWith("225") ? chiffres : `225${chiffres}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MesDemandesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [nomArtisan, setNomArtisan] = useState<string | null>(null);
  const [estArtisan, setEstArtisan] = useState(false);
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.replace("/auth/login");
        return;
      }
      setUserId(user.id);

      const { data: fiche } = await supabase
        .from("artisans")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fiche) {
        setEstArtisan(true);
        setNomArtisan(fiche.name);
      }

      // La sécurité de la base ne renvoie que : mes demandes + celles de mon métier
      const { data: lignes, error: erreur } = await supabase
        .from("demandes")
        .select("*")
        .order("created_at", { ascending: false });

      if (erreur) {
        console.error("Erreur chargement demandes:", erreur);
        setError("Impossible de charger les demandes.");
      }

      setDemandes((lignes as Demande[]) ?? []);
      setChargement(false);
    }

    charger();
  }, [router]);

  async function terminer(id: number) {
    if (!userId) return;
    setError("");

    const { data, error: updateError } = await supabase
      .from("demandes")
      .update({ statut: "terminee" })
      .eq("id", id)
      .eq("user_id", userId)
      .select("id");

    if (updateError || !data || data.length === 0) {
      console.error("Erreur mise à jour:", updateError);
      setError("Impossible de modifier cette demande.");
      return;
    }

    setDemandes((liste) =>
      liste.map((d) => (d.id === id ? { ...d, statut: "terminee" } : d))
    );
  }

  if (chargement) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-gray-500">Chargement…</div>
    );
  }

  const mesDemandes = demandes.filter((d) => d.user_id === userId);
  const demandesPourMoi = demandes.filter(
    (d) => d.user_id !== userId && d.statut === "ouverte"
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      {/* Mes demandes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Mes demandes</h1>
          <Link
            href="/demande"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
          >
            Nouvelle demande
          </Link>
        </div>

        {mesDemandes.length === 0 ? (
          <p className="text-gray-600">Vous n'avez pas encore posté de demande.</p>
        ) : (
          <div className="space-y-4">
            {mesDemandes.map((d) => (
              <div key={d.id} className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold">{d.titre}</h2>
                  <span
                    className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                      d.statut === "ouverte"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {d.statut === "ouverte" ? "Ouverte" : "Terminée"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {d.metier} · {d.commune} · {formatDate(d.created_at)}
                </p>
                <p className="text-gray-700 mt-3 whitespace-pre-line">{d.description}</p>
                {d.statut === "ouverte" && (
                  <button
                    onClick={() => terminer(d.id)}
                    className="mt-4 text-sm text-orange-600 font-medium hover:underline"
                  >
                    Marquer comme terminée
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Demandes pour les artisans */}
      {estArtisan && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Demandes pour mon métier</h2>

          {demandesPourMoi.length === 0 ? (
            <p className="text-gray-600">Aucune demande ouverte pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {demandesPourMoi.map((d) => {
                const lien = lienWhatsApp(
                  d.telephone,
                  `Bonjour, je suis ${nomArtisan ?? "un artisan"} de BARA. Je vous contacte au sujet de votre demande « ${d.titre} ».`
                );
                return (
                  <div key={d.id} className="bg-white rounded-xl shadow-sm border p-5">
                    <h3 className="font-semibold">{d.titre}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {d.metier} · {d.commune} · {formatDate(d.created_at)}
                    </p>
                    <p className="text-gray-700 mt-3 whitespace-pre-line">
                      {d.description}
                    </p>
                    {lien && (
                      <a
                        href={lien}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
                      >
                        Contacter sur WhatsApp
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}