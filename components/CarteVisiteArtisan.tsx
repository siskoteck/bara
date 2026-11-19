"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface CarteVisiteProps {
  id: string | number;
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [urlFiche, setUrlFiche] = useState<string>(
    `https://vercel.app{id}`
  );
  const [telechargementEnCours, setTelechargementEnCours] = useState(false);

  const localisation = [commune || "Abidjan", quartier]
    .filter(Boolean)
    .join(" • ");

  useEffect(() => {
    const origine =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://vercel.app";
    const lienComplet = `${origine}/artisans/${id}`;
    setUrlFiche(lienComplet);

    QRCode.toDataURL(lienComplet, {
      width: 300,
      margin: 1,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    })
      .then((dataUrl) => setQrDataUrl(dataUrl))
      .catch((err) => console.error("Erreur génération QR:", err));
  }, [id]);

  async function telechargerCartePNG() {
    if (!qrDataUrl) return;

    try {
      setTelechargementEnCours(true);

      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 560;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Fond blanc
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Bande supérieure orange BARA
      ctx.fillStyle = "#ea580c";
      ctx.fillRect(0, 0, canvas.width, 24);

      // 3. Zone latérale droite gris clair pour le QR Code
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(650, 24, 350, 536);

      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(650, 60);
      ctx.lineTo(650, 500);
      ctx.stroke();

      // 4. Logo BARA Abidjan
      ctx.fillStyle = "#ea580c";
      ctx.font = "bold 38px Arial, sans-serif";
      ctx.fillText("BARA", 55, 95);

      ctx.fillStyle = "#9a3412";
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillText("ABIDJAN", 172, 93);

      // 5. Badge Vérifié (si actif)
      if (verifie) {
        ctx.fillStyle = "#dcfce7";
        ctx.fillRect(55, 120, 235, 36);
        ctx.fillStyle = "#166534";
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.fillText("✓ ARTISAN VÉRIFIÉ", 72, 144);
      }

      // 6. Nom et métier
      ctx.fillStyle = "#111827";
      ctx.font = "bold 44px Arial, sans-serif";
      ctx.fillText((nom || "Artisan BARA").slice(0, 23), 55, 225);

      ctx.fillStyle = "#ea580c";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillText((metier || "Professionnel").slice(0, 30), 55, 275);

      // 7. Commune et Téléphone
      ctx.fillStyle = "#374151";
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("📍 " + localisation, 55, 355);

      if (telephone) {
        ctx.fillStyle = "#111827";
        ctx.font = "bold 28px Arial, sans-serif";
        ctx.fillText("📞 " + telephone, 55, 405);
      }

      ctx.fillStyle = "#6b7280";
      ctx.font = "18px Arial, sans-serif";
      ctx.fillText(
        "Scannez le QR Code pour voir mes réalisations et avis",
        55,
        495
      );

      // 8. Dessiner le QR Code local sur le canvas
      const imgQr = new Image();
      await new Promise<void>((resolve, reject) => {
        imgQr.onload = () => resolve();
        imgQr.onerror = () => reject(new Error("Erreur image QR"));
        imgQr.src = qrDataUrl;
      });

      ctx.drawImage(imgQr, 705, 115, 240, 240);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCANNER MA FICHE", 825, 395);

      ctx.fillStyle = "#6b7280";
      ctx.font = "15px Arial, sans-serif";
      ctx.fillText("bara-six-beta.vercel.app", 825, 425);

      // 9. Télécharger l'image PNG
      const lien = document.createElement("a");
      lien.download = `carte-visite-bara-${id}.png`;
      lien.href = canvas.toDataURL("image/png");
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
    } catch (err) {
      console.error("Erreur téléchargement carte:", err);
      alert("Impossible de télécharger la carte sur ce navigateur.");
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
          Téléchargez votre carte professionnelle ou partagez votre lien sur
          WhatsApp pour récolter des avis clients.
        </p>
      </div>

      {/* Aperçu de la carte */}
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

          {/* QR Code local */}
          <div className="flex flex-col items-center bg-gray-50 p-3 rounded-xl border border-gray-200 shrink-0">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="QR Code profil BARA"
                className="w-28 h-28 rounded-lg"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center text-xs text-gray-400">
                Génération...
              </div>
            )}
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
          disabled={!qrDataUrl || telechargementEnCours}
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {telechargementEnCours
            ? "Création de l'image..."
            : "⬇️ Télécharger ma carte (PNG)"}
        </button>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(urlFiche);
            alert("Lien copié : " + urlFiche);
          }}
          className="border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          🔗 Copier le lien de ma fiche
        </button>
      </div>
    </div>
  );
}
