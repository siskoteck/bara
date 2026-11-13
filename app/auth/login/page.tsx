import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Connexion</h1>
        <p className="text-gray-600 text-center mb-8">
          Accédez à votre compte BARA
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Téléphone ou Email
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="07 00 00 00 00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end">
            <Link href="#" className="text-sm text-orange-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="text-orange-600 font-medium hover:underline"
          >
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}