import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Insight } from '@shared/schema';

interface InsightResponse {
  success: boolean;
  insight: Insight;
}

export default function InsightPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: response, isLoading, error } = useQuery<InsightResponse>({
    queryKey: ['/api/insights', slug],
    enabled: !!slug,
  });

  const insight = response?.insight;

  const navigateBack = () => {
    const element = document.getElementById('insights');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#insights';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 pt-20">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 pt-20">
          <button 
            onClick={navigateBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            data-testid="button-back-insights"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </button>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Insight Not Found</h1>
            <p className="text-muted-foreground">The insight you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <button 
          onClick={navigateBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-testid="button-back-insights"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Insights
        </button>

        <header className="space-y-6 mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight" data-testid="insight-title">
            {insight.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={new Date(insight.createdAt).toISOString()}>
                {format(new Date(insight.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>

          {insight.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="insight-excerpt">
              {insight.excerpt}
            </p>
          )}
        </header>

        <div 
          className="prose prose-lg max-w-none prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-strong:text-foreground prose-blockquote:border-l-primary"
          data-testid="insight-content"
          dangerouslySetInnerHTML={{ __html: insight.content }}
        />

        <footer className="mt-16 pt-8 border-t border-border">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Want to discuss how these frameworks can apply to your organization?
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#contact';
                }
              }}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-contact-from-insight"
            >
              Start a Conversation
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}