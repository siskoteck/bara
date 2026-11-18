"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

interface GenerateurDevisProps {
  nomArtisan: string;
  metier: string;
  commune: string | null;
  telephone: string | null;
  verifie?: boolean | null;
}

interface LignePrestation {
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export function GenerateurDevisPDF({
  nomArtisan,
  metier,
  commune,
  telephone,
  verifie,
}: GenerateurDevisProps) {
  const [ouvert, setOuvert] = useState(false);
  const [typeDoc, setTypeDoc] = useState<"DEVIS" | "REÇU DE PAIEMENT">("DEVIS");
  const [nomClient, setNomClient] = useState("");
  const [telephoneClient, setTelephoneClient] = useState("");
  const [garantie, setGarantie] = useState("Garantie main-d'œuvre : 30 jours");
  const [lignes, setLignes] = useState<LignePrestation[]>([
    { designation: "Main-d'œuvre / Intervention", quantite: 1, prixUnitaire: 15000 },
  ]);

  function ajouterLigne() {
    setLignes([...lignes, { designation: "", quantite: 1, prixUnitaire: 0 }]);
  }

  function supprimerLigne(index: number) {
    if (lignes.length <= 1) return;
    setLignes(lignes.filter((_, i) => i !== index));
  }

  function modifierLigne(
    index: number,
    champ: keyof LignePrestation,
    valeur: string | number
  ) {
    setLignes(
      lignes.map((ligne, i) =>
        i === index ? { ...ligne, [champ]: valeur } : ligne
      )
    );
  }

  const totalGeneral = lignes.reduce(
    (acc, item) => acc + (Number(item.quantite) || 0) * (Number(item.prixUnitaire) || 0),
    0
  );

  function formaterFCFA(montant: number) {
    return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
  }
  function genererPDF() {
    const doc = new jsPDF();
    const dateJour = new Date().toLocaleDateString("fr-FR");
    const numeroDoc = "BARA-" + Date.now().toString().slice(-6);

    // 1. Bandeau supérieur orange BARA
    doc.setFillColor(234, 88, 12);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("BARA ABIDJAN", 15, 18);

    doc.setFontSize(11);
    doc.text(typeDoc, 195, 18, { align: "right" });

    // 2. Informations Artisan (Gauche)
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(12);
    doc.text(nomArtisan || "Artisan BARA", 15, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text("Métier : " + metier, 15, 48);
    doc.text("Zone : " + (commune || "Abidjan") + ", Côte d'Ivoire", 15, 54);
    if (telephone) doc.text("Téléphone : " + telephone, 15, 60);
    if (verifie) {
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.text("✓ Profil vérifié sur BARA", 15, 66);
    }

    // Infos Document à droite
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "bold");
    doc.text("N° : " + numeroDoc, 195, 42, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text("Date : " + dateJour, 195, 48, { align: "right" });

    doc.setDrawColor(229, 231, 235);
    doc.line(15, 74, 195, 74);

    // 3. Encadré Client
    doc.setFillColor(249, 250, 251);
    doc.rect(15, 80, 180, 22, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT :", 20, 89);
    doc.setFont("helvetica", "normal");
    doc.text(nomClient.trim() || "Client Particulier", 42, 89);

    if (telephoneClient.trim()) {
      doc.text("Contact : " + telephoneClient.trim(), 20, 96);
    }
    // 4. En-tête du tableau des prestations
    let y = 114;
    doc.setFillColor(17, 24, 39);
    doc.rect(15, y, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("Désignation / Matériaux", 19, y + 7);
    doc.text("Qté", 125, y + 7, { align: "center" });
    doc.text("Prix Unitaire", 158, y + 7, { align: "right" });
    doc.text("Total", 191, y + 7, { align: "right" });

    // 5. Lignes de prestations
    y += 17;
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");

    lignes.forEach((item) => {
      const qte = Number(item.quantite) || 0;
      const pu = Number(item.prixUnitaire) || 0;
      const sousTotal = qte * pu;
      const libelle = (item.designation || "Prestation").slice(0, 48);

      doc.text(libelle, 19, y);
      doc.text(String(qte), 125, y, { align: "center" });
      doc.text(pu.toLocaleString("fr-FR") + " F", 158, y, { align: "right" });
      doc.text(sousTotal.toLocaleString("fr-FR") + " F", 191, y, {
        align: "right",
      });

      doc.setDrawColor(243, 244, 246);
      doc.line(15, y + 3, 195, y + 3);
      y += 10;
    });

    // 6. Total Général
    y += 6;
    doc.setFillColor(255, 247, 237);
    doc.rect(115, y, 80, 14, "F");
    doc.setTextColor(234, 88, 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL : " + formaterFCFA(totalGeneral), 191, y + 9.5, {
      align: "right",
    });

    // 7. Garantie & Pied de page
    if (garantie.trim()) {
      y += 26;
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.text(garantie.trim(), 15, y);
    }

    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(
      "Document généré gratuitement via BARA Abidjan (bara-six-beta.vercel.app) — L'annuaire des artisans de confiance.",
      105,
      282,
      { align: "center" }
    );

    const nomFichier =
      typeDoc.toLowerCase().replace(/\s+/g, "-") + "-" + numeroDoc + ".pdf";
    doc.save(nomFichier);
  }
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            🧾 Générateur de Devis & Reçu PDF
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Créez un devis officiel ou un reçu de paiement à envoyer sur WhatsApp à votre client.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOuvert(!ouvert)}
          className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          {ouvert ? "Fermer l'outil" : "+ Créer un Devis / Reçu"}
        </button>
      </div>

      {ouvert && (
        <div className="mt-5 bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-5">
          {/* Choix du type de document */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTypeDoc("DEVIS")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                typeDoc === "DEVIS"
                  ? "bg-orange-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              📄 DEVIS ESTIMATIF
            </button>
            <button
              type="button"
              onClick={() => setTypeDoc("REÇU DE PAIEMENT")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                typeDoc === "REÇU DE PAIEMENT"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              ✅ REÇU DE PAIEMENT
            </button>
          </div>

          {/* Infos Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nom du client
              </label>
              <input
                type="text"
                value={nomClient}
                onChange={(e) => setNomClient(e.target.value)}
                placeholder="Ex: Mme Koné"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Téléphone du client (optionnel)
              </label>
              <input
                type="tel"
                value={telephoneClient}
                onChange={(e) => setTelephoneClient(e.target.value)}
                placeholder="Ex: 07 00 00 00 00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>

          {/* Lignes de prestations */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-gray-700">
              Détail des travaux et matériaux :
            </p>

            {lignes.map((ligne, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-gray-200"
              >
                <input
                  type="text"
                  value={ligne.designation}
                  onChange={(e) =>
                    modifierLigne(index, "designation", e.target.value)
                  }
                  placeholder="Ex: Tuyau PVC + coudes"
                  className="col-span-12 sm:col-span-6 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
                <input
                  type="number"
                  min={1}
                  value={ligne.quantite}
                  onChange={(e) =>
                    modifierLigne(index, "quantite", Number(e.target.value))
                  }
                  placeholder="Qté"
                  className="col-span-4 sm:col-span-2 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-center"
                />
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={ligne.prixUnitaire}
                  onChange={(e) =>
                    modifierLigne(index, "prixUnitaire", Number(e.target.value))
                  }
                  placeholder="Prix FCFA"
                  className="col-span-6 sm:col-span-3 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-right"
                />
                <button
                  type="button"
                  onClick={() => supprimerLigne(index)}
                  title="Supprimer cette ligne"
                  className="col-span-2 sm:col-span-1 text-red-500 hover:text-red-700 font-bold text-sm text-center"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={ajouterLigne}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              + Ajouter une ligne (matériel ou prestation)
            </button>
          </div>

          {/* Garantie / Condition */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mention ou garantie (optionnel)
            </label>
            <input
              type="text"
              value={garantie}
              onChange={(e) => setGarantie(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white"
            />
          </div>

          {/* Total et bouton de téléchargement */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-gray-200">
            <div className="text-base font-extrabold text-gray-900">
              Total :{" "}
              <span className="text-orange-600">
                {formaterFCFA(totalGeneral)}
              </span>
            </div>

            <button
              type="button"
              onClick={genererPDF}
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              ⬇️ Télécharger le {typeDoc} (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
