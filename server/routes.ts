import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactSchema, insertInsightSchema, updateInsightSchema, insertCaseStudySchema, updateCaseStudySchema, insertAttachmentSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactFormNotification } from "./email-service";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp and random string
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${baseName}_${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Allow most common file types
    const allowedMimes = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];
    
    const isAllowed = allowedMimes.some(mime => file.mimetype.startsWith(mime));
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint with file upload support
  app.post("/api/contacts", upload.array('attachments', 5), async (req, res) => {
    try {
      // Parse contact data from form fields
      const contactData = insertContactSchema.parse({
        name: req.body.name,
        email: req.body.email,
        company: req.body.company || null,
        message: req.body.message
      });
      
      // Create the contact first
      const contact = await storage.createContact(contactData);
      
      // Process uploaded files and create attachments
      const files = req.files as Express.Multer.File[];
      const attachments = [];
      const createdAttachmentIds: string[] = [];
      
      try {
        if (files && files.length > 0) {
          for (const file of files) {
            const attachmentData = insertAttachmentSchema.parse({
              contactId: contact.id,
              fileName: file.filename,
              originalName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
              filePath: file.path
            });
            
            const attachment = await storage.createAttachment(attachmentData);
            attachments.push(attachment);
            createdAttachmentIds.push(attachment.id);
          }
        }
        
        // Send email notification (don't fail the request if email fails)
        try {
          const attachmentData = attachments.map(att => ({
            fileName: att.fileName,
            originalName: att.originalName,
            size: att.size
          }));
          
          await sendContactFormNotification({
            name: contactData.name,
            email: contactData.email,
            company: contactData.company || undefined,
            message: contactData.message
          }, attachmentData);
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't fail the request - contact was still saved successfully
        }
        
        res.status(201).json({ 
          success: true, 
          contact, 
          attachments 
        });
      } catch (attachmentError) {
        // Compensation: Clean up created contact and any created attachments
        try {
          // Delete any created attachments
          for (const attachmentId of createdAttachmentIds) {
            await storage.deleteAttachment(attachmentId);
          }
          // Delete the created contact
          await storage.deleteContact(contact.id);
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
        
        // Re-throw the original error to be handled by the outer catch block
        throw attachmentError;
      }
    } catch (error) {
      // Clean up uploaded files on error
      const files = req.files as Express.Multer.File[];
      if (files) {
        files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error cleaning up file:', unlinkError);
          }
        });
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        res.status(400).json({ 
          success: false, 
          error: "File upload error", 
          details: error.message 
        });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Add Multer error handling middleware specifically for the contacts route
  app.use('/api/contacts', (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      // Clean up any uploaded files on Multer error
      const files = req.files as Express.Multer.File[];
      if (files) {
        files.forEach((file: Express.Multer.File) => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error cleaning up file after Multer error:', unlinkError);
          }
        });
      }

      let errorMessage = 'File upload error';
      let statusCode = 400;

      switch (error.code) {
        case 'LIMIT_FILE_COUNT':
          errorMessage = 'Too many files. Maximum 5 files allowed.';
          statusCode = 400;
          break;
        case 'LIMIT_FILE_SIZE':
          errorMessage = 'File too large. Maximum size is 10MB per file.';
          statusCode = 413;
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          errorMessage = 'Unexpected file field. Please use the attachments field.';
          statusCode = 400;
          break;
        case 'LIMIT_FIELD_VALUE':
          errorMessage = 'Form field value too large.';
          statusCode = 400;
          break;
        default:
          errorMessage = error.message || 'File upload error';
          break;
      }

      return res.status(statusCode).json({
        success: false,
        error: errorMessage
      });
    }
    next(error);
  });

  // Get all contacts (for admin/review purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json({ success: true, contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Get all insights (published only for public, all for admin)
  app.get("/api/insights", async (req, res) => {
    try {
      const publishedOnly = req.query.published !== 'false';
      const insights = await storage.getAllInsights(publishedOnly);
      res.json({ success: true, insights });
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Get single insight by slug
  app.get("/api/insights/:slug", async (req, res) => {
    try {
      const insight = await storage.getInsightBySlug(req.params.slug);
      if (!insight) {
        res.status(404).json({ 
          success: false, 
          error: "Insight not found" 
        });
        return;
      }
      res.json({ success: true, insight });
    } catch (error) {
      console.error("Error fetching insight:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Create new insight
  app.post("/api/insights", async (req, res) => {
    try {
      const insightData = insertInsightSchema.parse(req.body);
      const insight = await storage.createInsight(insightData);
      res.status(201).json({ success: true, insight });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        console.error("Error creating insight:", error);
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Update insight
  app.put("/api/insights/:id", async (req, res) => {
    try {
      const updateData = updateInsightSchema.parse(req.body);
      const insight = await storage.updateInsight(req.params.id, updateData);
      res.json({ success: true, insight });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        console.error("Error updating insight:", error);
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Delete insight
  app.delete("/api/insights/:id", async (req, res) => {
    try {
      await storage.deleteInsight(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting insight:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Get all case studies (published only for public, all for admin)
  app.get("/api/case-studies", async (req, res) => {
    try {
      const publishedOnly = req.query.published !== 'false';
      const caseStudies = await storage.getAllCaseStudies(publishedOnly);
      res.json({ success: true, caseStudies });
    } catch (error) {
      console.error("Error fetching case studies:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Get single case study by slug
  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const caseStudy = await storage.getCaseStudyBySlug(req.params.slug);
      if (!caseStudy) {
        res.status(404).json({ 
          success: false, 
          error: "Case study not found" 
        });
        return;
      }
      res.json({ success: true, caseStudy });
    } catch (error) {
      console.error("Error fetching case study:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Create new case study
  app.post("/api/case-studies", async (req, res) => {
    try {
      const caseStudyData = insertCaseStudySchema.parse(req.body);
      const caseStudy = await storage.createCaseStudy(caseStudyData);
      res.status(201).json({ success: true, caseStudy });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        console.error("Error creating case study:", error);
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Update case study
  app.put("/api/case-studies/:id", async (req, res) => {
    try {
      const updateData = updateCaseStudySchema.parse(req.body);
      const caseStudy = await storage.updateCaseStudy(req.params.id, updateData);
      res.json({ success: true, caseStudy });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        console.error("Error updating case study:", error);
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Delete case study
  app.delete("/api/case-studies/:id", async (req, res) => {
    try {
      await storage.deleteCaseStudy(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting case study:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
