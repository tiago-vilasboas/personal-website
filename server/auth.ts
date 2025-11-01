// Authentication system with password hashing and session management
// Reference: blueprint:javascript_auth_all_persistance integration
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType, registerSchema, loginSchema, verifyCodeSchema } from "@shared/schema";
import { send2FAVerificationEmail, generateVerificationCode } from "./email-service";

declare global {
  namespace Express {
    interface User extends UserType {}
    
    interface Session {
      pendingUserId?: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register new user
  app.post("/api/register", async (req, res, next) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create user with hashed password
      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password),
        isAdmin: true, // First user is admin for consulting website
        emailVerified: false,
      });

      // Send email verification (but don't require it for first login)
      const emailCode = generateVerificationCode();
      await storage.createVerificationCode({
        userId: user.id,
        code: emailCode,
        type: "email_verification",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      await send2FAVerificationEmail(user.email, user.username, emailCode);

      // Log user in automatically after registration
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified 
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  // Login with 2FA
  app.post("/api/login", async (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("local", async (err: any, user: UserType | false, info: any) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ error: info?.message || "Invalid credentials" });
        }

        // Generate 2FA code
        const code = generateVerificationCode();
        await storage.createVerificationCode({
          userId: user.id,
          code,
          type: "login_2fa",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send 2FA email
        const emailSent = await send2FAVerificationEmail(user.email, user.username, code);
        
        if (!emailSent) {
          return res.status(500).json({ error: "Failed to send verification email" });
        }

        // Store user ID in session for 2FA verification
        req.session.pendingUserId = user.id;
        
        res.json({ 
          message: "2FA code sent to your email", 
          requiresVerification: true,
          email: user.email.replace(/(.{1,3}).*(@.*)/, "$1***$2") // Mask email for security
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Login failed" });
      }
    }
  });

  // Verify 2FA code and complete login
  app.post("/api/verify-2fa", async (req, res, next) => {
    try {
      const validatedData = verifyCodeSchema.parse(req.body);
      const pendingUserId = req.session.pendingUserId;

      if (!pendingUserId) {
        return res.status(400).json({ error: "No pending login session" });
      }

      // Clean up expired codes
      await storage.cleanupExpiredCodes();

      // Verify the code
      const verificationCode = await storage.getVerificationCode(
        pendingUserId,
        validatedData.code,
        "login_2fa"
      );

      if (!verificationCode || verificationCode.expiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }

      // Mark code as used
      await storage.markVerificationCodeAsUsed(verificationCode.id);

      // Get user and complete login
      const user = await storage.getUser(pendingUserId);
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Complete login
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Clear pending session
        delete req.session.pendingUserId;
        
        res.json({ 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified 
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Verification failed" });
      }
    }
  });

  // Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      delete req.session.pendingUserId;
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = req.user;
    res.json({ 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified 
    });
  });
}

// Middleware to require authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Middleware to require admin access
export function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}