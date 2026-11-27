export function formaterNumeroCI(tel: string | null | undefined): string {
  if (!tel) return "";
  let chiffres = String(tel).replace(/\D/g, "");
  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = "225" + chiffres;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }
  return chiffres;
}

export function formaterNumeroCI8Chiffres(tel: string | null | undefined): string {
  const c10 = formaterNumeroCI(tel);
  if (c10.length === 13 && c10.startsWith("2250")) {
    return "225" + c10.slice(5);
  }
  return c10;
}

export function genererLienWhatsAppArtisan(
  tel: string | null | undefined,
  nomArtisan: string,
  messagePerso?: string
): string {
  const chiffres = formaterNumeroCI(tel);
  if (!chiffres) return "";
  const brut =
    messagePerso ||
    "Bonjour " +
      nomArtisan +
      ", j'ai vu votre profil sur BARA Abidjan et j'aimerais vous contacter pour un travail.";
  const propre = brut.replace(/[()]/g, "");
  return "https://wa.me" + chiffres + "?text=" + encodeURIComponent(propre);
}

export function genererLienWhatsAppArtisan8Chiffres(
  tel: string | null | undefined
): string {
  const chiffres8 = formaterNumeroCI8Chiffres(tel);
  if (!chiffres8) return "";
  return "https://wa.me" + chiffres8;
}
