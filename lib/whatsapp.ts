export function construireLienWhatsAppArtisan(options: {
  whatsappLien?: string | null;
  telephone?: string | null;
  nomArtisan: string;
  messagePersonnalise?: string;
}): string {
  const { whatsappLien, telephone, nomArtisan, messagePersonnalise } = options;

  // 1. Priorité absolue au lien issu de la conversion du QR Code WhatsApp
  const lienQr = (whatsappLien || "").trim();
  if (lienQr) {
    if (lienQr.startsWith("http://") || lienQr.startsWith("https://")) {
      return lienQr;
    }
    if (lienQr.startsWith("wa.me/")) {
      return "https://" + lienQr;
    }
    // Si l'artisan a collé uniquement le code après wa.me/qr/
    return "https://wa.me" + lienQr.replace(/^\/+/, "");
  }

  // 2. Repli automatique sur le numéro Côte d'Ivoire (+225)
  let chiffres = (telephone || "").replace(/\D/g, "");
  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = "225" + chiffres;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }

  const texte = encodeURIComponent(
    messagePersonnalise ||
      `Bonjour ${nomArtisan}, je viens de BARA Abidjan et j'aimerais vous contacter pour un travail.`
  );

  return `https://wa.me{chiffres}?text=${texte}`;
}
