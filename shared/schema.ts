import { z } from "zod";

// Since this is a frontend-only calculator, we don't need database schemas
// But we'll define the calculation input/output types for consistency

export const CourseType = z.enum(["olympic", "ironman"]);
export type CourseType = z.infer<typeof CourseType>;

export const GoalTimeInputSchema = z.object({
  courseType: CourseType,
  hours: z.number().min(0).max(23),
  minutes: z.number().min(0).max(59),
  seconds: z.number().min(0).max(59),
});

export type GoalTimeInput = z.infer<typeof GoalTimeInputSchema>;

export const CurrentPaceSchema = z.object({
  swimPace: z.number().min(0), // seconds per 100m
  bikePace: z.number().min(0), // km/h
  runPace: z.number().min(0), // seconds per km
});

export type CurrentPace = z.infer<typeof CurrentPaceSchema>;

export const PaceResultSchema = z.object({
  swimPace: z.number(), // seconds per 100m
  bikePace: z.number(), // km/h
  runPace: z.number(), // seconds per km
  totalSeconds: z.number(),
  isWorldRecord: z.boolean(),
});

export type PaceResult = z.infer<typeof PaceResultSchema>;

export const ComparisonResultSchema = z.object({
  timeDifference: z.number(), // seconds difference
  swimImprovement: z.number(), // seconds per 100m to improve
  bikeImprovement: z.number(), // km/h to improve
  runImprovement: z.number(), // seconds per km to improve
  canAchieveGoal: z.boolean(),
});

export type ComparisonResult = z.infer<typeof ComparisonResultSchema>;