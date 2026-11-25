"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SupprimerCompteButton } from "@/components/SupprimerCompteButton";

interface Demande {
  id: number;
  created_at: string;
  user_id: string | null;
  titre: string;
  metier: string;
  commune: string;
  quartier?: string | null;
  description: string;
  telephone: string;
  budget: string | null;
  photos?: string[] | null;
  audio_url?: string | null;
  statut: string;
}

export default function MesDemandesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [estArtisan, setEstArtisan] = useState(false);
  const [metierArtisan, setMetierArtisan] = useState<string | null>(null);
  const [communeArtisan, setCommuneArtisan] = useState<string | null>(null);
  const [mesDemandes, setMesDemandes] = useState<Demande[]>([]);
  const [demandesClients, setDemandesClients] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerDonnees() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      setUserId(user.id);

      const { data: perso } = await supabase
        .from("demandes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (perso) {
        setMesDemandes(perso as Demande[]);
      }

      const { data: ficheArtisan } = await supabase
        .from("artisans")
        .select("metier, commune")
        .eq("user_id", user.id)
        .maybeSingle();

      if (ficheArtisan && ficheArtisan.metier) {
        setEstArtisan(true);
        setMetierArtisan(ficheArtisan.metier);
        setCommuneArtisan(ficheArtisan.commune);

        const { data: opportunités } = await supabase
          .from("demandes")
          .select("*")
          .eq("metier", ficheArtisan.metier)
          .eq("statut", "ouverte")
          .order("created_at", { ascending: false });

        if (opportunités) {
          setDemandesClients(
            (opportunités as Demande[]).filter((d) => d.user_id !== user.id)
          );
        }
      }

      setLoading(false);
    }

    chargerDonnees();
  }, [router]);
  async function cloturerDemande(id: number) {
    if (!userId) return;

    const { error } = await supabase
      .from("demandes")
      .update({ statut: "terminee" })
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      setMesDemandes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, statut: "terminee" } : d))
      );
    }
  }

  function genererLienWhatsAppClient(demande: Demande) {
    let chiffres = (demande.telephone || "").replace(/\D/g, "");
    if (chiffres.length === 10 && chiffres.startsWith("0")) {
      chiffres = "225" + chiffres;
    } else if (chiffres.startsWith("00225")) {
      chiffres = chiffres.slice(2);
    }

    const lieu = demande.quartier
      ? `${demande.commune} (${demande.quartier})`
      : demande.commune;
    const texte = `Bonjour, je suis artisan (${demande.metier}) sur BARA. J'ai vu votre demande à ${lieu} et je suis disponible pour intervenir.`;

    return "https://wa.me/" + chiffres + "?text=" + encodeURIComponent(texte);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        Chargement de votre espace...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Section Artisan : Demandes de clients */}
      {estArtisan && (
        <section>
          <div className="mb-6">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              Espace Artisan • {metierArtisan}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Demandes de clients à Abidjan ({demandesClients.length})
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Contactez directement les clients qui recherchent un{" "}
              <strong>{metierArtisan}</strong>.
            </p>
          </div>

          {demandesClients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              Aucune demande ouverte pour le métier{" "}
              <strong>{metierArtisan}</strong> pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {demandesClients.map((demande) => {
                const memeCommune =
                  communeArtisan && demande.commune === communeArtisan;

                return (
                  <div
                    key={demande.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                          📍 {demande.commune}
                          {demande.quartier ? ` (${demande.quartier})` : ""}
                        </span>

                        {memeCommune && (
                          <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Dans votre commune
                          </span>
                        )}

                        {demande.budget && (
                          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                            Budget : {demande.budget}
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-gray-400">
                        {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    <p className="text-gray-800 text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {demande.description}
                    </p>

                    {/* Note vocale du client */}
                    {demande.audio_url && (
                      <div className="mb-4 bg-orange-50/60 border border-orange-200 p-3 rounded-xl">
                        <p className="text-xs font-semibold text-orange-900 mb-1.5">
                          🎙️ Note vocale du client :
                        </p>
                        <audio
                          controls
                          src={demande.audio_url}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {/* Photos de la panne */}
                    {demande.photos && demande.photos.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-5">
                        {demande.photos.map((photoUrl, idx) => (
                          <a
                            key={photoUrl + idx}
                            href={photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Cliquer pour agrandir la photo"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photoUrl}
                              alt={`Photo panne ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                      <a
                        href={genererLienWhatsAppClient(demande)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                      >
                        💬 Répondre sur WhatsApp
                      </a>
                      <a
                        href={`tel:${demande.telephone.replace(/\s+/g, "")}`}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                      >
                        📞 Appeler ({demande.telephone})
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
      {/* Section Particulier : Mes propres demandes envoyées */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Mes demandes envoyées ({mesDemandes.length})
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Suivez l&apos;état de vos besoins postés sur BARA.
            </p>
          </div>

          <Link
            href="/demande"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition text-center shrink-0"
          >
            + Nouvelle demande
          </Link>
        </div>

        {mesDemandes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-600 mb-5">
              Vous n&apos;avez pas encore posté de demande de travaux ou dépannage.
            </p>
            <Link
              href="/demande"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700"
            >
              Poster une demande gratuitement
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mesDemandes.map((demande) => (
              <div
                key={demande.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">
                      {demande.metier} • {demande.commune}
                      {demande.quartier ? ` (${demande.quartier})` : ""}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        demande.statut === "ouverte"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {demande.statut === "ouverte" ? "Ouverte" : "Terminée"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {demande.description}
                  </p>

                  {demande.audio_url && (
                    <div className="mt-3 max-w-md">
                      <audio
                        controls
                        src={demande.audio_url}
                        className="w-full h-8"
                      />
                    </div>
                  )}

                  {demande.photos && demande.photos.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {demande.photos.map((photoUrl, idx) => (
                        <a
                          key={photoUrl + idx}
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt={`Ma photo ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {demande.statut === "ouverte" && (
                  <button
                    onClick={() => cloturerDemande(demande.id)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
                  >
                    ✓ Marquer comme résolue
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <SupprimerCompteButton />
    </div>
  );
}
