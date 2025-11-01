import Header from '@/components/header';
import Hero from '@/components/hero';
import SignatureOffers from '@/components/signature-offers';
import About from '@/components/about';
import CaseStudies from '@/components/case-studies';
import Insights from '@/components/insights';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main>
        <Hero />
        <SignatureOffers />
        <About />
        <CaseStudies />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
