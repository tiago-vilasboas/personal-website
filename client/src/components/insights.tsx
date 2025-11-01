import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Zap, Shield, Archive, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Insight } from '@shared/schema';

interface InsightsResponse {
  success: boolean;
  insights: Insight[];
}

const fallbackInsights = [
  {
    icon: Zap,
    title: "The Adoption Ladder",
    description: "A simple way to move teams from awareness to habit using lightweight rituals.",
    slug: "adoption-ladder"
  },
  {
    icon: Shield,
    title: "Governance Without Friction", 
    description: "How to bake standards into the work so compliance feels invisible.",
    slug: "governance-without-friction"
  },
  {
    icon: Archive,
    title: "The M&A Decision Stack",
    description: "The four calls to make early so the brand stays coherent under pressure.",
    slug: "ma-decision-stack"
  }
];

export default function Insights() {
  const [, setLocation] = useLocation();
  
  const { data: response, isLoading } = useQuery<InsightsResponse>({
    queryKey: ['/api/insights'],
  });

  const insights = response?.insights || [];
  const displayInsights = insights.length > 0 ? insights : fallbackInsights;

  const handleInsightClick = (insight: Insight | typeof fallbackInsights[0]) => {
    if ('slug' in insight && typeof insight.slug === 'string') {
      setLocation(`/insights/${insight.slug}`);
    }
  };

  return (
    <section id="insights" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" data-testid="insights-title">
            Insights
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="insights-subtitle">
            Notes and frameworks I use in the field.
          </p>
        </div>

        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-8 space-y-4 animate-pulse">
                <div className="p-3 bg-muted rounded-lg w-12 h-12"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {displayInsights.map((insight, index) => {
              const isDbInsight = 'createdAt' in insight;
              const IconComponent = isDbInsight ? Archive : (fallbackInsights[index]?.icon || Archive);
              
              return (
                <article 
                  key={isDbInsight ? insight.id : index}
                  className="bg-card border border-border rounded-xl p-8 space-y-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  data-testid={`insight-${index}`}
                  onClick={() => handleInsightClick(insight)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-accent rounded-lg w-fit">
                        <IconComponent className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {insight.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {isDbInsight ? insight.excerpt : insight.description}
                      </p>
                    </div>

                    {isDbInsight && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                        <Calendar className="w-4 h-4" />
                        <time>
                          {format(new Date(insight.createdAt), 'MMM d, yyyy')}
                        </time>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {insights.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Coming soon: In-depth insights and frameworks from the field.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
