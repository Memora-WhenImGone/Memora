"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function DonationModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(
      () => {
        setShowModal(true);
      }, 1500);

  }, []);

  if (!showModal) return null;


  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">

      <div
        className="absolute inset-0 bg-amber-700/30 backdrop-blur"
        onClick={() => setShowModal(false)}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl ring-1 ring-yellow-100">

        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-amber-800 via-amber-600 to-orange-700" />

        <div className="relative flex flex-col gap-6 p-7">

          <div className="text-slate-900">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">
              Fuel Memora
            </p>
            <h3 className="mt-1 text-3xl font-bold leading-tight">
              Buy us a coffee ☕
            </h3>
            <p className="mt-2 text-sm text-blue-50">
              Help us keep things secure and running smoothly.
            </p>
          </div>

          <div className="rounded-2xl border 
          border-yellow-600 bg-amber-700/50 p-3 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Scan & donate
            </p>

            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <Image
                src="/qr-code.png"
                alt="Donate"
                width={220}
                height={220}
                className="mx-auto rounded-lg border border-gray-400 bg-white shadow"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-full bg-gray-50 border border-amber-600 hover:border-s-green-700 hover:bg-red-600 hover:text-blue-50 cursor-pointer px-4 py-3 
             font-medium transition text-emerald-900 
            hover:border-yellow-300 "
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}