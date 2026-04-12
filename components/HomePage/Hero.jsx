"use client";

import Link from "next/link";

const video = "https://www.pexels.com/download/video/8848805/";

export default function Hero() {
  return (
    <section className="relative isolate 
    overflow-hidden bg-[#070d1a] text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.pexels.com/photos/8848776/pexels-photo-8848776.jpeg?_gl=1*1i8plm4*_ga*NzkzMTk3Ny4xNzcwNTk2MTU3*_ga_8JE65Q40S6*czE3NzU5NzY3NTEkbzEyJGcxJHQxNzc1OTc3NjA2JGozNSRsMCRoMA"
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 
      bg-[radial-gradient(ellipse_at_15%_70%,rgba(99,89,255,0.13),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070d1a]/70 via-[#070d1a]/60 to-[#070d1a]" />

      <div className="absolute top-0 left-8 right-8 h-px bg-indigo-300/20" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl space-y-0">

          <p className="mb-7 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-indigo-300/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-300/50" />
            A gift only you can give them
          </p>

          <h1 className="mb-6 font-serif text-5xl font-normal leading-[1.08] 
          tracking-tight text-[#f0ecff] sm:text-[56px] lg:text-[60px]">
            Your people deserve to know{" "}
            <em className="italic text-indigo-300">exactly</em>{" "}
            what to do.
          </h1>

          <div className="mb-7 h-px w-8 bg-indigo-300/30" />

          <p className="mb-10 max-w-lg text-[17px] leading-relaxed text-indigo-200/70">
            Memora keeps your documents, accounts, and wishes in one private
            place — so when something happens, the people you love can step in
            without searching, without stress, and without delay.
          </p>

     
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center 
              justify-center rounded-[10px] bg-indigo-600 px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-500"
            >
              Set It Up Today
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center 
              rounded-[10px] border border-indigo-300/25 px-6 py-3.5 text-[15px] font-medium text-indigo-200/75 transition hover:bg-white/5"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}