import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stravaService } from "./stravaService";
import { trainingPlanService } from "./trainingPlanService";
import cors from "cors";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors({ origin: true, credentials: true }));

  // Basic test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });

  // Strava OAuth routes
  app.get("/api/strava/auth", (req, res) => {
    const authUrl = stravaService.getAuthUrl();
    console.log("@@@ Strava auth URL:", authUrl);
    res.json({ authUrl });
  });

  app.post("/api/strava/callback", async (req, res) => {
    console.log("!!!Strava callback received:", req.body);
    try {
      const { code, userId } = req.body;

      if (!code || !userId) {
        return res.status(400).json({ error: "Code and userId are required" });
      }

      const tokenData = await stravaService.exchangeCodeForTokens(code);

      console.log("Strava token data:", tokenData);

      // Store user tokens and info in memory
      storage.setUserStravaTokens(
        userId,
        tokenData.access_token,
        tokenData.refresh_token,
        new Date(tokenData.expires_at * 1000)
      );

      storage.updateUser(userId, {
        firstName: tokenData.athlete.firstname,
        lastName: tokenData.athlete.lastname,
        profileImageUrl: tokenData.athlete.profile,
      });

      res.json({ success: true, athlete: tokenData.athlete });
    } catch (error: any) {
      console.error("Strava callback error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Sync Strava activities
  app.post("/api/strava/sync", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      await stravaService.syncUserActivities(userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Strava sync error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's training analysis
  app.get("/api/training/analysis/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await trainingPlanService.analyzeUserPerformance(userId);
      res.json(stats);
    } catch (error: any) {
      console.error("Training analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create personalized training plan
  app.post("/api/training/plan", async (req, res) => {
    try {
      const {
        userId,
        course,
        goalHours,
        goalMinutes,
        goalSeconds,
        t1Minutes,
        t2Minutes,
      } = req.body;

      if (!userId || !course) {
        return res
          .status(400)
          .json({ error: "userId and course are required" });
      }

      const result = await trainingPlanService.createPersonalizedPlan(
        userId,
        course,
        goalHours || 0,
        goalMinutes || 0,
        goalSeconds || 0,
        t1Minutes || 0,
        t2Minutes || 0,
      );

      res.json(result);
    } catch (error: any) {
      console.error("Training plan creation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's training plans
  app.get("/api/training/plans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const plans = await storage.getUserTrainingPlans(userId);
      res.json(plans);
    } catch (error: any) {
      console.error("Get training plans error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's recent activities
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const weeks = parseInt(req.query.weeks as string) || 4;
      const activities = await storage.getUserRecentActivities(userId, weeks);
      res.json(activities);
    } catch (error: any) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
