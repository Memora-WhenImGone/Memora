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
        className="absolute inset-0 bg-yellow-200/60 backdrop-blur"
        onClick={() => setShowModal(false)}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-yellow-100">
        
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400" />

        <div className="relative flex flex-col gap-6 p-7">
          
          <div className="text-slate-900">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600">
              Fuel Memora
            </p>
            <h3 className="mt-1 text-3xl font-bold leading-tight">
              Buy us a coffee ☕
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Help us keep things secure and running smoothly.
            </p>
          </div>

          <div className="rounded-2xl border 
          border-yellow-100 bg-yellow-50 p-5 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Scan & donate
            </p>

            <div className="mt-4 rounded-xl bg-yellow-100 p-4">
              <Image
                src="/hero/qrcode.png"
                alt="Donate"
                width={220}
                height={220}
                className="mx-auto rounded-lg border border-yellow-200 bg-white shadow"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-full border border-yellow-200 px-4 py-3 
            text-sm font-medium text-slate-600 transition 
            hover:border-yellow-300 hover:text-slate-900"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}