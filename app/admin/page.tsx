"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Remplacez par l'adresse e-mail de votre compte administrateur
const ADMIN_EMAIL = "cv2tcv2t@gmail.com";

interface ArtisanAdmin {
  id: number;
  name: string;
  metier: string;
  commune: string | null;
  telephone: string | null;
  verifie: boolean | null;
}

interface MessageContact {
  id: number;
  created_at: string;
  nom: string;
  contact: string;
  message: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [loading, setLoading] = useState(true);
  const [artisans, setArtisans] = useState<ArtisanAdmin[]>([]);
  const [messages, setMessages] = useState<MessageContact[]>([]);
  const [onglet, setOnglet] = useState<"artisans" | "messages">("artisans");

  useEffect(() => {
    async function verifierEtCharger() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.replace("/");
        return;
      }

      setAutorise(true);

      // Charger les artisans
      const { data: listeArtisans } = await supabase
        .from("artisans")
        .select("id, name, metier, commune, telephone, verifie")
        .order("id", { ascending: false });

      if (listeArtisans) setArtisans(listeArtisans);

      // Charger les messages de contact
      const { data: listeMessages } = await supabase
        .from("messages_contact")
        .select("*")
        .order("created_at", { ascending: false });

      if (listeMessages) setMessages(listeMessages);

      setLoading(false);
    }

    verifierEtCharger();
  }, [router]);

  async function basculerVerification(artisan: ArtisanAdmin) {
    const nouveauStatut = !artisan.verifie;

    const { error } = await supabase
      .from("artisans")
      .update({ verifie: nouveauStatut })
      .eq("id", artisan.id);

    if (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
      return;
    }

    setArtisans((prev) =>
      prev.map((a) => (a.id === artisan.id ? { ...a, verifie: nouveauStatut } : a))
    );
  }

  async function supprimerMessage(id: number) {
    if (!confirm("Supprimer ce message ?")) return;

    const { error } = await supabase
      .from("messages_contact")
      .delete()
      .eq("id", id);

    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  }

  if (loading || !autorise) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">
        Vérification des accès administrateur...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="inline-block bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
          Administration BARA
        </span>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
      </div>

      {/* Onglets */}
      <div className="flex gap-3 mb-8 border-b border-gray-200 pb-4">
        <button
          onClick={() => setOnglet("artisans")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            onglet === "artisans"
              ? "bg-orange-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Artisans ({artisans.length})
        </button>

        <button
          onClick={() => setOnglet("messages")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            onglet === "messages"
              ? "bg-orange-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Messages contact ({messages.length})
        </button>
      </div>

      {/* Onglet Artisans */}
      {onglet === "artisans" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {artisans.map((artisan) => (
              <div
                key={artisan.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900">{artisan.name}</h2>
                    {artisan.verifie && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {artisan.metier} • {artisan.commune || "Commune non renseignée"} •{" "}
                    {artisan.telephone || "Sans téléphone"}
                  </p>
                </div>

                <button
                  onClick={() => basculerVerification(artisan)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${
                    artisan.verifie
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {artisan.verifie ? "Retirer le badge" : "Valider le profil ✓"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onglet Messages */}
      {onglet === "messages" && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center text-gray-500">
              Aucun message reçu pour le moment.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{msg.nom}</h3>
                    <p className="text-sm text-orange-600 font-medium">
                      {msg.contact}
                    </p>
                  </div>
                  <button
                    onClick={() => supprimerMessage(msg.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
                <p className="text-gray-700 text-sm mt-3 whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
