import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { loginSchema, dealSchema, sentimentSchema } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    isAuthenticated?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "kpi-dashboard-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Check credentials
      if (username === "admin" && password === "massana") {
        req.session.isAuthenticated = true;
        req.session.userId = 1; // Static admin user ID
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "Logout failed" });
      } else {
        res.json({ success: true, message: "Logout successful" });
      }
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.isAuthenticated) {
      res.json({ success: true, authenticated: true });
    } else {
      res.status(401).json({ success: false, authenticated: false });
    }
  });

  // KPI data routes
  app.get("/api/kpi", async (req, res) => {
    try {
      if (!req.session.isAuthenticated) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      
      const kpiData = await storage.getKpiData();
      res.json({ success: true, data: kpiData });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch KPI data" });
    }
  });

  // Public API endpoints for external calls
  app.post("/new-call", async (req, res) => {
    try {
      const kpiData = await storage.incrementTotalCalls();
      res.json({ success: true, totalCalls: kpiData.totalCalls });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to increment total calls" });
    }
  });

  app.post("/deals", async (req, res) => {
    try {
      const { deal } = dealSchema.parse(req.body);
      
      const kpiData = deal === "Deal" 
        ? await storage.incrementDealCalls()
        : await storage.incrementNoDealCalls();
      
      res.json({ 
        success: true, 
        dealCalls: kpiData.dealCalls,
        noDealCalls: kpiData.noDealCalls 
      });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid request data" });
    }
  });

  app.post("/sentiment", async (req, res) => {
    try {
      const { sentiment } = sentimentSchema.parse(req.body);
      
      const kpiData = sentiment === "Positive"
        ? await storage.incrementPositiveSentimentCalls()
        : await storage.incrementNegativeSentimentCalls();
      
      res.json({ 
        success: true, 
        positiveSentimentCalls: kpiData.positiveSentimentCalls,
        negativeSentimentCalls: kpiData.negativeSentimentCalls 
      });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
