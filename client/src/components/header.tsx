import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => scrollToSection('home')} 
          className="font-semibold text-lg tracking-tight hover:text-primary transition-colors"
          data-testid="logo-link"
        >
          Tiago Vilas Boas
        </button>
        
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-services">
            Signature Offers
          </button>
          <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-about">
            About
          </button>
          <button onClick={() => scrollToSection('cases')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-cases">
            Case Studies
          </button>
          <button onClick={() => scrollToSection('insights')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-insights">
            Insights
          </button>
          <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-contact">
            Contact
          </button>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => scrollToSection('contact')} 
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
            data-testid="cta-book-call"
          >
            Book a Call
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md border border-border hover:bg-accent" 
            aria-label="Open Menu"
            data-testid="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95" data-testid="mobile-menu">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            <button onClick={() => scrollToSection('services')} className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left">
              Signature Offers
            </button>
            <button onClick={() => scrollToSection('about')} className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left">
              About
            </button>
            <button onClick={() => scrollToSection('cases')} className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left">
              Case Studies
            </button>
            <button onClick={() => scrollToSection('insights')} className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left">
              Insights
            </button>
            <button onClick={() => scrollToSection('contact')} className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left">
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
