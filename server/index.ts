// This is a frontend-only triathlon pace calculator
// The server is only needed for the Replit environment setup
// All calculation logic happens in the frontend

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import routes from "./routes";

const app = new Hono();

// API routes (minimal, as this is frontend-only)
app.route("/api", routes);

// Health check endpoint
app.get("/api/health", (c) => {
  return c.json({ status: "ok", message: "Triathlon Pace Calculator Server" });
});

// In production, serve static files
if (process.env.NODE_ENV === "production") {
  app.use("*", serveStatic({ root: "./client/dist" }));
  app.get("*", serveStatic({ path: "./client/dist/index.html" }));
}

const PORT = process.env.PORT || 5000;

console.log(`🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Pace Calculator Server running on port ${PORT}`);
serve({
  fetch: app.fetch,
  port: PORT,
  hostname: "0.0.0.0",
});