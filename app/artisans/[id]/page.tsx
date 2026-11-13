import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'

export default function ArtisanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Chargement…</div>}
    >
      <ArtisanContent params={params} />
    </Suspense>
  )
}

async function ArtisanContent({
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{artisan.name}</h1>

      {/* Tu pourras enrichir ici plus tard avec les autres champs */}
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(artisan, null, 2)}
      </pre>
    </div>
  )
}