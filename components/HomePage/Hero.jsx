import Link from "next/link";

export default function Hero() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Secure Your Digital Legacy
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
        Memora helps you organize, protect, and pass on your important documents, credentials, and memories to your trusted contacts when you need it most.
      </p>
      

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/create-vault"
          className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white text-base font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create Your Vault
        </Link>
        <Link
          href="/sign-in"
          className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 text-base font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}