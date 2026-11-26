export interface Artisan {
  id: string;
  created_at?: string;
  user_id?: string;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  description: string | null;
  avatar_url: string | null;
  verifie: boolean | null;
  disponible: boolean | null;
  derniere_activite?: string | null;
  recommandations?: number;
  vues?: number;
}