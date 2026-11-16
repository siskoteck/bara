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

  const lieu = commune ? ` à ${commune}` : " à Abidjan";
  const message = `Bonjour ${nomArtisan}, j'ai trouvé votre profil (${metier}${lieu}) sur BARA et j'aimerais discuter avec vous pour un besoin.`;

  return `https://whatsapp.com{chiffres}&text=${encodeURIComponent(
    message
  )}`;
}
