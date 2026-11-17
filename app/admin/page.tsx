"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "cv2tcv2t@gmail.com";

interface ArtisanAdmin {
  id: number;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  verifie: boolean | null;
}

interface AvisAdmin {
  id: number;
  created_at: string;
  artisan_id: number;
  auteur: string;
  note: number;
  commentaire: string | null;
}

interface MessageContact {
  id: number;
  created_at: string;
  nom: string;
  contact: string;
  message: string;
}

interface BanniereAdmin {
  id: number;
  titre: string;
  image_url: string;
  lien_url: string;
  emplacement: string;
  actif: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState<
    "artisans" | "avis" | "messages" | "bannieres"
  >("messages");

  const [artisans, setArtisans] = useState<ArtisanAdmin[]>([]);
  const [avis, setAvis] = useState<AvisAdmin[]>([]);
  const [messages, setMessages] = useState<MessageContact[]>([]);
  const [bannieres, setBannieres] = useState<BanniereAdmin[]>([]);

  useEffect(() => {
    async function verifierEtCharger() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.replace("/");
        return;
      }

      setAutorise(true);

      const [resArtisans, resAvis, resMessages, resBannieres] =
        await Promise.all([
          supabase
            .from("artisans")
            .select("id, name, metier, commune, quartier, telephone, verifie")
            .order("created_at", { ascending: false }),
          supabase
            .from("avis")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("messages_contact")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("bannieres")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (resArtisans.data) setArtisans(resArtisans.data);
      if (resAvis.data) setAvis(resAvis.data);
      if (resMessages.data) setMessages(resMessages.data);
      if (resBannieres.data) setBannieres(resBannieres.data);

      setLoading(false);
    }

    verifierEtCharger();
  }, [router]);

  async function basculerVerification(id: number, etatActuel: boolean | null) {
    const nouvelEtat = !etatActuel;
    const { error } = await supabase
      .from("artisans")
      .update({ verifie: nouvelEtat })
      .eq("id", id);

    if (!error) {
      setArtisans((prev) =>
        prev.map((a) => (a.id === id ? { ...a, verifie: nouvelEtat } : a))
      );
    }
  }

  async function supprimerArtisan(id: number, nom: string) {
    if (!confirm(`Supprimer définitivement la fiche de "${nom}" ?`)) return;
    const { error } = await supabase.from("artisans").delete().eq("id", id);
    if (!error) {
      setArtisans((prev) => prev.filter((a) => a.id !== id));
    }
  }

  async function supprimerAvis(id: number) {
    if (!confirm("Supprimer cet avis ?")) return;
    const { error } = await supabase.from("avis").delete().eq("id", id);
    if (!error) {
      setAvis((prev) => prev.filter((a) => a.id !== id));
    }
  }

  async function supprimerMessage(id: number) {
    if (!confirm("Supprimer ce message de contact ?")) return;
    const { error } = await supabase
      .from("messages_contact")
      .delete()
      .eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  }

  async function basculerBanniere(id: number, actifActuel: boolean) {
    const nouvelEtat = !actifActuel;
    const { error } = await supabase
      .from("bannieres")
      .update({ actif: nouvelEtat })
      .eq("id", id);
    if (!error) {
      setBannieres((prev) =>
        prev.map((b) => (b.id === id ? { ...b, actif: nouvelEtat } : b))
      );
    }
  }

  function genererLienReponseContact(nom: string, contact: string) {
    const valeur = (contact || "").trim();
    const sujet = encodeURIComponent("Réponse de l'équipe BARA Abidjan");
    const corpsMail = encodeURIComponent(
      `Bonjour ${nom},\n\nMerci pour votre message sur BARA.\n\nCordialement,\nL'équipe BARA Abidjan`
    );

    if (valeur.includes("@")) {
      return {
        type: "email" as const,
        url: `https://google.com{encodeURIComponent(
          valeur
        )}&su=${sujet}&body=${corpsMail}`,
      };
    }

    let chiffres = valeur.replace(/\D/g, "");
    if (chiffres.length === 10 && chiffres.startsWith("0")) {
      chiffres = `225${chiffres}`;
    } else if (chiffres.startsWith("00225")) {
      chiffres = chiffres.slice(2);
    }

    const texteWhatsApp = encodeURIComponent(
      `Bonjour ${nom}, merci pour votre message sur BARA Abidjan.`
    );

    return {
      type: "whatsapp" as const,
      url: `https://whatsapp.com{chiffres}&text=${texteWhatsApp}`,
    };
  }
  if (loading || !autorise) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-500">
        Vérification de l&apos;accès administrateur...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
          Administration BARA
        </span>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
      </div>

      {/* Onglets de navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        <button
          onClick={() => setOnglet("messages")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            onglet === "messages"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📩 Messages ({messages.length})
        </button>
        <button
          onClick={() => setOnglet("artisans")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            onglet === "artisans"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🛠️ Artisans ({artisans.length})
        </button>
        <button
          onClick={() => setOnglet("avis")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            onglet === "avis"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ★ Avis ({avis.length})
        </button>
        <button
          onClick={() => setOnglet("bannieres")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            onglet === "bannieres"
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📢 Bannières ({bannieres.length})
        </button>
      </div>

      {/* Onglet 1 : Messages de contact avec réponse directe */}
      {onglet === "messages" && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              Aucun message reçu pour le moment.
            </p>
          ) : (
            messages.map((msg) => {
              const reponse = genererLienReponseContact(msg.nom, msg.contact);
              return (
                <div
                  key={msg.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-bold text-gray-900">{msg.nom}</h2>
                      <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2.5 py-0.5 rounded-full">
                        {msg.contact}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-2 whitespace-pre-line">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={reponse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition ${
                        reponse.type === "email"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {reponse.type === "email"
                        ? "✉️ Répondre par e-mail"
                        : "💬 Répondre sur WhatsApp"}
                    </a>

                    <button
                      onClick={() => supprimerMessage(msg.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Onglet 2 : Artisans */}
      {onglet === "artisans" && (
        <div className="space-y-3">
          {artisans.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h2 className="font-bold text-gray-900">{art.name}</h2>
                <p className="text-xs text-gray-600">
                  {art.metier} • 📍 {art.commune || "Abidjan"}
                  {art.quartier ? ` (${art.quartier})` : ""} •{" "}
                  {art.telephone || "Sans numéro"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => basculerVerification(art.id, art.verifie)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    art.verifie
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {art.verifie ? "✓ Vérifié" : "Valider le badge"}
                </button>
                <button
                  onClick={() => supprimerArtisan(art.id, art.name)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onglet 3 : Avis */}
      {onglet === "avis" && (
        <div className="space-y-3">
          {avis.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-sm text-gray-900">
                  {item.auteur} •{" "}
                  <span className="text-yellow-600">★ {item.note}/5</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {item.commentaire || "Sans commentaire"}
                </p>
              </div>
              <button
                onClick={() => supprimerAvis(item.id)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 shrink-0"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Onglet 4 : Bannières */}
      {onglet === "bannieres" && (
        <div className="space-y-3">
          {bannieres.map((ban) => (
            <div
              key={ban.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-sm text-gray-900">{ban.titre}</p>
                <p className="text-xs text-gray-500">
                  Emplacement : {ban.emplacement} • Lien : {ban.lien_url}
                </p>
              </div>
              <button
                onClick={() => basculerBanniere(ban.id, ban.actif)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  ban.actif
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {ban.actif ? "Active" : "Désactivée"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
