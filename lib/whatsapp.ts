export function construireLienWhatsAppArtisan(options: {
  whatsappLien?: string | null;
  telephone?: string | null;
  nomArtisan: string;
  messagePersonnalise?: string;
}): string {
  const { whatsappLien, telephone, nomArtisan, messagePersonnalise } = options;

  const lienQr = (whatsappLien || "").trim();
  if (lienQr && (lienQr.startsWith("http://") || lienQr.startsWith("https://") || lienQr.startsWith("wa.me/"))) {
    return lienQr.startsWith("wa.me/") ? `https://${lienQr}` : lienQr;
  }

  let chiffres = (telephone || "").replace(/\D/g, "");
  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = "225" + chiffres;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }

  if (!chiffres) return "";

  const texte = encodeURIComponent(
    messagePersonnalise ||
      `Bonjour ${nomArtisan}, je viens de BARA Abidjan et j'aimerais vous contacter pour un travail.`
  );

  return `https://wa.me{chiffres}?text=${texte}`;
}

export function genererLienWhatsApp(
  telephone: string | null | undefined,
  nomArtisan?: string,
  messagePersonnalise?: string,
  whatsappLien?: string | null
): string {
  return construireLienWhatsAppArtisan({
    whatsappLien,
    telephone,
    nomArtisan: nomArtisan || "l'artisan",
    messagePersonnalise,
  });
}