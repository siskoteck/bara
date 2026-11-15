// Supabase exige un e-mail : on fabrique une adresse fictive à partir du téléphone.
// Utilisée à l'inscription ET à la connexion pour obtenir exactement la même adresse.
export function telephoneVersEmail(telephone: string) {
  const chiffres = telephone.replace(/\D/g, ""); // garde uniquement les chiffres
  return `${chiffres}@bara.ci`;
}