import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===
export const ipos = pgTable("ipos", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  companyName: text("company_name").notNull(),
  priceRange: text("price_range").notNull(),
  totalShares: text("total_shares"),
  expectedDate: date("expected_date"),
  status: text("status").notNull(), // 'upcoming', 'open', 'closed'
  description: text("description"),
  sector: text("sector"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // Using text because auth user id is varchar
  ipoId: integer("ipo_id").notNull().references(() => ipos.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const iposRelations = relations(ipos, ({ many }) => ({
  watchlistItems: many(watchlist),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
  ipo: one(ipos, {
    fields: [watchlist.ipoId],
    references: [ipos.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertIpoSchema = createInsertSchema(ipos).omit({ id: true, createdAt: true });
export const insertWatchlistSchema = createInsertSchema(watchlist).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Ipo = typeof ipos.$inferSelect;
export type InsertIpo = z.infer<typeof insertIpoSchema>;
export type WatchlistItem = typeof watchlist.$inferSelect;
export type InsertWatchlistItem = z.infer<typeof insertWatchlistSchema>;

// API Responses
export type IpoResponse = Ipo;
export type WatchlistResponse = WatchlistItem & { ipo: Ipo }; // Watchlist item with IPO details
