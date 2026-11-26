export function formaterNumeroCI(tel: string | null | undefined): string {
  let chiffres = (tel || "").replace(/\D/g, "");
  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = "225" + chiffres;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }
  return chiffres;
}

export function genererLienWhatsAppArtisan(
  tel: string | null | undefined,
  nomArtisan: string,
  messagePerso?: string
): string {
  const chiffres = formaterNumeroCI(tel);
  const texte = encodeURIComponent(
    messagePerso ||
      `Bonjour ${nomArtisan}, j'ai vu votre profil sur BARA Abidjan et j'aimerais vous contacter pour un travail.`
  );
  return `https://wa.me{chiffres}?text=${texte}`;
}