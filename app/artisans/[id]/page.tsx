import { Suspense } from 'react'
import Link from 'next/link'
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

// Numéros ivoiriens : 10 chiffres, indicatif 225 pour WhatsApp
function whatsappLink(telephone: string, nom: string): string | null {
  const digits = telephone.replace(/\D/g, '')
  if (digits.length < 8) return null
  const number = digits.startsWith('225') ? digits : `225${digits}`
  const message = encodeURIComponent(
    `Bonjour ${nom}, je vous contacte depuis BARA. J'ai besoin d'un devis.`
  )
  return `https://wa.me/${number}?text=${message}`
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
    .maybeSingle()

  if (error) {
    console.error('Erreur Supabase:', error)
  }

  if (error || !artisan) {
    notFound()
  }

  const lienWhatsApp = artisan.telephone
    ? whatsappLink(artisan.telephone, artisan.name)
    : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/artisans"
        className="text-sm text-orange-600 hover:underline"
      >
        ← Retour aux artisans
      </Link>

      <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {artisan.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artisan.photo_url}
            alt={artisan.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold">{artisan.name}</h1>
            {artisan.verifie && (
              <span className="shrink-0 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                ✓ Vérifié
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
            {artisan.metier && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {artisan.metier}
              </span>
            )}
            {artisan.commune && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                📍 {artisan.commune}
              </span>
            )}
          </div>

          {artisan.description && (
            <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
              {artisan.description}
            </p>
          )}

          {lienWhatsApp ? (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={lienWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
              >
                Contacter sur WhatsApp
              </a>
              <a
                href={`tel:${artisan.telephone.replace(/\s/g, '')}`}
                className="flex-1 text-center border border-gray-300 hover:bg-gray-50 font-semibold py-3 rounded-lg"
              >
                Appeler
              </a>
            </div>
          ) : (
            <p className="mt-8 text-sm text-gray-500">
              Cet artisan n&apos;a pas encore renseigné de numéro de téléphone.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}