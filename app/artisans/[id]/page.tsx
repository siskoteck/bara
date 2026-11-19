"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PartageSecuriteProche } from "@/components/PartageSecuriteProche";
import { BoutonRecommander } from "@/components/BoutonRecommander";

interface Artisan {
  id: string;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  description: string | null;
  avatar_url: string | null;
  realisations: string[] | null;
  verifie: boolean | null;
  disponible: boolean | null;
  derniere_activite?: string | null;
  recommandations?: number;
}

interface Avis {
  id: number | string;
  created_at: string;
  auteur: string;
  note: number;
  commentaire: string | null;
}
function ContenuFicheArtisan() {
  const params = useParams();
  const rawId = params?.id;
  const id = decodeURIComponent(
    String(Array.isArray(rawId) ? rawId : rawId ?? "")
  );

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreurChargement, setErreurChargement] = useState("");

  const [auteur, setAuteur] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [envoiAvis, setEnvoiAvis] = useState(false);
  const [messageAvis, setMessageAvis] = useState("");

  useEffect(() => {
    async function chargerFiche() {
      if (!id || id === "undefined" || id === "null") {
        setErreurChargement("Identifiant manquant dans l'adresse URL.");
        setLoading(false);
        return;
      }

      const [resSession, resArtisan, resAvis] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from("artisans").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("avis")
          .select("*")
          .eq("artisan_id", id)
          .order("created_at", { ascending: false }),
      ]);

      setUtilisateurConnecte(Boolean(resSession.data.session?.user));

      if (resArtisan.error) {
        setErreurChargement(resArtisan.error.message);
      } else if (resArtisan.data) {
        setArtisan(resArtisan.data as Artisan);
      }

      if (resAvis.data) setAvis(resAvis.data as Avis[]);
      setLoading(false);
    }

    chargerFiche();
  }, [id]);
  async function handleAjouterAvis(e: React.FormEvent) {
    e.preventDefault();
    if (!artisan || !auteur.trim()) return;

    setEnvoiAvis(true);
    setMessageAvis("");

    const { data, error } = await supabase
      .from("avis")
      .insert([
        {
          artisan_id: artisan.id,
          auteur: auteur.trim(),
          note,
          commentaire: commentaire.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      setMessageAvis("Erreur : " + error.message);
    } else if (data) {
      setAvis((prev) => [data as Avis, ...prev]);
      setAuteur("");
      setCommentaire("");
      setNote(5);
      setMessageAvis("Merci ! Votre avis a bien été publié.");
    }

    setEnvoiAvis(false);
  }

  function genererLienWhatsApp(tel: string | null, nomArtisan: string) {
    let chiffres = (tel || "").replace(/\D/g, "");
    if (chiffres.length === 10 && chiffres.startsWith("0")) {
      chiffres = "225" + chiffres;
    } else if (chiffres.startsWith("00225")) {
      chiffres = chiffres.slice(2);
    }
    const texte = encodeURIComponent(
      "Bonjour " +
        nomArtisan +
        ", j'ai vu votre profil sur BARA Abidjan et j'aimerais vous contacter pour un travail."
    );
    return "https://wa.me" + chiffres + "?text=" + texte;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        Chargement de la fiche artisan...
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Artisan introuvable
        </h1>
        {erreurChargement && (
          <p className="text-xs text-red-600 bg-red-50 inline-block px-3 py-1.5 rounded-lg mb-4">
            Détail technique : {erreurChargement}
          </p>
        )}
        <div>
          <Link
            href="/artisans"
            className="text-orange-600 font-semibold hover:underline"
          >
            ← Retour à l&apos;annuaire
          </Link>
        </div>
      </div>
    );
  }

  const estConnecte = artisan.derniere_activite
    ? Date.now() - new Date(artisan.derniere_activite).getTime() < 15 * 60 * 1000
    : false;

  const moyenneNote =
    avis.length > 0
      ? (avis.reduce((acc, a) => acc + a.note, 0) / avis.length).toFixed(1)
      : null;

  const initiales = artisan.name
    ? artisan.name
        .split(" ")
        .map((n) => n)
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link
        href="/artisans"
        className="inline-block text-sm font-medium text-gray-600 hover:text-orange-600"
      >
        ← Retour aux artisans
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {artisan.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artisan.avatar_url}
              alt={artisan.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-orange-100 shrink-0"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-3xl font-extrabold shrink-0">
              {initiales}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              {artisan.verifie && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  ✓ Profil vérifié
                </span>
              )}

              {estConnecte && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connecté
                </span>
              )}

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  artisan.disponible !== false
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {artisan.disponible !== false
                  ? "🟢 Disponible"
                  : "🟠 Actuellement occupé"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {artisan.name}
            </h1>
            <p className="text-orange-600 font-bold text-base sm:text-lg mt-0.5">
              {artisan.metier}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              📍 {artisan.commune || "Abidjan"}
              {artisan.quartier ? ` (${artisan.quartier})` : ""}
              {moyenneNote && (
                <span className="ml-3 font-semibold text-gray-800">
                  ★ {moyenneNote}/5 ({avis.length} avis)
                </span>
              )}
            </p>

            {/* Zone de contact : visible uniquement si connecté */}
            {utilisateurConnecte ? (
              artisan.telephone && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-5">
                  <a
                    href={genererLienWhatsApp(artisan.telephone, artisan.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition"
                  >
                    💬 Contacter sur WhatsApp
                  </a>
                  <a
                    href={"tel:" + artisan.telephone.replace(/\s+/g, "")}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-3 rounded-xl text-sm transition"
                  >
                    📞 Appeler ({artisan.telephone})
                  </a>
                </div>
              )
            ) : (
              <div className="mt-5 p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  🔒 Numéro et WhatsApp réservés aux membres connectés
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Connectez-vous ou créez un compte gratuit en 30 secondes pour
                  voir le numéro de <strong>{artisan.name}</strong> et le
                  contacter directement.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-3">
                  <Link
                    href="/auth/login"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white hover:bg-orange-100/50 text-orange-700 border border-orange-300 text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Créer un compte gratuit
                  </Link>
                </div>
              </div>
            )}

            <BoutonRecommander
              artisanId={artisan.id}
              commune={artisan.commune}
              compteurInitial={artisan.recommandations ?? 0}
            />
          </div>
        </div>
        <PartageSecuriteProche
          id={artisan.id}
          nom={artisan.name}
          metier={artisan.metier}
          commune={artisan.commune}
          quartier={artisan.quartier}
          telephone={artisan.telephone}
          verifie={artisan.verifie}
          estConnecte={utilisateurConnecte}
        />

        {artisan.description && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              À propos de cet artisan
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {artisan.description}
            </p>
          </div>
        )}

        {artisan.realisations && artisan.realisations.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Photos de ses réalisations ({artisan.realisations.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artisan.realisations.map((photo, index) => (
                <a
                  key={photo + index}
                  href={photo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Réalisation ${index + 1} de ${artisan.name}`}
                    className="w-full h-40 object-cover rounded-2xl border border-gray-200 hover:opacity-90 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Avis des clients ({avis.length})
        </h2>

        <form
          onSubmit={handleAjouterAvis}
          className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-8 space-y-4"
        >
          <h3 className="font-bold text-sm text-gray-900">
            Laisser un avis sur {artisan.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Votre nom *
              </label>
              <input
                type="text"
                required
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                placeholder="Ex: Kouassi Jean"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Note sur 5 *
              </label>
              <select
                value={note}
                onChange={(e) => setNote(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
              >
                <option value={5}>★★★★★ (5/5 - Excellent)</option>
                <option value={4}>★★★★☆ (4/5 - Très bien)</option>
                <option value={3}>★★★☆☆ (3/5 - Correct)</option>
                <option value={2}>★★☆☆☆ (2/5 - Moyen)</option>
                <option value={1}>★☆☆☆☆ (1/5 - Décevant)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Votre commentaire (optionnel)
            </label>
            <textarea
              rows={3}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ponctualité, qualité du travail, tarif..."
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
            />
          </div>

          {messageAvis && (
            <p className="text-xs font-semibold text-green-700">{messageAvis}</p>
          )}

          <button
            type="submit"
            disabled={envoiAvis}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {envoiAvis ? "Publication..." : "Publier mon avis"}
          </button>
        </form>

        {avis.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">
            Aucun avis pour le moment. Soyez le premier à évaluer cet artisan !
          </p>
        ) : (
          <div className="space-y-4">
            {avis.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-100 pb-4 last:border-none"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900">
                    {item.auteur}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-yellow-500 text-xs mb-1">
                  {"★".repeat(item.note)}
                  {"☆".repeat(5 - item.note)}
                </p>
                {item.commentaire && (
                  <p className="text-gray-700 text-sm">{item.commentaire}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FicheArtisanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
          Chargement de la fiche artisan...
        </div>
      }
    >
      <ContenuFicheArtisan />
    </Suspense>
  );
}
