"use client";
import Link from "next/link";

export default function Header({ isAuthenticated = false }) {
  return (
    <header className="bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900">Memora</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gray-900 text-white 
              text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </Link>
            
          )}
          {!isAuthenticated && (
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
