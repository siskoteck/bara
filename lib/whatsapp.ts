export function construireLienWhatsAppArtisan(options: {
  whatsappLien?: string | null;
  telephone?: string | null;
  nomArtisan?: string;
  messagePersonnalise?: string;
}): string {
  const { whatsappLien, telephone } = options;

  const lienExistant = (whatsappLien || "").trim();
  if (
    lienExistant &&
    !lienExistant.includes("wa.me/qr/") &&
    !lienExistant.includes("{chiffres}") &&
    (lienExistant.startsWith("https://wa.me/225") || lienExistant.startsWith("http://wa.me"))
  ) {
    return lienExistant.split("?")[0];
  }

  let chiffres = (telephone || "").replace(/\D/g, "");
  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = "225" + chiffres;
  } else if (chiffres.length === 8) {
    chiffres = "225" + chiffres;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }

  if (!chiffres) return "";

  return "https://wa.me/" + chiffres;
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
    nomArtisan,
    messagePersonnalise,
  });
}
