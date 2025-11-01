import { CheckCircle } from 'lucide-react';

const expertise = [
  "Brand Strategy",
  "Content Operations", 
  "Digital Governance",
  "Change Management",
  "Enablement Strategy",
  "Marketing Technology"
];

const proofPoints = [
  {
    title: "Global Content Operations",
    description: "Delivered enterprise-scale programs across multiple markets and languages"
  },
  {
    title: "Enterprise Taxonomy & Governance", 
    description: "Implemented sustainable governance frameworks adopted organization-wide"
  },
  {
    title: "Platform Migration & Adoption",
    description: "Led successful transitions with measurable team adoption and engagement"
  }
];

export default function About() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" data-testid="about-title">
                About
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="about-description-1">
                I build balanced systems where strategy, brand, and execution move together. I have led enterprise rollouts, governed complex taxonomies, and turned big programs into simple daily habits.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="about-description-2">
                I work with leaders who want clarity and results. You get straight talk, clean frameworks, and working deliverables. No fluff.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Core Expertise</h3>
              <div className="grid grid-cols-2 gap-4">
                {expertise.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2" data-testid={`expertise-${index}`}>
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={scrollToContact}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-start-conversation"
            >
              Start a Conversation
            </button>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Proven Track Record</h3>
            <div className="space-y-4">
              {proofPoints.map((point, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 space-y-3" data-testid={`proof-point-${index}`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{point.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
