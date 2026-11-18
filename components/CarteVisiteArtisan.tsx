"use client";

import { useState } from "react";

interface CarteVisiteProps {
  id: number;
  nom: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  verifie?: boolean | null;
}

export function CarteVisiteArtisan({
  id,
  nom,
  metier,
  commune,
  quartier,
  telephone,
  verifie,
}: CarteVisiteProps) {
  const [telechargementEnCours, setTelechargementEnCours] = useState(false);

  const urlFichePublique = `https://vercel.app{id}`;
  const urlQrCode = `https://qrserver.com{encodeURIComponent(
    urlFichePublique
  )}`;

  const localisation = [commune || "Abidjan", quartier]
    .filter(Boolean)
    .join(" • ");

  async function telechargerCartePNG() {
    try {
      setTelechargementEnCours(true);

      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 560;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Fond blanc avec bordure élégante
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bande supérieure orange BARA
      ctx.fillStyle = "#ea580c";
      ctx.fillRect(0, 0, canvas.width, 24);

      // Encadré latéral droit gris très clair pour le QR Code
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(650, 24, 350, 536);

      // Ligne de séparation verticale
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(650, 60);
      ctx.lineTo(650, 500);
      ctx.stroke();

      // 2. Logo BARA Abidjan
      ctx.fillStyle = "#ea580c";
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText("BARA", 55, 95);

      ctx.fillStyle = "#9a3412";
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillText("ABIDJAN", 168, 93);

      // Badge Vérifié (si actif)
      if (verifie) {
        ctx.fillStyle = "#dcfce7";
        ctx.fillRect(55, 120, 230, 36);
        ctx.fillStyle = "#166534";
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.fillText("✓ ARTISAN VÉRIFIÉ", 72, 144);
      }

      // 3. Nom et métier de l'artisan
      ctx.fillStyle = "#111827";
      ctx.font = "bold 46px Arial, sans-serif";
      ctx.fillText((nom || "Artisan BARA").slice(0, 24), 55, 225);

      ctx.fillStyle = "#ea580c";
      ctx.font = "bold 30px Arial, sans-serif";
      ctx.fillText((metier || "Professionnel").slice(0, 30), 55, 275);

      // 4. Localisation et Téléphone
      ctx.fillStyle = "#374151";
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("📍 " + localisation, 55, 355);

      if (telephone) {
        ctx.fillStyle = "#111827";
        ctx.font = "bold 28px Arial, sans-serif";
        ctx.fillText("📞 " + telephone, 55, 405);
      }

      // Pied de carte
      ctx.fillStyle = "#6b7280";
      ctx.font = "18px Arial, sans-serif";
      ctx.fillText("Scannez le QR Code pour voir mes photos et avis clients", 55, 495);

      // 5. Charger et dessiner le QR Code
      const imgQr = new Image();
      imgQr.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        imgQr.onload = () => resolve();
        imgQr.onerror = () => reject(new Error("Erreur chargement QR Code"));
        imgQr.src = urlQrCode;
      });

      ctx.drawImage(imgQr, 705, 115, 240, 240);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("VOIR MA FICHE & AVIS", 825, 395);

      ctx.fillStyle = "#6b7280";
      ctx.font = "16px Arial, sans-serif";
      ctx.fillText("bara-six-beta.vercel.app", 825, 425);

      // 6. Déclencher le téléchargement de l'image PNG
      const lien = document.createElement("a");
      lien.download = `carte-visite-bara-${id}.png`;
      lien.href = canvas.toDataURL("image/png");
      lien.click();
    } catch (err) {
      console.error("Erreur génération carte:", err);
      alert("Impossible de télécharger la carte. Faites une capture d'écran de l'aperçu.");
    } finally {
      setTelechargementEnCours(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          🪪 Ma carte de visite & QR Code
        </h2>
        <p className="text-xs text-gray-600 mt-0.5">
          Partagez cette carte sur WhatsApp ou imprimez-la pour que vos clients scannent votre QR Code et vous laissent un avis 5 étoiles.
        </p>
      </div>

      {/* Aperçu visuel de la carte de visite */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
        <div className="h-2 bg-orange-600 w-full" />
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-orange-600 text-sm tracking-tight">
                BARA
              </span>
              <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                ABIDJAN
              </span>
              {verifie && (
                <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  ✓ Vérifié
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {nom || "Artisan BARA"}
            </h3>
            <p className="text-sm font-semibold text-orange-600">{metier}</p>
            <p className="text-xs text-gray-600">📍 {localisation}</p>
            {telephone && (
              <p className="text-sm font-bold text-gray-800">📞 {telephone}</p>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center bg-gray-50 p-3 rounded-xl border border-gray-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlQrCode}
              alt="QR Code profil BARA"
              className="w-28 h-28 rounded-lg"
            />
            <span className="text-[10px] font-semibold text-gray-500 mt-1.5">
              Scanner pour voir ma fiche
            </span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          type="button"
          onClick={telechargerCartePNG}
          disabled={telechargementEnCours}
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {telechargementEnCours
            ? "Génération de l'image..."
            : "⬇️ Télécharger ma carte (Image)"}
        </button>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(urlFichePublique);
            alert("Lien de votre fiche copié ! Collez-le sur WhatsApp.");
          }}
          className="border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          🔗 Copier le lien de ma fiche
        </button>
      </div>
    </div>
  );
}
