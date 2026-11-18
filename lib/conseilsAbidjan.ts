export interface ArticleConseil {
  slug: string;
  titre: string;
  categorie: string;
  metierLie: string;
  icone: string;
  tempsLecture: string;
  resume: string;
  sections: {
    sousTitre: string;
    contenu: string;
  }[];
  astucePro: string;
}

export const CONSEILS_ABIDJAN: ArticleConseil[] = [
  {
    slug: "proteger-appareils-variations-tension-cie-abidjan",
    titre: "Comment protéger ses appareils contre les variations de tension à Abidjan ?",
    categorie: "Électricité & Sécurité",
    metierLie: "Électricien",
    icone: "⚡",
    tempsLecture: "3 min",
    resume:
      "Coupures brusques et baisses de tension peuvent griller votre réfrigérateur ou votre téléviseur. Voici les gestes simples pour sécuriser votre maison.",
    sections: [
      {
        sousTitre: "1. Installer un régulateur ou un parafoudre au tableau",
        contenu:
          "Un parafoudre ou un relais de protection contre les surtensions installé directement sur votre tableau électrique coupe automatiquement le courant en cas de pic anormal et protège toute la maison.",
      },
      {
        sousTitre: "2. Utiliser des prises temporisées sur les gros appareils",
        contenu:
          "Pour le congélateur, le réfrigérateur et le split, branchez une prise de protection avec temporisation (délai de 3 minutes au retour du courant) afin d'éviter le choc électrique au redémarrage.",
      },
      {
        sousTitre: "3. Vérifier la mise à la terre de votre logement",
        contenu:
          "Beaucoup de logements anciens à Abidjan ont une prise de terre défectueuse. Faites contrôler votre piquet de terre par un électricien qualifié pour éviter les décharges et l'échauffement des câbles.",
      },
    ],
    astucePro:
      "Si vos ampoules clignotent souvent ou que votre disjoncteur chauffe, faites vérifier le serrage des fils de votre tableau par un électricien BARA.",
  },
  {
    slug: "entretien-climatiseur-split-chaleur-abidjan",
    titre: "Climatiseur qui coule ou refroidit mal : les réflexes avant d'appeler un technicien",
    categorie: "Froid & Climatisation",
    metierLie: "Frigoriste / Climatisation",
    icone: "❄️",
    tempsLecture: "3 min",
    resume:
      "Avec la chaleur et la poussière à Abidjan, un climatiseur encrassé consomme jusqu'à 30 % d'électricité en plus. Découvrez comment l'entretenir.",
    sections: [
      {
        sousTitre: "1. Nettoyer les filtres toutes les 3 semaines",
        contenu:
          "Ouvrez le capot de l'unité intérieure, retirez les deux filtres à poussière et rincez-les à l'eau claire. Laissez sécher à l'ombre avant de les remettre : votre appareil soufflera immédiatement plus frais.",
      },
      {
        sousTitre: "2. Pourquoi votre climatiseur coule-t-il à l'intérieur ?",
        contenu:
          "Dans 80 % des cas, le tuyau d'évacuation des condensats est bouché par la poussière ou des algues. Un lavage complet au nettoyeur haute pression par un frigoriste règle le problème.",
      },
      {
        sousTitre: "3. La fréquence idéale d'entretien à Abidjan",
        contenu:
          "En bord de lagune ou près des axes poussiéreux (Yopougon, Abobo, Koumassi, Marcory), prévoyez un entretien complet tous les 4 à 6 mois pour prolonger la durée de vie du compresseur.",
      },
    ],
    astucePro:
      "Ne demandez une recharge de gaz que si le technicien a d'abord recherché et réparé la fuite sur les raccords en cuivre.",
  },
  {
    slug: "preparer-maison-saison-des-pluies-abidjan",
    titre: "Préparer sa toiture et ses évacuations avant la grande saison des pluies",
    categorie: "Maçonnerie & Plomberie",
    metierLie: "Plombier",
    icone: "🌧️",
    tempsLecture: "4 min",
    resume:
      "Infiltrations d'eau, gouttières bouchées et humidité sur les murs : anticipez les fortes pluies à Abidjan grâce à ces vérifications essentielles.",
    sections: [
      {
        sousTitre: "1. Curage des gouttières et regards d'évacuation",
        contenu:
          "Les feuilles mortes et le sable bloquent rapidement l'écoulement des eaux de pluie. Faites nettoyer vos gouttières et vos regards extérieurs avant les premières averses.",
      },
      {
        sousTitre: "2. Contrôler l'étanchéité de la dalle et des tôles",
        contenu:
          "Inspectez les joints autour des antennes, chauffe-eau solaires et raccords de toiture. Une petite fissure sur une dalle peut provoquer de grandes taches d'humidité au plafond.",
      },
      {
        sousTitre: "3. Protéger le bas des murs contre les remontées d'eau",
        contenu:
          "Vérifiez que les pentes autour de la cour dirigent bien l'eau vers le caniveau extérieur et non vers les fondations de la maison.",
      },
    ],
    astucePro:
      "Un diagnostic préventif coûte 4 fois moins cher qu'une réfection complète de plafond endommagé par les infiltrations.",
  },
  {
    slug: "renforcer-securite-portes-fenetres-abidjan",
    titre: "5 points clés pour sécuriser les accès de votre logement ou commerce",
    categorie: "Serrurerie & Soudure",
    metierLie: "Serrurier / Soudeur",
    icone: "🔑",
    tempsLecture: "3 min",
    resume:
      "Vous venez d'emménager dans un nouvel appartement à Abidjan ? Voici les vérifications indispensables pour votre tranquillité.",
    sections: [
      {
        sousTitre: "1. Toujours remplacer le cylindre en cas de déménagement",
        contenu:
          "Même si l'ancien locataire vous remet toutes les clés, il est prudent de faire poser un cylindre neuf par un serrurier dès le premier jour.",
      },
      {
        sousTitre: "2. Poser des grilles antivol sur les fenêtres accessibles",
        contenu:
          "Pour les rez-de-chaussée et balcons proches d'un mur, faites réaliser des grilles métalliques solides avec un espacement réduit entre les barreaux.",
      },
      {
        sousTitre: "3. Entretenir les serrures et gonds de portail",
        contenu:
          "L'air humide et salin d'Abidjan grippe rapidement les serrures. Utilisez un lubrifiant sec (graphite ou spray adapté) plutôt que de l'huile moteur qui retient la poussière.",
      },
    ],
    astucePro:
      "Conservez toujours le numéro d'un serrurier vérifié BARA de votre commune dans votre téléphone en cas de porte claquée.",
  },  {
    slug: "eviter-humidite-salpetre-murs-peinture-abidjan",
    titre: "Peinture qui cloque et humidité sur les murs : comment traiter durablement ?",
    categorie: "Peinture & Rénovation",
    metierLie: "Peintre",
    icone: "🎨",
    tempsLecture: "3 min",
    resume:
      "Avec la proximité de la lagune et l'humidité à Abidjan, les murs du bas s'écaillent vite. Voici les étapes pour une peinture qui tient dans le temps.",
    sections: [
      {
        sousTitre: "1. Ne jamais peindre directement sur un mur humide",
        contenu:
          "Appliquer une nouvelle couche de peinture sur un mur qui cloque ne règle rien : l'humidité repoussera la peinture en quelques semaines. Il faut d'abord gratter toute la partie abîmée jusqu'au ciment.",
      },
      {
        sousTitre: "2. Appliquer un traitement hydrofuge anti-salpêtre",
        contenu:
          "Après brossage et séchage complet du mur, faites appliquer un durcisseur anti-humidité (hydrofuge de surface) avant de poser l'enduit de lissage.",
      },
      {
        sousTitre: "3. Choisir une peinture acrylique lessivable de qualité",
        contenu:
          "Pour les pièces de vie, les couloirs et les façades exposées à la pluie, privilégiez une peinture acrylique satinée ou spéciale façade résistante aux moisissures.",
      },
    ],
    astucePro:
      "Vérifiez toujours qu'il n'y a pas une micro-fuite d'eau encastrée derrière le mur avant de refaire l'enduit et la peinture.",
  },
  {
    slug: "entretien-voiture-embouteillages-chaleur-abidjan",
    titre: "Embouteillages et chaleur à Abidjan : 4 contrôles vitaux pour votre voiture",
    categorie: "Mécanique Auto",
    metierLie: "Mécanicien auto / moto",
    icone: "🚗",
    tempsLecture: "4 min",
    resume:
      "Les bouchons quotidiens sur les ponts et boulevards d'Abidjan sollicitent fortement le moteur et la climatisation. Protégez votre véhicule.",
    sections: [
      {
        sousTitre: "1. Surveiller le circuit de refroidissement et le radiateur",
        contenu:
          "Dans les embouteillages à l'arrêt, le moteur chauffe vite. Utilisez toujours du liquide de refroidissement (jamais d'eau du robinet qui rouille le radiateur) et vérifiez le déclenchement des ventilateurs.",
      },
      {
        sousTitre: "2. Rapprocher la fréquence des vidanges moteur",
        contenu:
          "Un moteur qui tourne 2 heures par jour dans les bouchons s'use autant que sur autoroute. À Abidjan, faites la vidange tous les 5 000 à 7 000 km avec remplacement du filtre à huile.",
      },
      {
        sousTitre: "3. Nettoyer le filtre à air et le filtre d'habitacle",
        contenu:
          "La poussière encrasse rapidement le filtre à air, ce qui augmente votre consommation de carburant. Un soufflage régulier et un remplacement à chaque vidange préservent votre moteur.",
      },
    ],
    astucePro:
      "Avant un long voyage vers l'intérieur du pays, faites contrôler l'état de la batterie, des plaquettes de frein et des pneus par un mécanicien BARA.",
  },
  {
    slug: "proteger-meubles-bois-termites-humidite-abidjan",
    titre: "Comment protéger vos meubles et portes en bois contre les termites et l'humidité ?",
    categorie: "Menuiserie & Bois",
    metierLie: "Menuisier",
    icone: "🪚",
    tempsLecture: "3 min",
    resume:
      "Portes qui gonflent en saison des pluies ou attaque d'insectes du bois : les bonnes pratiques pour préserver vos aménagements.",
    sections: [
      {
        sousTitre: "1. Appliquer un traitement insecticide et fongicide préventif",
        contenu:
          "Avant tout vernis ou peinture sur une porte neuve ou un placard, exigez l'application de deux couches de produit de traitement du bois contre les termites et les vrillettes.",
      },
      {
        sousTitre: "2. Isoler le bas des portes et meubles de l'eau de lavage",
        contenu:
          "Lors du lavage des sols à grande eau, le bas des portes absorbe l'humidité et gonfle. Demandez à votre menuisier de vernir également la tranche inférieure de la porte.",
      },
      {
        sousTitre: "3. Privilégier des essences locales durables",
        contenu:
          "Pour les portes extérieures et huisseries exposées, choisissez des bois durs locaux reconnus comme l'Iroko ou le Fraké bien sec.",
      },
    ],
    astucePro:
      "Si vous voyez de fines traces de sciure au pied d'un cadre de porte, faites traiter immédiatement la zone avant que les dégâts ne s'étendent.",
  },
  {
    slug: "reduire-facture-eau-sodeci-detecter-fuites-cachees",
    titre: "Facture d'eau trop élevée ? Comment détecter une fuite cachée chez soi",
    categorie: "Plomberie & Sanitaire",
    metierLie: "Plombier",
    icone: "🔧",
    tempsLecture: "3 min",
    resume:
      "Une chasse d'eau qui coule silencieusement peut doubler votre facture SODECI. Voici comment tester votre installation en 5 minutes.",
    sections: [
      {
        sousTitre: "1. Le test du compteur la nuit",
        contenu:
          "Le soir avant de dormir, fermez tous les robinets de la maison et relevez les chiffres de votre compteur d'eau. Si les chiffres ont bougé le matin sans que personne n'ait tiré d'eau, vous avez une fuite.",
      },
      {
        sousTitre: "2. Vérifier le mécanisme de la chasse d'eau",
        contenu:
          "Un mince filet d'eau permanent dans la cuvette des WC représente des centaines de litres perdus chaque jour. Le remplacement du joint ou du flotteur coûte peu cher et prend 20 minutes.",
      },
      {
        sousTitre: "3. Contrôler les flexibles sous éviers et lavabos",
        contenu:
          "Passez la main sur les flexibles tressés sous vos lavabos et votre chauffe-eau : la moindre humidité annonce une rupture prochaine du flexible.",
      },
    ],
    astucePro:
      "Installez une vanne d'arrêt générale accessible à l'entrée de votre logement pour pouvoir couper l'eau rapidement en cas d'urgence.",
  },

];
