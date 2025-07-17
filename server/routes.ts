import { Hono } from "hono";
import { storage } from "./storage";

const app = new Hono();

// Since this is a frontend-only calculator, we don't need API routes
// But keeping the file for consistency with the template structure

export default app;