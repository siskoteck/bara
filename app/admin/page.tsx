"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ChangerMotDePasse } from "@/components/ChangerMotDePasse";
import { AdminBannieresTab } from "@/components/admin/AdminBannieresTab";

const EMAIL_ADMIN =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "cv2tcv2t@gmail.com";

interface ArtisanAdmin {
  id: string;
  name: string;
  metier: string;
  commune: string | null;
  telephone: string | null;
  verifie: boolean | null;
  disponible: boolean | null;
  recommandations?: number;
  created_at?: string;
}

interface DemandeAdmin {
  id: string;
  created_at: string;
  nom: string;
  telephone: string;
  metier: string;
  commune: string;
  description: string;
}

interface MessageAdmin {
  id: string;
  created_at: string;
  nom: string;
  email: string;
  sujet?: string;
  message: string;
}

interface BanniereAdmin {
  id: string | number;
  created_at?: string;
  titre: string;
  description?: string | null;
  image_url?: string | null;
  lien?: string | null;
  actif: boolean;
}
export default function AdminPage() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState<
    "artisans" | "demandes" | "messages" | "bannieres"
  >("artisans");

  const [artisans, setArtisans] = useState<ArtisanAdmin[]>([]);
  const [demandes, setDemandes] = useState<DemandeAdmin[]>([]);
  const [messages, setMessages] = useState<MessageAdmin[]>([]);
  const [bannieres, setBannieres] = useState<BanniereAdmin[]>([]);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    async function verifierEtCharger() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user || user.email?.toLowerCase() !== EMAIL_ADMIN.toLowerCase()) {
        router.replace("/auth/login");
        return;
      }

      setAutorise(true);

      const [resArtisans, resDemandes, resMessages, resBannieres] =
        await Promise.all([
          supabase
            .from("artisans")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("demandes")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("bannieres")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (resArtisans.data) setArtisans(resArtisans.data as ArtisanAdmin[]);
      if (resDemandes.data) setDemandes(resDemandes.data as DemandeAdmin[]);
      if (resMessages.data) setMessages(resMessages.data as MessageAdmin[]);
      if (resBannieres.data) setBannieres(resBannieres.data as BanniereAdmin[]);
      setLoading(false);
    }

    verifierEtCharger();
  }, [router]);

  async function toggleBadgeVerifie(id: string, statutActuel: boolean | null) {
    const nouveauStatut = !statutActuel;
    const { error } = await supabase
      .from("artisans")
      .update({ verifie: nouveauStatut })
      .eq("id", id);

    if (!error) {
      setArtisans((prev) =>
        prev.map((a) => (a.id === id ? { ...a, verifie: nouveauStatut } : a))
      );
    }
  }

  async function supprimerArtisan(id: string, nom: string) {
    if (!confirm(`Supprimer définitivement la fiche de ${nom} ?`)) return;
    const { error } = await supabase.from("artisans").delete().eq("id", id);
    if (!error) {
      setArtisans((prev) => prev.filter((a) => a.id !== id));
    }
  }

  async function supprimerDemande(id: string) {
    if (!confirm("Supprimer cette demande client ?")) return;
    const { error } = await supabase.from("demandes").delete().eq("id", id);
    if (!error) {
      setDemandes((prev) => prev.filter((d) => d.id !== id));
    }
  }
  if (loading || !autorise) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">
        Vérification des accès administrateur...
      </div>
    );
  }

  const artisansFiltres = artisans.filter((a) => {
    const q = recherche.trim().toLowerCase();
    if (!q) return true;
    return (
      (a.name || "").toLowerCase().includes(q) ||
      (a.metier || "").toLowerCase().includes(q) ||
      (a.commune || "").toLowerCase().includes(q) ||
      (a.telephone || "").includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="bg-orange-100 text-orange-800 text-xs font-extrabold px-3 py-1 rounded-full">
          ADMINISTRATION BARA ABIDJAN
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
          Tableau de bord Administrateur
        </h1>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Artisans
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">
            {artisans.length}
          </p>
          <p className="text-xs text-green-700 font-medium mt-1">
            dont {artisans.filter((a) => a.verifie).length} vérifié(s)
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Demandes
          </p>
          <p className="text-3xl font-extrabold text-orange-600 mt-1">
            {demandes.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Messages
          </p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">
            {messages.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Bannières
          </p>
          <p className="text-3xl font-extrabold text-purple-600 mt-1">
            {bannieres.length}
          </p>
          <p className="text-xs text-purple-700 font-medium mt-1">
            dont {bannieres.filter((b) => b.actif).length} active(s)
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setOnglet("artisans")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            onglet === "artisans"
              ? "bg-orange-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          🛠️ Artisans ({artisans.length})
        </button>

        <button
          type="button"
          onClick={() => setOnglet("demandes")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            onglet === "demandes"
              ? "bg-orange-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          📋 Demandes ({demandes.length})
        </button>

        <button
          type="button"
          onClick={() => setOnglet("messages")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            onglet === "messages"
              ? "bg-orange-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          ✉️ Messages ({messages.length})
        </button>

        <button
          type="button"
          onClick={() => setOnglet("bannieres")}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            onglet === "bannieres"
              ? "bg-orange-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          📢 Bannières ({bannieres.length})
        </button>
      </div>
      {onglet === "artisans" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-4">
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Filtrer par nom, métier, commune ou téléphone..."
              className="w-full sm:w-96 border border-gray-300 rounded-xl px-4 py-2 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="py-3 px-2">Artisan</th>
                  <th className="py-3 px-2">Métier & Zone</th>
                  <th className="py-3 px-2">Téléphone</th>
                  <th className="py-3 px-2">Statut Badge</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artisansFiltres.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="py-3 px-2 font-bold text-gray-900">
                      {a.name}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-orange-600 font-semibold">
                        {a.metier}
                      </span>{" "}
                      • {a.commune || "Abidjan"}
                    </td>
                    <td className="py-3 px-2 text-gray-700">
                      {a.telephone || "—"}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() => toggleBadgeVerifie(a.id, a.verifie)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                          a.verifie
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-800"
                        }`}
                      >
                        {a.verifie ? "✓ Vérifié (Retirer)" : "Activer ✓ Vérifié"}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => supprimerArtisan(a.id, a.name)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {onglet === "demandes" && (
        <div className="space-y-4">
          {demandes.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune demande client.</p>
          ) : (
            demandes.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                    {d.metier} • {d.commune}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2">
                    {d.nom} ({d.telephone})
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{d.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => supprimerDemande(d.id)}
                  className="text-xs text-red-600 font-semibold hover:underline self-start"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {onglet === "messages" && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun message reçu.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-gray-900">
                    {m.nom} ({m.email})
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(m.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{m.message}</p>
              </div>
            ))
          )}
        </div>
      )}
      {onglet === "bannieres" && (
        <AdminBannieresTab bannieres={bannieres} setBannieres={setBannieres} />
      )}

      <ChangerMotDePasse />
    </div>
  );
}
