"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ParrainageProps {
  artisanId: string | number;
  nomArtisan: string;
  codeParrainage: string | null;
}

export function ParrainageArtisan({
  artisanId,
  nomArtisan,
  codeParrainage,
}: ParrainageProps) {
  const [nbFilleuls, setNbFilleuls] = useState(0);
  const [copie, setCopie] = useState(false);

  const codeFinal =
    codeParrainage ||
    "BARA-" + String(artisanId).replace(/-/g, "").slice(0, 6).toUpperCase();

  const origine =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://vercel.app";

  const lienInvitation = `${origine}/auth/register?parrain=${encodeURIComponent(
    codeFinal
  )}`;

  const messageWhatsApp = [
    `Salut collègue ! 👋`,
    `Je suis inscrit sur *BARA Abidjan* (${nomArtisan}) pour trouver des clients sans intermédiaire.`,
    `Inscris-toi gratuitement avec mon code parrain *${codeFinal}* ici :`,
    lienInvitation,
  ].join("\n");

  const urlWhatsApp = `https://wa.me{encodeURIComponent(
    messageWhatsApp
  )}`;

  useEffect(() => {
    async function compterFilleuls() {
      const { count } = await supabase
        .from("artisans")
        .select("id", { count: "exact", head: true })
        .eq("parrain_code", codeFinal);

      if (typeof count === "number") {
        setNbFilleuls(count);
      }
    }

    compterFilleuls();
  }, [codeFinal]);

  function copierLien() {
    navigator.clipboard.writeText(lienInvitation);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }
  const objectif = 3;
  const progression = Math.min(100, Math.round((nbFilleuls / objectif) * 100));
  const recompenseDebloquee = nbFilleuls >= objectif;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="bg-gradient-to-br from-orange-50 to-amber-50/70 rounded-2xl border border-orange-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            🎁 Parrainer des collègues artisans
          </h2>
          <span className="bg-white border border-orange-300 text-orange-700 font-extrabold text-xs px-3 py-1 rounded-full">
            Code : {codeFinal}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Invitez <strong>3 collègues artisans à Abidjan</strong> à créer leur
          fiche avec votre code et débloquez{" "}
          <strong>1 mois de mise en avant gratuite</strong> en tête de votre
          commune.
        </p>

        {/* Barre de progression des filleuls */}
        <div className="mt-4 bg-white p-4 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-gray-700">
              Artisans parrainés : {nbFilleuls} / {objectif}
            </span>
            <span
              className={
                recompenseDebloquee ? "text-green-600" : "text-orange-600"
              }
            >
              {recompenseDebloquee
                ? "🎉 Récompense débloquée !"
                : `Encore ${objectif - nbFilleuls} invitation(s)`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                recompenseDebloquee ? "bg-green-600" : "bg-orange-600"
              }`}
              style={{ width: `${progression}%` }}
            />
          </div>

          {recompenseDebloquee && (
            <p className="text-xs text-green-800 font-medium mt-2.5">
              Félicitations ! Écrivez au support WhatsApp BARA avec votre code{" "}
              <strong>{codeFinal}</strong> pour activer votre mise en avant.
            </p>
          )}
        </div>

        {/* Boutons d'invitation */}
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5"
          >
            <span>💬</span> Inviter un collègue sur WhatsApp
          </a>

          <button
            type="button"
            onClick={copierLien}
            className="bg-white hover:bg-orange-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            {copie ? "✅ Lien copié !" : "🔗 Copier mon lien d'invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
