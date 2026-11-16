export function genererLienWhatsApp(
  telephone: string,
  nomArtisan: string,
  metier: string,
  commune?: string | null
): string {
  let chiffres = telephone.replace(/\D/g, "");

  if (chiffres.length === 10 && chiffres.startsWith("0")) {
    chiffres = `225${chiffres}`;
  } else if (chiffres.startsWith("00225")) {
    chiffres = chiffres.slice(2);
  }

  const zone = commune ? ` à ${commune}` : " à Abidjan";
  const message = `Bonjour ${nomArtisan}, j'ai trouvé votre profil (${metier}${zone}) sur la plateforme BARA. Je souhaiterais discuter d'un besoin avec vous.`;

  return `https://wa.me{chiffres}?text=${encodeURIComponent(message)}`;
}
