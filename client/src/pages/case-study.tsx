import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Target, CheckCircle } from "lucide-react";
import { type CaseStudy } from "@shared/schema";

export default function CaseStudyPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<{ success: boolean; caseStudy: CaseStudy }>({
    queryKey: [`/api/case-studies/${slug}`],
    enabled: !!slug,
  });

  const handleBackClick = () => {
    setLocation('/#cases');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-12 bg-muted rounded w-2/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Button>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Case Study Not Found</h1>
            <p className="text-muted-foreground">
              The case study you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const caseStudy = data.caseStudy;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Case Studies
        </Button>

        <article className="space-y-8">
          <header className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight" data-testid="text-case-study-title">
              {caseStudy.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span data-testid="text-client-type">{caseStudy.clientType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span data-testid="text-duration">{caseStudy.duration}</span>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-summary">
              {caseStudy.summary}
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">The Challenge</h2>
                </div>
                <div className="prose prose-lg max-w-none" data-testid="text-challenge">
                  <div dangerouslySetInnerHTML={{ __html: caseStudy.challenge }} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">The Solution</h2>
                </div>
                <div className="prose prose-lg max-w-none" data-testid="text-solution">
                  <div dangerouslySetInnerHTML={{ __html: caseStudy.solution }} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Results & Impact</h2>
                </div>
                <div className="prose prose-lg max-w-none" data-testid="text-results">
                  <div dangerouslySetInnerHTML={{ __html: caseStudy.results }} />
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Key Outcomes</h3>
                <ul className="space-y-3">
                  {caseStudy.keyOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`text-outcome-${index}`}>
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Ready for Similar Results?</h3>
                <p className="text-sm text-muted-foreground">
                  Let's discuss how these strategies can work for your organization.
                </p>
                <Button
                  onClick={() => {
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#contact';
                    }
                  }}
                  className="w-full"
                  data-testid="button-contact"
                >
                  Start a Conversation
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}