"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PartageSecuriteProche } from "@/components/PartageSecuriteProche";
import { BoutonRecommander } from "@/components/BoutonRecommander";
import {
  ProfilArtisanSkeleton,
  FallbackErreurBara,
} from "@/components/shared/BaraSkeletons";

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
  created_at?: string;
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
  const [similaires, setSimilaires] = useState<Artisan[]>([]);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreurChargement, setErreurChargement] = useState("");
  const [photoZoom, setPhotoZoom] = useState<string | null>(null);
  const [afficherHeaderMobile, setAfficherHeaderMobile] = useState(false);

  const [auteur, setAuteur] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [envoiAvis, setEnvoiAvis] = useState(false);
  const [messageAvis, setMessageAvis] = useState("");

  useEffect(() => {
    function surDefilement() {
      setAfficherHeaderMobile(window.scrollY > 180);
    }
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);
  const chargerFiche = useCallback(async () => {
    if (!id || id === "undefined" || id === "null") {
      setErreurChargement("Identifiant manquant dans l'adresse URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErreurChargement("");

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
      const detail = resArtisan.data as Artisan;
      setArtisan(detail);

      const { data: simData } = await supabase
        .from("artisans")
        .select("*")
        .neq("id", detail.id)
        .or(`metier.eq.${detail.metier},commune.eq.${detail.commune || "Abidjan"}`)
        .order("verifie", { ascending: false })
        .limit(8);

      if (simData) {
        const triees = [...(simData as Artisan[])].sort((a, b) => {
          const scoreA =
            (a.metier === detail.metier ? 2 : 0) +
            (a.commune === detail.commune ? 1 : 0);
          const scoreB =
            (b.metier === detail.metier ? 2 : 0) +
            (b.commune === detail.commune ? 1 : 0);
          return scoreB - scoreA;
        });
        setSimilaires(triees.slice(0, 3));
      }
    }

    if (resAvis.data) setAvis(resAvis.data as Avis[]);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    chargerFiche();
  }, [chargerFiche]);

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
        ", je viens de BARA Abidjan et j'aimerais vous contacter pour un travail."
    );
    return "https://wa.me" + chiffres + "?text=" + texte;
  }
  if (loading) {
    return <ProfilArtisanSkeleton />;
  }

  if (erreurChargement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <FallbackErreurBara
          titre="Impossible de charger la fiche de cet artisan"
          message={erreurChargement}
          onReessayer={chargerFiche}
        />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Artisan introuvable
        </h1>
        <Link
          href="/artisans"
          className="text-orange-600 font-semibold hover:underline"
        >
          ← Retour à l&apos;annuaire
        </Link>
      </div>
    );
  }

  const estConnecte = artisan.derniere_activite
    ? Date.now() - new Date(artisan.derniere_activite).getTime() < 15 * 60 * 1000
    : false;

  const estNouveau = artisan.created_at
    ? Date.now() - new Date(artisan.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
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

  const lienWhatsApp = artisan.telephone
    ? genererLienWhatsApp(artisan.telephone, artisan.name)
    : "";

  return (
    <div className="pb-24 sm:pb-12">
      {/* Header fixe mobile au défilement */}
      {afficherHeaderMobile && (
        <div className="fixed top-0 inset-x-0 z-50 sm:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-2.5 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            {artisan.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artisan.avatar_url}
                alt={artisan.name}
                className="w-9 h-9 rounded-full object-cover border border-orange-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-extrabold shrink-0">
                {initiales}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-gray-900 truncate">
                {artisan.name}
              </p>
              <p className="text-[11px] text-orange-600 font-semibold truncate">
                {artisan.metier} • {artisan.commune || "Abidjan"}
              </p>
            </div>
          </div>

          {utilisateurConnecte && lienWhatsApp ? (
            <a
              href={lienWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-green-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0 shadow-sm"
            >
              💬 WhatsApp
            </a>
          ) : (
            <Link
              href="/auth/login"
              className="bg-orange-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0"
            >
              Contact
            </Link>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        <Link
          href="/artisans"
          className="inline-block text-sm font-medium text-gray-600 hover:text-orange-600"
        >
          ← Retour aux artisans
        </Link>

        {/* Carte Hero / Profil principal */}
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
                  <span
                    title="Photo CNI + numéro WhatsApp confirmés"
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full cursor-help"
                  >
                    ✓ Identité vérifiée par BARA
                  </span>
                )}

                {estNouveau && (
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    ✨ Nouveau sur BARA
                  </span>
                )}

                {estConnecte && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    En ligne
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    artisan.disponible !== false
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      artisan.disponible !== false
                        ? "bg-green-500 animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  {artisan.disponible !== false
                    ? "Disponible maintenant"
                    : "Occupé – répond sous 2h"}
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
                  <span className="ml-3 font-bold text-amber-600">
                    ★ {moyenneNote}/5 ({avis.length} avis)
                  </span>
                )}
              </p>
              {utilisateurConnecte ? (
                artisan.telephone && (
                  <div className="mt-5 space-y-2">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <a
                        href={lienWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl text-sm transition shadow-sm"
                      >
                        💬 Contacter sur WhatsApp
                      </a>
                      <a
                        href={"tel:" + artisan.telephone.replace(/\s+/g, "")}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-3 rounded-xl text-sm transition"
                      >
                        📞 Appeler ({artisan.telephone})
                      </a>
                      <Link
                        href={`/demande?metier=${encodeURIComponent(
                          artisan.metier
                        )}&commune=${encodeURIComponent(
                          artisan.commune || ""
                        )}`}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-semibold px-4 py-3 rounded-xl text-sm transition"
                      >
                        📋 Demander un devis
                      </Link>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      💡 Astuce : Dites-lui que vous venez de <strong>BARA</strong> lors de votre échange sur WhatsApp.
                    </p>
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

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              À propos de cet artisan
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {artisan.description ||
                `${artisan.name} intervient en tant que ${artisan.metier} à ${
                  artisan.commune || "Abidjan"
                }. Contactez-le directement pour expliquer votre besoin et obtenir une estimation rapide.`}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500">
                📍 Zone principale
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">
                {artisan.commune || "Tout Abidjan"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500">
                💬 Estimation
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">
                Devis gratuit
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500">
                🕒 Disponibilité
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">
                Lun - Sam • 7h-19h
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500">
                👍 Recommandations
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-orange-600 mt-0.5">
                {artisan.recommandations ?? 0} habitant(s)
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Réalisations ({artisan.realisations?.length || 0})
            </h2>
            {artisan.realisations && artisan.realisations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artisan.realisations.map((photo, index) => (
                  <button
                    key={photo + index}
                    type="button"
                    onClick={() => setPhotoZoom(photo)}
                    className="group relative rounded-2xl overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Réalisation ${index + 1} de ${artisan.name}`}
                      loading="lazy"
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/65 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      🔍 Agrandir
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                Cet artisan n&apos;a pas encore ajouté de réalisations. Contactez-le pour voir ses travaux.
              </p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Avis des clients ({avis.length})
              </h2>
              {moyenneNote && (
                <p className="text-sm font-bold text-amber-600 mt-0.5">
                  ★ {moyenneNote} / 5 de moyenne globale
                </p>
              )}
            </div>

            {avis.length > 0 && (
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-gray-600">
                {Array.of<number>(5, 4, 3, 2, 1).map((etoile) => {
                  const count = avis.filter((a) => a.note === etoile).length;
                  return (
                    <span
                      key={etoile}
                      className="bg-gray-100 px-2.5 py-1 rounded-full"
                    >
                      {etoile}★ ({count})
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <form
            onSubmit={handleAjouterAvis}
            className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-8 space-y-4"
          >
            <h3 className="font-bold text-sm text-gray-900">
              Laisser un avis sur {artisan.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="avis-auteur"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  Votre nom *
                </label>
                <input
                  id="avis-auteur"
                  name="auteur"
                  type="text"
                  required
                  value={auteur}
                  onChange={(e) => setAuteur(e.target.value)}
                  placeholder="Ex: Kouassi Jean"
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="avis-note"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  Note sur 5 *
                </label>
                <select
                  id="avis-note"
                  name="note"
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
              <label
                htmlFor="avis-commentaire"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Votre commentaire (optionnel)
              </label>
              <textarea
                id="avis-commentaire"
                name="commentaire"
                rows={3}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Ponctualité, qualité du travail, tarif..."
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white"
              />
            </div>

            {messageAvis && (
              <p className="text-xs font-semibold text-green-700">
                {messageAvis}
              </p>
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
              Soyez le premier à laisser un avis après votre chantier.
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
                  <p className="text-amber-500 text-xs mb-1">
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
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-extrabold">
              Besoin de ce professionnel ? Contactez-le maintenant
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Échangez directement avec {artisan.name} ou demandez un devis gratuit via BARA.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            {utilisateurConnecte && lienWhatsApp ? (
              <a
                href={lienWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-green-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
              >
                💬 Contacter sur WhatsApp
              </a>
            ) : (
              <Link
                href="/auth/login"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
              >
                🔒 Voir le contact
              </Link>
            )}
            <Link
              href={`/demande?metier=${encodeURIComponent(artisan.metier)}`}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition"
            >
              Demander un devis
            </Link>
          </div>
        </div>

        {similaires.length > 0 && (
          <section className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Artisans similaires à Abidjan
              </h2>
              <Link
                href="/artisans"
                className="text-xs sm:text-sm font-semibold text-orange-600 hover:underline"
              >
                Voir tout l&apos;annuaire →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similaires.map((sim) => (
                <Link
                  key={sim.id}
                  href={`/artisans/${sim.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:border-orange-300 transition flex items-center gap-3"
                >
                  {sim.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sim.avatar_url}
                      alt={sim.name}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover border border-orange-100 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-extrabold shrink-0">
                      {(sim.name || "A").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {sim.name}
                    </p>
                    <p className="text-xs font-semibold text-orange-600 truncate">
                      {sim.metier}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      📍 {sim.commune || "Abidjan"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {photoZoom && (
        <div
          onClick={() => setPhotoZoom(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl w-full">
            <button
              type="button"
              onClick={() => setPhotoZoom(null)}
              className="absolute -top-10 right-0 text-white text-sm font-bold bg-white/15 px-3 py-1 rounded-full"
            >
              ✕ Fermer
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoZoom}
              alt="Réalisation agrandie"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-white border-t border-gray-200 p-3 shadow-lg">
        {utilisateurConnecte && lienWhatsApp ? (
          <a
            href={lienWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-green-600 text-white font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md"
          >
            💬 Contacter sur WhatsApp
          </a>
        ) : (
          <Link
            href="/auth/login"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md"
          >
            🔒 Connectez-vous pour contacter sur WhatsApp
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FicheArtisanPage() {
  return (
    <Suspense fallback={<ProfilArtisanSkeleton />}>
      <ContenuFicheArtisan />
    </Suspense>
  );
}
