export interface ArtisanRow {
  id: string;
  user_id: string | null;
  name: string;
  metier: string;
  commune: string | null;
  quartier: string | null;
  telephone: string | null;
  whatsapp_lien: string | null;
  description: string | null;
  avatar_url: string | null;
  realisations: string[] | null;
  disponible: boolean | null;
  verifie: boolean | null;
  note: number | null;
  avis: number | null;
  recommandations: number | null;
  derniere_activite: string | null;
  created_at: string;
}

export interface DemandeRow {
  id: string;
  user_id: string | null;
  metier: string;
  commune: string;
  quartier: string | null;
  description: string;
  telephone: string;
  budget: string | null;
  photos: string[] | null;
  audio_url: string | null;
  statut: string | null;
  created_at: string;
}

export type DemandeInsert = Omit<DemandeRow, "id" | "created_at">;

export interface AvisRow {
  id: string;
  artisan_id: string;
  auteur: string;
  note: number;
  commentaire: string;
  created_at: string;
}