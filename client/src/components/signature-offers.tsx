import { CheckCircle, TrendingUp, Link as LinkIcon, Users } from 'lucide-react';

const offers = [
  {
    icon: CheckCircle,
    title: "The Governance Blueprint™",
    description: "I embed brand, content, and compliance standards into your tools, workflows, and templates so governance becomes invisible, adoption natural.",
    who: "CMOs and Comms leaders scaling globally",
    outcome: "Consistency without bureaucracy",
    format: "Discovery, blueprint, wiring, enablement"
  },
  {
    icon: TrendingUp,
    title: "Adoption-as-a-Service™",
    description: "An ongoing enablement program. I turn platforms and processes into habits using live training, playbooks, certifications, and cultural nudges.",
    who: "Enterprise leaders tired of shelfware",
    outcome: "Measurable adoption and usage",
    format: "Quarterly cycles, metrics, reinforcement"
  },
  {
    icon: LinkIcon,
    title: "M&A Brand Integration Lab™",
    description: "A time-boxed war room for aligning brand, governance, and content operations during M&A or major transitions. Fast clarity, confident execution.",
    who: "Executives navigating shifts",
    outcome: "Stability with speed",
    format: "Frameworks, decisions, execution plans"
  },
  {
    icon: Users,
    title: "Executive Shadow Partner™",
    description: "A discreet advisory seat next to you. Enterprise-tested frameworks, clear answers, and hands-on help on brand, operations, and digital transformation.",
    who: "C-Suite leaders",
    outcome: "Better decisions, fewer cycles",
    format: "Retainer with defined cadences"
  }
];

export default function SignatureOffers() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" data-testid="services-title">
            Signature Offers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-subtitle">
            High-impact, time-bound engagements designed for leaders who want outcomes, not theory.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {offers.map((offer, index) => {
            const IconComponent = offer.icon;
            return (
              <article 
                key={index}
                className="service-card bg-card border border-border rounded-xl p-8 space-y-6 hover:shadow-lg transition-all duration-200"
                data-testid={`service-card-${index}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">{offer.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      <strong>Who:</strong> {offer.who}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      <strong>Outcome:</strong> {offer.outcome}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      <strong>Format:</strong> {offer.format}
                    </span>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
