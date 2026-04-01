"use client";

import Link from "next/link";

const video =
  "https://cdn.pixabay.com/video/2024/12/17/247123_large.mp4";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gray-950 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.pexels.com/photos/5380640/pexels-photo-5380640.jpeg"
      >
        <source src={video} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.45em] text-indigo-200">
            Digital legacy, delivered
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Hand off the keys to your life with absolute certainty.
          </h1>
          <p className="text-lg text-indigo-100">
            Memora packages passwords, directives, and memories into one
            encrypted vault, then releases it to the right people the moment
            verifiable triggers fire, so there are no frantic searches or
            second guessing.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center 
              rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold 
              text-white shadow-lg shadow-indigo-600/40 transition hover:bg-indigo-500"
            >
              Create a Vault
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center 
              rounded-xl border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm text-indigo-100 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="font-semibold">Smart triggers you orchestrate</dt>
            <dd className="mt-1 text-indigo-100/80">
              Inactivity timers, wellness check-ins, and manual confirmations decide when encrypted packets leave your vault.
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="font-semibold">Trusted contacts with scoped access</dt>
            <dd className="mt-1 text-indigo-100/80">
              Pair every contact with the exact files, directives, or access policies they'll receive, complete with delivery logging.
            </dd>
          </div>
        </div>
      </div>
    </section>
  );
}
