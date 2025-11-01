import { Edit, Shield, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type CaseStudy } from "@shared/schema";

const fallbackCaseStudies = [
  {
    icon: Edit,
    title: "Content Ops Reset",
    description: "Cut cycle time and created a single source of truth across web, brand, and content teams.",
    result: "Faster approvals, higher quality",
    slug: "content-ops-reset"
  },
  {
    icon: Shield,
    title: "Governance that Scales", 
    description: "Wired metadata and templates into tools so teams naturally follow standards.",
    result: "Consistency without policing",
    slug: "governance-that-scales"
  },
  {
    icon: BookOpen,
    title: "Adoption Program",
    description: "Live enablement, certification, and role playbooks that turned a platform into a habit.",
    result: "Real usage, measurable impact",
    slug: "adoption-program"
  }
];

export default function CaseStudies() {
  const [, setLocation] = useLocation();
  
  const { data, isLoading } = useQuery<{ success: boolean; caseStudies: CaseStudy[] }>({
    queryKey: ['/api/case-studies'],
  });

  // Use database case studies if available, fallback to static data
  const caseStudiesToShow = data?.success && data.caseStudies.length > 0
    ? data.caseStudies.map(study => ({
        icon: getIconForCaseStudy(study.title),
        title: study.title,
        description: study.summary,
        result: study.keyOutcomes[0] || "Proven results",
        slug: study.slug
      }))
    : fallbackCaseStudies;

  const handleCaseStudyClick = (slug: string) => {
    setLocation(`/case-studies/${slug}`);
  };

  return (
    <section id="cases" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" data-testid="cases-title">
            Case Studies
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="cases-subtitle">
            Short snapshots. Clear outcomes.
          </p>
        </div>

        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-8 space-y-6 animate-pulse">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="h-6 bg-muted rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudiesToShow.map((study, index) => {
              const IconComponent = study.icon;
              return (
                <article 
                  key={study.slug || index}
                  className="bg-card border border-border rounded-xl p-8 space-y-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => handleCaseStudyClick(study.slug)}
                  data-testid={`case-study-${index}`}
                >
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {study.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Result:</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{study.result}</p>
                  </div>

                  <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read full case study</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// Helper function to get appropriate icon for case study
function getIconForCaseStudy(title: string) {
  if (title.toLowerCase().includes('content') || title.toLowerCase().includes('ops')) {
    return Edit;
  }
  if (title.toLowerCase().includes('governance') || title.toLowerCase().includes('scale')) {
    return Shield;
  }
  if (title.toLowerCase().includes('adoption') || title.toLowerCase().includes('program')) {
    return BookOpen;
  }
  return Edit; // Default icon
}
