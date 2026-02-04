import Features from "@/components/HomePage/Features";
import Footer from "@/components/HomePage/Footer";
import Header from "@/components/HomePage/Header";
import Hero from "@/components/HomePage/Hero";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <div className="mt-16">
            <Features />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}