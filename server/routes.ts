import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stravaService } from "./stravaService";
import { trainingPlanService } from "./trainingPlanService";
import cors from "cors";

const tokenStore: { [key: string]: string } = {}; // { userId: access_token }
const activityStore = {}; // { userId: activities[] }

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors({ origin: true, credentials: true }));

  // Basic test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });

  // Strava OAuth routes
  app.get("/api/strava/auth", (req, res) => {
    const authUrl = stravaService.getAuthUrl();
    console.log("%%% Strava auth URL:", authUrl);
    res.json({ authUrl });
  });

  // Save Strava token
  app.post("/api/receive-token", async (req, res) => {
    const data = await req.body;

    const athlete_id = data.athlete_id;
    const access_token = data.access_token;
    console.log("%%% Strava access_token:", access_token);
    console.log("%%% Strava athlete_id:", athlete_id);

    if (!access_token) {
      return res.status(400).json({ error: "No token received" });
    }

    tokenStore[athlete_id] = access_token;
    res.json({ message: "saved" });
  });

  // Get Strava token
  app.get("/api/token-exists/:athlete_id", (req, res) => {
    const { athlete_id } = req.params;

    const token = tokenStore[athlete_id];
    if (!token) {
      return res.status(404).json({ exists: false });
    }

    return res.json({ exists: true });
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
  app.post("/api/training-plan", (req, res) => {
    try {
      const { comparison } = req.body;
      const plans = trainingPlanService.generateTrainingPlan(comparison);
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
      console.log("Fetching activities for user:", userId);
      //const weeks = parseInt(req.query.weeks as string) || 4;
      console.log(tokenStore);
      const accessToken = tokenStore[userId];
      if (!accessToken) {
        throw new Error("Strava access token not found for this athlete");
      }
      const activities = await stravaService.getUserActivitiesOnce(accessToken);
      //console.log("Fetched activities:", activities);
      res.json(activities);
    } catch (error: any) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/strava/logout", async (req, res) => {
    const data = await req.body;
    const userId = data.userId;

    console.log(tokenStore);
    if (tokenStore[userId]) {
      delete tokenStore[userId];
      console.log(`>>> Strava token for ${userId} deleted`);
    }

    res.json({ message: "Logged out" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
