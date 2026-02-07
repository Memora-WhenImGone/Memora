import Features from "@/components/HomePage/Features";
import Footer from "@/components/HomePage/Footer";
import Header from "@/components/HomePage/Header";
import Hero from "@/components/HomePage/Hero";
import { cookies } from "next/headers";

export default async function   Page() {
  const token = (await cookies()).get("token")?.value;
  const isAuthenticated = Boolean(token); // it returns true for defined values. 
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated={isAuthenticated} />
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
