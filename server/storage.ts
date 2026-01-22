import { db } from "./db";
import {
  ipos,
  watchlist,
  type Ipo,
  type InsertIpo,
  type WatchlistItem,
  type InsertWatchlistItem,
  type WatchlistResponse,
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { authStorage, IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // IPOs
  getIpos(status?: string, sector?: string): Promise<Ipo[]>;
  getIpo(id: number): Promise<Ipo | undefined>;
  getIpoBySymbol(symbol: string): Promise<Ipo | undefined>;
  createIpo(ipo: InsertIpo): Promise<Ipo>;
  upsertIpo(ipo: InsertIpo): Promise<Ipo>;
  updateIpo(id: number, data: Partial<InsertIpo>): Promise<Ipo | undefined>;
  getIpoCount(): Promise<number>;

  // Watchlist
  getWatchlist(userId: string): Promise<WatchlistResponse[]>;
  addToWatchlist(userId: string, ipoId: number): Promise<WatchlistItem>;
  removeFromWatchlist(userId: string, id: number): Promise<void>;
  getWatchlistItem(userId: string, ipoId: number): Promise<WatchlistItem | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Inherit auth methods
  getUser = authStorage.getUser;
  upsertUser = authStorage.upsertUser;

  // IPOs
  async getIpos(status?: string, sector?: string): Promise<Ipo[]> {
    let query = db.select().from(ipos);
    const conditions = [];
    if (status) conditions.push(eq(ipos.status, status));
    if (sector) conditions.push(eq(ipos.sector, sector));

    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(ipos.expectedDate));
    }
    return await query.orderBy(desc(ipos.expectedDate));
  }

  async getIpo(id: number): Promise<Ipo | undefined> {
    const [ipo] = await db.select().from(ipos).where(eq(ipos.id, id));
    return ipo;
  }

  async getIpoBySymbol(symbol: string): Promise<Ipo | undefined> {
    const [ipo] = await db.select().from(ipos).where(eq(ipos.symbol, symbol));
    return ipo;
  }

  async createIpo(insertIpo: InsertIpo): Promise<Ipo> {
    const [ipo] = await db.insert(ipos).values(insertIpo).returning();
    return ipo;
  }

  async upsertIpo(insertIpo: InsertIpo): Promise<Ipo> {
    const existing = await this.getIpoBySymbol(insertIpo.symbol);
    
    if (existing) {
      const [updated] = await db
        .update(ipos)
        .set({
          ...insertIpo,
          updatedAt: new Date(),
        })
        .where(eq(ipos.id, existing.id))
        .returning();
      return updated;
    }
    
    return this.createIpo(insertIpo);
  }

  async updateIpo(id: number, data: Partial<InsertIpo>): Promise<Ipo | undefined> {
    const [updated] = await db
      .update(ipos)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(ipos.id, id))
      .returning();
    return updated;
  }

  async getIpoCount(): Promise<number> {
    const result = await db.select().from(ipos);
    return result.length;
  }

  // Watchlist
  async getWatchlist(userId: string): Promise<WatchlistResponse[]> {
    const items = await db
      .select({
        watchlist: watchlist,
        ipo: ipos,
      })
      .from(watchlist)
      .innerJoin(ipos, eq(watchlist.ipoId, ipos.id))
      .where(eq(watchlist.userId, userId));

    return items.map((item) => ({
      ...item.watchlist,
      ipo: item.ipo,
    }));
  }

  async getWatchlistItem(userId: string, ipoId: number): Promise<WatchlistItem | undefined> {
    const [item] = await db
        .select()
        .from(watchlist)
        .where(and(eq(watchlist.userId, userId), eq(watchlist.ipoId, ipoId)));
    return item;
  }

  async addToWatchlist(userId: string, ipoId: number): Promise<WatchlistItem> {
    // check if exists
    const existing = await this.getWatchlistItem(userId, ipoId);
    if (existing) return existing;

    const [item] = await db
      .insert(watchlist)
      .values({ userId, ipoId })
      .returning();
    return item;
  }

  async removeFromWatchlist(userId: string, id: number): Promise<void> {
    await db
      .delete(watchlist)
      .where(and(eq(watchlist.id, id), eq(watchlist.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
