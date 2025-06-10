import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const kpiData = pgTable("kpi_data", {
  id: serial("id").primaryKey(),
  totalCalls: integer("total_calls").notNull().default(0),
  dealCalls: integer("deal_calls").notNull().default(0),
  noDealCalls: integer("no_deal_calls").notNull().default(0),
  positiveSentimentCalls: integer("positive_sentiment_calls").notNull().default(0),
  negativeSentimentCalls: integer("negative_sentiment_calls").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertKpiDataSchema = createInsertSchema(kpiData).omit({
  id: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const dealSchema = z.object({
  deal: z.enum(["Deal", "No Deal"]),
});

export const sentimentSchema = z.object({
  sentiment: z.enum(["Positive", "Negative"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type KpiData = typeof kpiData.$inferSelect;
export type InsertKpiData = z.infer<typeof insertKpiDataSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type DealRequest = z.infer<typeof dealSchema>;
export type SentimentRequest = z.infer<typeof sentimentSchema>;
