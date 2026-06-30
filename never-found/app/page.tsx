import Nav from "@/components/Nav";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import EvidenceGrid from "@/components/EvidenceGrid";
import DropStrip from "@/components/DropStrip";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Nav />
      <Ticker />
      <Hero />
      <Statement />
      <EvidenceGrid />
      <DropStrip />
      <Footer />
    </main>
  );
}
