"use client";
import { useMemo, useState } from "react";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";

const markers: GlobeMarker[] = [
  { lat: 30.0444, lng: 31.2357, src: "https://assets.aceternity.com/avatars/2.webp", label: "Aisha  •  Sister  •  Verified" },
  { lat: 24.8607, lng: 67.0011, src: "https://assets.aceternity.com/avatars/6.webp", label: "Ayesha  •  Sister  •  Invited" },
  { lat: 51.5072, lng: -0.1276, src: "https://assets.aceternity.com/avatars/9.webp", label: "Sarah  •  Friend  •  Ready" },
  { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/12.webp", label: "Layla  •  Cousin  •  Verified" },
];

export default function Globe3DDemo() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const globeConfig = useMemo(
    () => ({
      showAtmosphere: true,
      atmosphereColor: "#7aa2ff",
      atmosphereIntensity: 0.35,
      atmosphereBlur: 3,
      bumpScale: 1.5,
      autoRotateSpeed: 0.25,
      enableZoom: false,
      enablePan: false,
      ambientIntensity: 0.65,
      pointLightIntensity: 1.6,
      showWireframe: false,
      markerSize: 0.06,
      backgroundColor: null,
    }),
    [],
  );

  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
   
          <div className="mx-auto w-full max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600/80">Global trusted access</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              Trusted Access Across the World
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Prepare secure delivery for the people who matter most. 
              Memora helps you organize private files, assign trusted contacts, and control access with care.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full border 
              border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm backdrop-blur">
                End-to-end protected
              </span>
              <span className="inline-flex items-center rounded-full border 
              border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm backdrop-blur">
                Trusted contact access
              </span>
              <span className="inline-flex items-center rounded-full border 
              border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700 shadow-sm backdrop-blur">
                Release only when needed
              </span>
            </div>

            <div className="mt-8">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg 
                bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow-sm 
                transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              >
                See How It Works
              </a>
              <div className="mt-4">
                <a
                  href="https://ui.aceternity.com"
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-full 
                  border border-gray-200 bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 
                  shadow-sm backdrop-blur hover:bg-white hover:text-gray-900 dark:border-neutral-800 
                  dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:bg-neutral-900"
                >
                  Powered By Aceternity UI
                </a>
              </div>
            </div>
          </div>

    
          <div className="relative mx-auto w-full max-w-2xl">
          
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-200 via-blue-100 to-emerald-100 opacity-70 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/40 blur-2xl" />
            </div>

            <div className="relative rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-[0_10px_40px_-10px_rgba(2,6,23,0.25)] backdrop-blur-md sm:p-6">
              <Globe3D
                className="h-[380px] sm:h-[460px] md:h-[520px]"
                markers={markers}
                config={globeConfig}
                onMarkerClick={(marker) => {
                  console.log("Clicked marker:", marker.label);
                }}
                onMarkerHover={(marker) => {
                  setActiveLabel(marker?.label ?? null);
                }}
              />

              <div className="pointer-events-none mt-3 min-h-[28px] text-center text-sm text-slate-600">
                {activeLabel ? (
                  <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 shadow-sm backdrop-blur">
                    {activeLabel}
                  </span>
                ) : (
                  <span className="text-slate-400">Hover a contact to preview</span>
                )}
              </div>

              
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-2 left-2 hidden translate-y-[-40%] sm:block">
                  <div className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur-md">
                    Encrypted Vault
                  </div>
                </div>
                <div className="absolute right-2 top-8 hidden sm:block">
                  <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur-md">
                    Trusted Contact Verified
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 hidden sm:block">
                  <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur-md">
                    Release Status: Protected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
