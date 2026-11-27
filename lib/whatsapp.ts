export function construireLienWhatsAppArtisan(options) {
  const { whatsappLien, telephone, nomArtisan, messagePersonnalise } = options;

  const lienQr = (whatsappLien || "").trim();
  if (lienQr && !lienQr.includes("wa.me/qr/") && !lienQr.includes("{chiffres}")) {
    if (lienQr.startsWith("http://") || lienQr.startsWith("https://")) {
      return lienQr;
    }
    if (lienQr.startsWith("wa.me/")) {
      return "https://" + lienQr;
    }
  }

  let chiffres = (telephone || "").replace(/\D/g, "");
  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = "225" + chiffres;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }

  if (!chiffres) return "";

  const brut = messagePersonnalise || ("Bonjour " + nomArtisan + ", je viens de BARA Abidjan et j'aimerais vous contacter pour un travail.");
  const propre = brut.replace(/[()]/g, "");

  return "https://wa.me" + chiffres + "?text=" + encodeURIComponent(propre);
}

export function genererLienWhatsApp(telephone, nomArtisan, messagePersonnalise, whatsappLien) {
  return construireLienWhatsAppArtisan({
    whatsappLien,
    telephone,
    nomArtisan: nomArtisan || "l'artisan",
    messagePersonnalise,
  });
}
