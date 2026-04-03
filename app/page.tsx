import Footer from "@/components/HomePage/Footer";
import Header from "@/components/HomePage/Header";
import Hero from "@/components/HomePage/Hero";
import FAQ from "@/components/HomePage/FAQ";
import Globe3DDemo from "@/components/3d-globe-demo";
import DonationModal from "@/components/DonationModal";
import { cookies } from "next/headers";
import Testimonials from "@/components/HomePage/Testimonials";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;
  const isAuthenticated = Boolean(token);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated={isAuthenticated} />
      <section className="flex-1">
        <Hero />
      </section>
      <Testimonials />
      <Globe3DDemo />
      <DonationModal />
      <FAQ />
      <Footer />
    </main>
  );
}
