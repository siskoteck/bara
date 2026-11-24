export function CarteArtisanSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm animate-pulse flex flex-col justify-between space-y-4">
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-3 bg-orange-100 rounded-lg w-1/2" />
          <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="h-9 bg-gray-200 rounded-xl" />
        <div className="h-9 bg-orange-100 rounded-xl" />
      </div>
    </div>
  );
}

export function GrilleArtisansSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CarteArtisanSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProfilArtisanSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-24 h-24 rounded-3xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="h-5 bg-orange-100 rounded-full w-32" />
          <div className="h-7 bg-gray-200 rounded-xl w-2/3" />
          <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 bg-gray-200 rounded-xl w-36" />
            <div className="h-10 bg-orange-100 rounded-xl w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FallbackErreurBara({
  titre = "Impossible de charger les données",
  message = "Vérifiez votre connexion internet à Abidjan ou réessayez dans un instant.",
  onReessayer,
}: {
  titre?: string;
  message?: string;
  onReessayer?: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-orange-200 p-8 sm:p-10 text-center max-w-xl mx-auto my-8 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mx-auto mb-3">
        ⚠️
      </div>
      <h2 className="text-lg font-black text-gray-900">{titre}</h2>
      <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
        {message}
      </p>
      {onReessayer && (
        <button
          type="button"
          onClick={onReessayer}
          className="mt-5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          🔄 Réessayer maintenant
        </button>
      )}
    </div>
  );
}
