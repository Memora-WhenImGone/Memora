"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header({ isAuthenticated = false }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/sign-out", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out");
        router.push("/sign-in");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-semibold text-gray-900">Memora</Link>
        </div>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#security" className="hover:text-gray-900">Security</a>
          <a href="#faq" className="hover:text-gray-900">FAQ</a>
          <a href="#team" className="hover:text-gray-900">Team</a>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
