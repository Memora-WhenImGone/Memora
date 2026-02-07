"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ isAuthenticated = false }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/sign-out", { method: "POST" });
      if (res.ok) {
        alert("Logged out");
        router.push("/sign-in");
      }
    } catch (error) {
      console.log(error)
      alert("Logout failed");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900">Memora</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
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
