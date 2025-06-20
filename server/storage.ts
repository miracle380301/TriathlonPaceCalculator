import {
  users,
  trainingPlans,
  stravaActivities,
  type User,
  type UpsertUser,
  type TrainingPlan,
  type StravaActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Strava integration
  updateUserStravaTokens(userId: string, accessToken: string, refreshToken: string, expiryDate: Date): Promise<void>;
  getUserByStravaId(stravaId: string): Promise<User | undefined>;
  
  // Training plans
  createTrainingPlan(plan: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TrainingPlan>;
  getUserTrainingPlans(userId: string): Promise<TrainingPlan[]>;
  
  // Strava activities
  saveStravaActivities(activities: Omit<StravaActivity, 'id' | 'createdAt'>[]): Promise<void>;
  getUserRecentActivities(userId: string, weeks: number): Promise<StravaActivity[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations for auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Strava integration
  async updateUserStravaTokens(userId: string, accessToken: string, refreshToken: string, expiryDate: Date): Promise<void> {
    await db.update(users)
      .set({
        stravaAccessToken: accessToken,
        stravaRefreshToken: refreshToken,
        stravaTokenExpiry: expiryDate,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async getUserByStravaId(stravaId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stravaId, stravaId));
    return user;
  }
  
  // Training plans
  async createTrainingPlan(plan: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TrainingPlan> {
    const [trainingPlan] = await db
      .insert(trainingPlans)
      .values(plan)
      .returning();
    return trainingPlan;
  }

  async getUserTrainingPlans(userId: string): Promise<TrainingPlan[]> {
    return await db.select()
      .from(trainingPlans)
      .where(eq(trainingPlans.userId, userId))
      .orderBy(desc(trainingPlans.createdAt));
  }
  
  // Strava activities
  async saveStravaActivities(activities: Omit<StravaActivity, 'id' | 'createdAt'>[]): Promise<void> {
    if (activities.length > 0) {
      await db.insert(stravaActivities).values(activities).onConflictDoNothing();
    }
  }

  async getUserRecentActivities(userId: string, weeks: number = 4): Promise<StravaActivity[]> {
    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - (weeks * 7));
    
    return await db.select()
      .from(stravaActivities)
      .where(eq(stravaActivities.userId, userId))
      .where(gte(stravaActivities.startDate, weeksAgo))
      .orderBy(desc(stravaActivities.startDate));
  }
}

export const storage = new DatabaseStorage();
