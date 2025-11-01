export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground" data-testid="footer-copyright">
            © 2024 Tiago Vilas Boas. Strategy, Brand & Execution Ecosystems.
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-privacy">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-terms">
              Terms
            </a>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hover:text-foreground transition-colors" 
              data-testid="footer-contact"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
