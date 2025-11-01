import { useState } from 'react';
import { Send, MessageCircle, Clock, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactMutation = useMutation({
    mutationFn: async (contactData: typeof formData) => {
      // Create FormData for multipart form submission
      const formDataToSend = new FormData();
      formDataToSend.append('name', contactData.name);
      formDataToSend.append('email', contactData.email);
      formDataToSend.append('company', contactData.company);
      formDataToSend.append('message', contactData.message);
      
      // Add files if any are selected
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formDataToSend.append('attachments', selectedFiles[i]);
        }
      }
      
      // Use fetch directly for multipart form data
      const response = await fetch('/api/contacts', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - let browser set it with boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your inquiry. I'll get back to you within 24 hours.",
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
      setSelectedFiles(null);
      // Reset file input
      const fileInput = document.getElementById('attachments') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message || "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const contactFeatures = [
    {
      icon: MessageCircle,
      title: "Quick Response",
      description: "I respond to inquiries within 24 hours, usually much faster."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling", 
      description: "Available across European and US time zones for initial conversations."
    },
    {
      icon: CheckCircle,
      title: "No Obligation",
      description: "Initial consultations are exploratory. No pressure, just clarity."
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight" data-testid="contact-title">
            Contact
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="contact-subtitle">
            Short and simple. Tell me what you want to achieve and when.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <h3 className="text-xl font-semibold">Start a Conversation</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Your name"
                    required
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="your@email.com"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your company"
                  data-testid="input-company"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell me what you want to achieve and when..."
                  required
                  data-testid="textarea-message"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="attachments" className="text-sm font-medium">Attachments</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="attachments" 
                    name="attachments"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:text-sm hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="input-attachments"
                  />
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Got files? Upload them here, any type.
                  </p>
                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {selectedFiles.length} file(s) selected: {Array.from(selectedFiles).map(f => f.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4 mr-2" />
                {contactMutation.isPending ? 'Sending...' : 'Send it!'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Let's Talk</h3>
              <p className="text-muted-foreground leading-relaxed">
                Book a 30-minute exploratory call to discuss your challenges and see if there's a fit. No pitch, just a conversation about your situation and potential approaches.
              </p>
            </div>

            <div className="space-y-6">
              {contactFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4" data-testid={`contact-feature-${index}`}>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
