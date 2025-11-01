import { type Contact, type InsertContact, type Insight, type InsertInsight, type UpdateInsight, type CaseStudy, type InsertCaseStudy, type UpdateCaseStudy, type User, type InsertUser, type VerificationCode, type InsertVerificationCode, type Attachment, type InsertAttachment, contacts, insights, caseStudies, users, verificationCodes, attachments } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lt } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Contact operations
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: string): Promise<void>;
  getAllContacts(): Promise<Contact[]>;
  
  // Insights operations
  getInsight(id: string): Promise<Insight | undefined>;
  getInsightBySlug(slug: string): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  updateInsight(id: string, updates: UpdateInsight): Promise<Insight>;
  deleteInsight(id: string): Promise<void>;
  getAllInsights(publishedOnly?: boolean): Promise<Insight[]>;
  
  // Case Studies operations
  getCaseStudy(id: string): Promise<CaseStudy | undefined>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: string, updates: UpdateCaseStudy): Promise<CaseStudy>;
  deleteCaseStudy(id: string): Promise<void>;
  getAllCaseStudies(publishedOnly?: boolean): Promise<CaseStudy[]>;
  
  // User authentication operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Verification code operations
  createVerificationCode(code: InsertVerificationCode): Promise<VerificationCode>;
  getVerificationCode(userId: string, code: string, type: string): Promise<VerificationCode | undefined>;
  markVerificationCodeAsUsed(id: string): Promise<void>;
  cleanupExpiredCodes(): Promise<void>;
  
  // Attachment operations
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  getAttachmentsByContactId(contactId: string): Promise<Attachment[]>;
  deleteAttachment(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Contact operations
  async getContact(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0] || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(insertContact).returning();
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  // Insights operations
  async getInsight(id: string): Promise<Insight | undefined> {
    const result = await db.select().from(insights).where(eq(insights.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getInsightBySlug(slug: string): Promise<Insight | undefined> {
    const result = await db.select().from(insights).where(eq(insights.slug, slug)).limit(1);
    return result[0] || undefined;
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const result = await db.insert(insights).values(insertInsight).returning();
    return result[0];
  }

  async updateInsight(id: string, updates: UpdateInsight): Promise<Insight> {
    const result = await db.update(insights)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(insights.id, id))
      .returning();
    return result[0];
  }

  async deleteInsight(id: string): Promise<void> {
    await db.delete(insights).where(eq(insights.id, id));
  }

  async getAllInsights(publishedOnly: boolean = false): Promise<Insight[]> {
    if (publishedOnly) {
      return await db.select()
        .from(insights)
        .where(eq(insights.published, true))
        .orderBy(desc(insights.createdAt));
    } else {
      return await db.select()
        .from(insights)
        .orderBy(desc(insights.createdAt));
    }
  }

  // Case Studies operations
  async getCaseStudy(id: string): Promise<CaseStudy | undefined> {
    const result = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    const result = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
    return result[0] || undefined;
  }

  async createCaseStudy(insertCaseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const result = await db.insert(caseStudies).values(insertCaseStudy).returning();
    return result[0];
  }

  async updateCaseStudy(id: string, updates: UpdateCaseStudy): Promise<CaseStudy> {
    const result = await db.update(caseStudies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(caseStudies.id, id))
      .returning();
    return result[0];
  }

  async deleteCaseStudy(id: string): Promise<void> {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  }

  async getAllCaseStudies(publishedOnly: boolean = false): Promise<CaseStudy[]> {
    if (publishedOnly) {
      return await db.select()
        .from(caseStudies)
        .where(eq(caseStudies.published, true))
        .orderBy(desc(caseStudies.createdAt));
    } else {
      return await db.select()
        .from(caseStudies)
        .orderBy(desc(caseStudies.createdAt));
    }
  }

  // User authentication operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const result = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Verification code operations
  async createVerificationCode(insertCode: InsertVerificationCode): Promise<VerificationCode> {
    const result = await db.insert(verificationCodes).values(insertCode).returning();
    return result[0];
  }

  async getVerificationCode(userId: string, code: string, type: string): Promise<VerificationCode | undefined> {
    const result = await db.select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, userId),
          eq(verificationCodes.code, code),
          eq(verificationCodes.type, type),
          eq(verificationCodes.used, false)
        )
      )
      .limit(1);
    return result[0] || undefined;
  }

  async markVerificationCodeAsUsed(id: string): Promise<void> {
    await db.update(verificationCodes)
      .set({ used: true })
      .where(eq(verificationCodes.id, id));
  }

  async cleanupExpiredCodes(): Promise<void> {
    await db.delete(verificationCodes)
      .where(lt(verificationCodes.expiresAt, new Date()));
  }

  // Attachment operations
  async createAttachment(insertAttachment: InsertAttachment): Promise<Attachment> {
    const result = await db.insert(attachments).values(insertAttachment).returning();
    return result[0];
  }

  async getAttachmentsByContactId(contactId: string): Promise<Attachment[]> {
    return await db.select()
      .from(attachments)
      .where(eq(attachments.contactId, contactId))
      .orderBy(attachments.createdAt);
  }

  async deleteAttachment(id: string): Promise<void> {
    await db.delete(attachments).where(eq(attachments.id, id));
  }

  async deleteContact(id: string): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }
}

export const storage = new DatabaseStorage();
