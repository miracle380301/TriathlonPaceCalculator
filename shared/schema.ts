import {
  pgTable,
  varchar,
  integer,
  timestamp,
  text,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with Strava integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username", { length: 100 }),
  name: varchar("name", { length: 100 }),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stravaId: varchar("strava_id").unique(),
  stravaAccessToken: varchar("strava_access_token"),
  stravaRefreshToken: varchar("strava_refresh_token"),
  stravaTokenExpiry: timestamp("strava_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training plans table
export const trainingPlans = pgTable("training_plans", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  course: varchar("course", { length: 20 }).notNull(), // 'olympic' or 'ironman'
  goalTime: integer("goal_time").notNull(), // in seconds
  currentPaces: jsonb("current_paces"), // current performance data
  targetPaces: jsonb("target_paces"), // calculated target paces
  weeklyPlan: jsonb("weekly_plan"), // training recommendations
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Strava activities table
export const stravaActivities = pgTable("strava_activities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stravaActivityId: varchar("strava_activity_id").unique().notNull(),
  name: varchar("name"),
  type: varchar("type"), // 'Swim', 'Ride', 'Run'
  distance: integer("distance"), // in meters
  movingTime: integer("moving_time"), // in seconds
  elapsedTime: integer("elapsed_time"), // in seconds
  startDate: timestamp("start_date"),
  averageSpeed: integer("average_speed"), // in m/s * 1000
  activityData: jsonb("activity_data"), // full activity details
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  name: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type TrainingPlan = typeof trainingPlans.$inferSelect;
export type StravaActivity = typeof stravaActivities.$inferSelect;
