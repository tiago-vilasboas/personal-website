import { ChevronDown, MessageCircle, MapPin, Globe } from 'lucide-react';
import tiagoImage from '@assets/tiago-vilas-boas-speaker_1758800336646.png';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden hero-grid">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight" data-testid="hero-title">
                I design ecosystems where{' '}
                <span className="gradient-text">strategy, brand, and execution</span>{' '}
                move as one.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl" data-testid="hero-subtitle">
                The result: trust at scale, faster decisions, and operations that actually work in the real world.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('services')}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
                data-testid="button-explore-offers"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Explore Signature Offers
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
                data-testid="button-book-call"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Book a Call
              </button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Based in Switzerland
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                Working with global teams
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-3xl"></div>
              <div className="relative w-80 h-64 lg:w-[480px] lg:h-80 rounded-2xl overflow-hidden border border-border bg-card shadow-xl">
                <img 
                  src={tiagoImage} 
                  alt="Tiago Vilas Boas - Strategy and Brand Consultant" 
                  className="w-full h-full object-cover"
                  data-testid="hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
