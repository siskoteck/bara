import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase' // garde ton chemin d'import actuel

export const dynamic = 'force-dynamic' // la page est générée à chaque visite, pas au build

export default async function ArtisanPage({ params }) {
  const { id } = await params

  const { data: artisan, error } = await supabase
    .from('artisans')   // remplace par le vrai nom de ta table
    .select('*')
    .eq('id', id)
    .single()

  if (error || !artisan) notFound()

  return (
    // ton affichage actuel
  )
}