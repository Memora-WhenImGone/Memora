"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const members = [
  {
    name: "Mohd Bilal",
    designation: "Backend Engineer & DevOps",
    src: "/team/Mohd Bilal.jpeg",
    quote:
      "A full-stack developer based in 🇨🇦 Canada. I build scalable web applications, improve backend performance, and fix legacy code. Passionate about clean architecture, meaningful products, and solving real-world problems through code.",
  },
  {
    name: "Palak Rani",
    designation: "Database Specialist",
    src: "/team/Palak Rani.png",
    quote: "Database Specialist",
  },
  {
    name: "Vanshika Chouhan",
    designation: "Front-end Developer",
    src: "/team/Vanshika Chouhan.png",
    quote: "Front-end Developer",
  },
  {
    name: "Soni",
    designation: "Front-end Developer",
    src: "/team/Soni.png",
    quote: "Front-end Developer",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Meet the Team</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">The people behind Memora</h2>
        </div>
        <div className="mt-6">
          <AnimatedTestimonials testimonials={members} autoplay />
        </div>
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-600">
            <span>Section by</span>
            <a
              href="https://ui.aceternity.com/components"
              target="_blank"
              className="underline hover:text-gray-900"
            >
              Aceternity UI
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
