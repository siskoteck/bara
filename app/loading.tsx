import { GrilleArtisansSkeleton } from "@/components/shared/BaraSkeletons";

export default function LoadingBaraGlobal() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="animate-pulse space-y-3 max-w-xl">
        <div className="h-5 bg-orange-100 rounded-full w-36" />
        <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
        <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
      </div>

      <GrilleArtisansSkeleton count={6} />
    </div>
  );
}
