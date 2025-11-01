import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, Save, X, BookOpen, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Insight, InsertInsight, UpdateInsight, CaseStudy, InsertCaseStudy, UpdateCaseStudy } from '@shared/schema';

interface InsightsResponse {
  success: boolean;
  insights: Insight[];
}

interface CaseStudiesResponse {
  success: boolean;
  caseStudies: CaseStudy[];
}

interface InsightFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
}

interface CaseStudyFormData {
  title: string;
  slug: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  clientType: string;
  duration: string;
  keyOutcomes: string[];
  published: boolean;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('insights');
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [isCreatingInsight, setIsCreatingInsight] = useState(false);
  const [isCreatingCaseStudy, setIsCreatingCaseStudy] = useState(false);
  
  const [insightFormData, setInsightFormData] = useState<InsightFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false
  });
  
  const [caseStudyFormData, setCaseStudyFormData] = useState<CaseStudyFormData>({
    title: '',
    slug: '',
    summary: '',
    challenge: '',
    solution: '',
    results: '',
    clientType: '',
    duration: '',
    keyOutcomes: [''],
    published: false
  });

  // Data fetching
  const { data: insightsResponse, isLoading: isLoadingInsights } = useQuery<InsightsResponse>({
    queryKey: ['/api/insights?published=false'],
  });

  const { data: caseStudiesResponse, isLoading: isLoadingCaseStudies } = useQuery<CaseStudiesResponse>({
    queryKey: ['/api/case-studies?published=false'],
  });

  const insights = insightsResponse?.insights || [];
  const caseStudies = caseStudiesResponse?.caseStudies || [];

  // Insight mutations
  const createInsightMutation = useMutation({
    mutationFn: async (data: InsertInsight) => {
      const response = await apiRequest('POST', '/api/insights', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insights?published=false'] });
      resetInsightForm();
      toast({
        title: "Insight created successfully!",
        description: "The new insight has been added to the database.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating insight",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateInsightMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInsight }) => {
      const response = await apiRequest('PUT', `/api/insights/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insights?published=false'] });
      resetInsightForm();
      toast({
        title: "Insight updated successfully!",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating insight",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteInsightMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/insights/${id}`, null);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insights?published=false'] });
      toast({
        title: "Insight deleted successfully!",
        description: "The insight has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting insight",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Case Study mutations
  const createCaseStudyMutation = useMutation({
    mutationFn: async (data: InsertCaseStudy) => {
      const response = await apiRequest('POST', '/api/case-studies', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/case-studies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/case-studies?published=false'] });
      resetCaseStudyForm();
      toast({
        title: "Case study created successfully!",
        description: "The new case study has been added to the database.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating case study",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateCaseStudyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCaseStudy }) => {
      const response = await apiRequest('PUT', `/api/case-studies/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/case-studies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/case-studies?published=false'] });
      resetCaseStudyForm();
      toast({
        title: "Case study updated successfully!",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating case study",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteCaseStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/case-studies/${id}`, null);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/case-studies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/case-studies?published=false'] });
      toast({
        title: "Case study deleted successfully!",
        description: "The case study has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting case study",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Form reset functions
  const resetInsightForm = () => {
    setInsightFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      published: false
    });
    setEditingInsight(null);
    setIsCreatingInsight(false);
  };

  const resetCaseStudyForm = () => {
    setCaseStudyFormData({
      title: '',
      slug: '',
      summary: '',
      challenge: '',
      solution: '',
      results: '',
      clientType: '',
      duration: '',
      keyOutcomes: [''],
      published: false
    });
    setEditingCaseStudy(null);
    setIsCreatingCaseStudy(false);
  };

  // Helper functions
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Insight handlers
  const handleCreateInsight = () => {
    resetInsightForm();
    setIsCreatingInsight(true);
  };

  const handleEditInsight = (insight: Insight) => {
    setEditingInsight(insight);
    setInsightFormData({
      title: insight.title,
      slug: insight.slug,
      excerpt: insight.excerpt,
      content: insight.content,
      published: insight.published
    });
    setIsCreatingInsight(true);
  };

  const handleInsightTitleChange = (title: string) => {
    setInsightFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleInsightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInsight) {
      updateInsightMutation.mutate({
        id: editingInsight.id,
        data: insightFormData
      });
    } else {
      createInsightMutation.mutate(insightFormData);
    }
  };

  const handleDeleteInsight = (insight: Insight) => {
    if (window.confirm(`Are you sure you want to delete "${insight.title}"?`)) {
      deleteInsightMutation.mutate(insight.id);
    }
  };

  // Case Study handlers
  const handleCreateCaseStudy = () => {
    resetCaseStudyForm();
    setIsCreatingCaseStudy(true);
  };

  const handleEditCaseStudy = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setCaseStudyFormData({
      title: caseStudy.title,
      slug: caseStudy.slug,
      summary: caseStudy.summary,
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      results: caseStudy.results,
      clientType: caseStudy.clientType,
      duration: caseStudy.duration,
      keyOutcomes: caseStudy.keyOutcomes,
      published: caseStudy.published
    });
    setIsCreatingCaseStudy(true);
  };

  const handleCaseStudyTitleChange = (title: string) => {
    setCaseStudyFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleCaseStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCaseStudy) {
      updateCaseStudyMutation.mutate({
        id: editingCaseStudy.id,
        data: caseStudyFormData
      });
    } else {
      createCaseStudyMutation.mutate(caseStudyFormData);
    }
  };

  const handleDeleteCaseStudy = (caseStudy: CaseStudy) => {
    if (window.confirm(`Are you sure you want to delete "${caseStudy.title}"?`)) {
      deleteCaseStudyMutation.mutate(caseStudy.id);
    }
  };

  // Key outcomes management
  const addKeyOutcome = () => {
    setCaseStudyFormData(prev => ({
      ...prev,
      keyOutcomes: [...prev.keyOutcomes, '']
    }));
  };

  const removeKeyOutcome = (index: number) => {
    setCaseStudyFormData(prev => ({
      ...prev,
      keyOutcomes: prev.keyOutcomes.filter((_, i) => i !== index)
    }));
  };

  const updateKeyOutcome = (index: number, value: string) => {
    setCaseStudyFormData(prev => ({
      ...prev,
      keyOutcomes: prev.keyOutcomes.map((outcome, i) => i === index ? value : outcome)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Admin</h1>
            <p className="text-muted-foreground mt-2">Manage your insights and case studies</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights" className="flex items-center gap-2" data-testid="tab-insights">
              <FileText className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="case-studies" className="flex items-center gap-2" data-testid="tab-case-studies">
              <BookOpen className="w-4 h-4" />
              Case Studies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Insights Management</h2>
              {!isCreatingInsight && (
                <button
                  onClick={handleCreateInsight}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  data-testid="button-create-insight"
                >
                  <Plus className="w-4 h-4" />
                  New Insight
                </button>
              )}
            </div>

            {isCreatingInsight && (
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {editingInsight ? 'Edit Insight' : 'Create New Insight'}
                  </h3>
                  <button
                    onClick={resetInsightForm}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    data-testid="button-close-insight-form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleInsightSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="insight-title" className="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        id="insight-title"
                        value={insightFormData.title}
                        onChange={(e) => handleInsightTitleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Insight title"
                        required
                        data-testid="input-insight-title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="insight-slug" className="text-sm font-medium">Slug</label>
                      <input
                        type="text"
                        id="insight-slug"
                        value={insightFormData.slug}
                        onChange={(e) => setInsightFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="url-friendly-slug"
                        required
                        data-testid="input-insight-slug"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="insight-excerpt" className="text-sm font-medium">Excerpt</label>
                    <textarea
                      id="insight-excerpt"
                      rows={3}
                      value={insightFormData.excerpt}
                      onChange={(e) => setInsightFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Brief summary of the insight"
                      required
                      data-testid="textarea-insight-excerpt"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="insight-content" className="text-sm font-medium">Content (HTML)</label>
                    <textarea
                      id="insight-content"
                      rows={12}
                      value={insightFormData.content}
                      onChange={(e) => setInsightFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono text-sm"
                      placeholder="<p>Your insight content in HTML...</p>"
                      required
                      data-testid="textarea-insight-content"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="insight-published"
                      checked={insightFormData.published}
                      onChange={(e) => setInsightFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-input"
                      data-testid="checkbox-insight-published"
                    />
                    <label htmlFor="insight-published" className="text-sm font-medium">
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={createInsightMutation.isPending || updateInsightMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      data-testid="button-save-insight"
                    >
                      <Save className="w-4 h-4" />
                      {createInsightMutation.isPending || updateInsightMutation.isPending 
                        ? 'Saving...' 
                        : editingInsight ? 'Update' : 'Create'
                      }
                    </button>
                    <button
                      type="button"
                      onClick={resetInsightForm}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                      data-testid="button-cancel-insight"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Insights</h3>
              
              {isLoadingInsights ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : insights.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground">No insights created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="bg-card border border-border rounded-lg p-6"
                      data-testid={`insight-item-${insight.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold">{insight.title}</h4>
                          <p className="text-muted-foreground text-sm">{insight.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Slug: {insight.slug}</span>
                            <span className={`px-2 py-1 rounded ${insight.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {insight.published ? 'Published' : 'Draft'}
                            </span>
                            <span>Created: {new Date(insight.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/insights/${insight.slug}`, '_blank')}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Preview"
                            data-testid={`button-preview-insight-${insight.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditInsight(insight)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Edit"
                            data-testid={`button-edit-insight-${insight.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInsight(insight)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete"
                            data-testid={`button-delete-insight-${insight.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Case Studies Management</h2>
              {!isCreatingCaseStudy && (
                <button
                  onClick={handleCreateCaseStudy}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  data-testid="button-create-case-study"
                >
                  <Plus className="w-4 h-4" />
                  New Case Study
                </button>
              )}
            </div>

            {isCreatingCaseStudy && (
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {editingCaseStudy ? 'Edit Case Study' : 'Create New Case Study'}
                  </h3>
                  <button
                    onClick={resetCaseStudyForm}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    data-testid="button-close-case-study-form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCaseStudySubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="case-study-title" className="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        id="case-study-title"
                        value={caseStudyFormData.title}
                        onChange={(e) => handleCaseStudyTitleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Case study title"
                        required
                        data-testid="input-case-study-title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="case-study-slug" className="text-sm font-medium">Slug</label>
                      <input
                        type="text"
                        id="case-study-slug"
                        value={caseStudyFormData.slug}
                        onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="url-friendly-slug"
                        required
                        data-testid="input-case-study-slug"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="case-study-client-type" className="text-sm font-medium">Client Type</label>
                      <input
                        type="text"
                        id="case-study-client-type"
                        value={caseStudyFormData.clientType}
                        onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, clientType: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., Fortune 500, Startup, SMB"
                        required
                        data-testid="input-case-study-client-type"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="case-study-duration" className="text-sm font-medium">Duration</label>
                      <input
                        type="text"
                        id="case-study-duration"
                        value={caseStudyFormData.duration}
                        onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., 6 months, 1 year"
                        required
                        data-testid="input-case-study-duration"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="case-study-summary" className="text-sm font-medium">Summary</label>
                    <textarea
                      id="case-study-summary"
                      rows={3}
                      value={caseStudyFormData.summary}
                      onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Brief overview of the case study"
                      required
                      data-testid="textarea-case-study-summary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="case-study-challenge" className="text-sm font-medium">Challenge</label>
                    <textarea
                      id="case-study-challenge"
                      rows={4}
                      value={caseStudyFormData.challenge}
                      onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, challenge: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Describe the main challenges faced"
                      required
                      data-testid="textarea-case-study-challenge"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="case-study-solution" className="text-sm font-medium">Solution</label>
                    <textarea
                      id="case-study-solution"
                      rows={4}
                      value={caseStudyFormData.solution}
                      onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, solution: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Describe the solution implemented"
                      required
                      data-testid="textarea-case-study-solution"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="case-study-results" className="text-sm font-medium">Results</label>
                    <textarea
                      id="case-study-results"
                      rows={4}
                      value={caseStudyFormData.results}
                      onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, results: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Describe the measurable results achieved"
                      required
                      data-testid="textarea-case-study-results"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Key Outcomes</label>
                      <button
                        type="button"
                        onClick={addKeyOutcome}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        data-testid="button-add-key-outcome"
                      >
                        <Plus className="w-4 h-4" />
                        Add Outcome
                      </button>
                    </div>
                    <div className="space-y-2">
                      {caseStudyFormData.keyOutcomes.map((outcome, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={outcome}
                            onChange={(e) => updateKeyOutcome(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Key outcome or achievement"
                            data-testid={`input-key-outcome-${index}`}
                          />
                          {caseStudyFormData.keyOutcomes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeKeyOutcome(index)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              data-testid={`button-remove-key-outcome-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="case-study-published"
                      checked={caseStudyFormData.published}
                      onChange={(e) => setCaseStudyFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-input"
                      data-testid="checkbox-case-study-published"
                    />
                    <label htmlFor="case-study-published" className="text-sm font-medium">
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={createCaseStudyMutation.isPending || updateCaseStudyMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      data-testid="button-save-case-study"
                    >
                      <Save className="w-4 h-4" />
                      {createCaseStudyMutation.isPending || updateCaseStudyMutation.isPending 
                        ? 'Saving...' 
                        : editingCaseStudy ? 'Update' : 'Create'
                      }
                    </button>
                    <button
                      type="button"
                      onClick={resetCaseStudyForm}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                      data-testid="button-cancel-case-study"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Case Studies</h3>
              
              {isLoadingCaseStudies ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : caseStudies.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground">No case studies created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {caseStudies.map((caseStudy) => (
                    <div
                      key={caseStudy.id}
                      className="bg-card border border-border rounded-lg p-6"
                      data-testid={`case-study-item-${caseStudy.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold">{caseStudy.title}</h4>
                          <p className="text-muted-foreground text-sm">{caseStudy.summary}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Slug: {caseStudy.slug}</span>
                            <span>Client: {caseStudy.clientType}</span>
                            <span>Duration: {caseStudy.duration}</span>
                            <span className={`px-2 py-1 rounded ${caseStudy.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {caseStudy.published ? 'Published' : 'Draft'}
                            </span>
                            <span>Created: {new Date(caseStudy.createdAt).toLocaleDateString()}</span>
                          </div>
                          {caseStudy.keyOutcomes.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Key Outcomes: </span>
                              {caseStudy.keyOutcomes.join(', ')}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/case-studies/${caseStudy.slug}`, '_blank')}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Preview"
                            data-testid={`button-preview-case-study-${caseStudy.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditCaseStudy(caseStudy)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Edit"
                            data-testid={`button-edit-case-study-${caseStudy.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCaseStudy(caseStudy)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete"
                            data-testid={`button-delete-case-study-${caseStudy.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}