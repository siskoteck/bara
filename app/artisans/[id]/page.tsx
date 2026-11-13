import { notFound } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function ArtisanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = createSupabaseClient()

  const { data: artisan, error } = await supabase
    .from('artisans')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !artisan) {
    notFound()
  }

 return (
  <div>
    {/* Ici ton contenu original de la page artisan */}
    <h1>{artisan.name}</h1>
    {/* etc. */}
  </div>
)