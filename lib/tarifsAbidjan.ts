export interface TarifPrestation {
  prestation: string;
  prixMin: string;
  prixMax: string;
  unite: string;
}

export interface GuideTarifMetier {
  metier: string;
  icone: string;
  deplacementMoyen: string;
  prestations: TarifPrestation[];
}

export const GUIDE_TARIFS_ABIDJAN: GuideTarifMetier[] = [
  {
    metier: "Plombier",
    icone: "🔧",
    deplacementMoyen: "3 000 – 5 000 FCFA",
    prestations: [
      { prestation: "Réparation fuite robinet ou tuyau", prixMin: "5 000", prixMax: "15 000", unite: "Intervention" },
      { prestation: "Débouchage évier, lavabo ou WC", prixMin: "10 000", prixMax: "25 000", unite: "Intervention" },
      { prestation: "Installation chauffe-eau électrique", prixMin: "15 000", prixMax: "30 000", unite: "Main-d'œuvre" },
      { prestation: "Pose complète sanitaire (WC + lavabo)", prixMin: "25 000", prixMax: "45 000", unite: "Main-d'œuvre" },
    ],
  },
  {
    metier: "Électricien",
    icone: "⚡",
    deplacementMoyen: "3 000 – 5 000 FCFA",
    prestations: [
      { prestation: "Recherche de panne / court-circuit", prixMin: "5 000", prixMax: "15 000", unite: "Diagnostic" },
      { prestation: "Pose prise, interrupteur ou luminaire", prixMin: "3 000", prixMax: "8 000", unite: "Par point" },
      { prestation: "Installation ventilateur plafonnier", prixMin: "5 000", prixMax: "10 000", unite: "Par unité" },
      { prestation: "Câblage tableau électrique complet", prixMin: "25 000", prixMax: "60 000", unite: "Main-d'œuvre" },
    ],
  },
  {
    metier: "Climatisation / Froid",
    icone: "❄️",
    deplacementMoyen: "3 000 – 5 000 FCFA",
    prestations: [
      { prestation: "Entretien et lavage climatiseur Split", prixMin: "5 000", prixMax: "10 000", unite: "Par appareil" },
      { prestation: "Recharge de gaz réfrigérant (R410/R32)", prixMin: "15 000", prixMax: "25 000", unite: "Par appareil" },
      { prestation: "Installation complète climatiseur Split", prixMin: "15 000", prixMax: "30 000", unite: "Main-d'œuvre" },
      { prestation: "Dépannage réfrigérateur / congélateur", prixMin: "10 000", prixMax: "25 000", unite: "Main-d'œuvre" },
    ],
  },
  {
    metier: "Peintre en bâtiment",
    icone: "🎨",
    deplacementMoyen: "Gratuit sur devis",
    prestations: [
      { prestation: "Peinture chambre ou salon (main-d'œuvre)", prixMin: "1 000", prixMax: "2 500", unite: "Par m²" },
      { prestation: "Rafraîchissement studio complet", prixMin: "35 000", prixMax: "75 000", unite: "Forfait" },
      { prestation: "Enduit de lissage + peinture murale", prixMin: "2 500", prixMax: "4 500", unite: "Par m²" },
      { prestation: "Peinture façade extérieure", prixMin: "2 000", prixMax: "4 000", unite: "Par m²" },
    ],
  },
  {
    metier: "Menuisier bois",
    icone: "🪚",
    deplacementMoyen: "3 000 – 5 000 FCFA",
    prestations: [
      { prestation: "Réparation porte, serrure ou charnière", prixMin: "5 000", prixMax: "15 000", unite: "Intervention" },
      { prestation: "Fabrication et pose porte bois massif", prixMin: "45 000", prixMax: "90 000", unite: "Fourni posé" },
      { prestation: "Placard ou dressing sur mesure", prixMin: "80 000", prixMax: "250 000", unite: "Sur devis" },
      { prestation: "Montage de meubles en kit", prixMin: "10 000", prixMax: "25 000", unite: "Forfait" },
    ],
  },
  {
    metier: "Maçon",
    icone: "🧱",
    deplacementMoyen: "Gratuit sur devis",
    prestations: [
      { prestation: "Pose de carreaux sol ou mur", prixMin: "2 000", prixMax: "3 500", unite: "Par m²" },
      { prestation: "Montage mur en parpaings", prixMin: "2 500", prixMax: "4 000", unite: "Par m²" },
      { prestation: "Rénovation douche / étanchéité", prixMin: "40 000", prixMax: "100 000", unite: "Forfait" },
      { prestation: "Journée d'un maître maçon", prixMin: "8 000", prixMax: "12 000", unite: "Par jour" },
    ],
  },
  {
    metier: "Serrurier / Ferronnier / Soudeur",
    icone: "🔑",
    deplacementMoyen: "3 000 – 5 000 FCFA",
    prestations: [
      { prestation: "Ouverture de porte claquée (urgence)", prixMin: "10 000", prixMax: "20 000", unite: "Intervention" },
      { prestation: "Remplacement cylindre / serrure sécurité", prixMin: "8 000", prixMax: "20 000", unite: "Main-d'œuvre" },
      { prestation: "Grille antivol fenêtre métallique", prixMin: "25 000", prixMax: "55 000", unite: "Par fenêtre" },
      { prestation: "Réparation portail métallique (soudure)", prixMin: "15 000", prixMax: "40 000", unite: "Intervention" },
    ],
  },
  {
    metier: "Mécanicien auto",
    icone: "🚗",
    deplacementMoyen: "5 000 FCFA (dépannage)",
    prestations: [
      { prestation: "Vidange complète + filtres (main-d'œuvre)", prixMin: "5 000", prixMax: "10 000", unite: "Forfait" },
      { prestation: "Diagnostic valise électronique", prixMin: "10 000", prixMax: "15 000", unite: "Diagnostic" },
      { prestation: "Changement plaquettes de frein", prixMin: "5 000", prixMax: "12 000", unite: "Par essieu" },
      { prestation: "Dépannage batterie / démarrage sur place", prixMin: "5 000", prixMax: "15 000", unite: "Intervention" },
    ],
  },
  {
    metier: "Installateur caméras & alarmes (Sécurité)",
    icone: "📹",
    deplacementMoyen: "5 000 FCFA (étude gratuite sur chantier)",
    prestations: [
      { prestation: "Installation caméra de surveillance IP / Wi-Fi", prixMin: "10 000", prixMax: "20 000", unite: "Par caméra" },
      { prestation: "Kit complet 4 caméras + enregistreur DVR", prixMin: "120 000", prixMax: "250 000", unite: "Fourni posé" },
      { prestation: "Pose interphone vidéo / sonnette connectée", prixMin: "15 000", prixMax: "35 000", unite: "Main-d'œuvre" },
      { prestation: "Installation clôture électrique de sécurité", prixMin: "4 500", prixMax: "8 000", unite: "Par mètre linéaire" },
    ],
  },
  {
    metier: "Installateur panneaux solaires",
    icone: "☀️",
    deplacementMoyen: "5 000 FCFA (diagnostic gratuit)",
    prestations: [
      { prestation: "Kit solaire éclairage + TV + ventilateur", prixMin: "180 000", prixMax: "350 000", unite: "Fourni posé" },
      { prestation: "Installation onduleur hybride + batteries", prixMin: "35 000", prixMax: "80 000", unite: "Main-d'œuvre" },
      { prestation: "Entretien et nettoyage panneaux solaires", prixMin: "10 000", prixMax: "25 000", unite: "Forfait" },
      { prestation: "Raccordement inverseur groupe électrogène", prixMin: "20 000", prixMax: "45 000", unite: "Main-d'œuvre" },
    ],
  },
  {
    metier: "Vidange fosse septique / Curage",
    icone: "🚛",
    deplacementMoyen: "Inclus dans le forfait camion",
    prestations: [
      { prestation: "Vidange fosse septique maison (camion hydrocureur)", prixMin: "35 000", prixMax: "65 000", unite: "Par voyage" },
      { prestation: "Curage et débouchage regard / canalisation", prixMin: "15 000", prixMax: "30 000", unite: "Intervention" },
      { prestation: "Désinsectisation & dératisation complète (3D)", prixMin: "20 000", prixMax: "45 000", unite: "Maison / Appart." },
    ],
  },
  {
    metier: "Jardinier / Paysagiste",
    icone: "🌿",
    deplacementMoyen: "3 000 FCFA",
    prestations: [
      { prestation: "Tonte de pelouse et taille de haies", prixMin: "10 000", prixMax: "25 000", unite: "Par passage" },
      { prestation: "Entretien mensuel jardin (2 passages/mois)", prixMin: "25 000", prixMax: "50 000", unite: "Par mois" },
      { prestation: "Nettoyage complet fin de chantier", prixMin: "30 000", prixMax: "80 000", unite: "Forfait" },
      { prestation: "Entretien et traitement eau de piscine", prixMin: "25 000", prixMax: "50 000", unite: "Par mois" },
    ],
  },
];