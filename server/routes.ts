import type { Express } from "express";
import type { Server } from "http"; // Correct import
import { createServer } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertIpoSchema } from "@shared/schema";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server, // Accept httpServer as parameter
  app: Express
): Promise<Server> { // Return Promise<Server>
  
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // IPO Routes
  app.get(api.ipos.list.path, async (req, res) => {
    const status = req.query.status as string | undefined;
    const sector = req.query.sector as string | undefined;
    const ipos = await storage.getIpos(status, sector);
    res.json(ipos);
  });

  app.get(api.ipos.get.path, async (req, res) => {
    const ipo = await storage.getIpo(Number(req.params.id));
    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }
    res.json(ipo);
  });

  // Watchlist Routes
  app.get(api.watchlist.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).claims.sub;
    const watchlist = await storage.getWatchlist(userId);
    res.json(watchlist);
  });

  app.post(api.watchlist.add.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { ipoId } = api.watchlist.add.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      const ipo = await storage.getIpo(ipoId);
      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }

      const item = await storage.addToWatchlist(userId, ipoId);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          message: err.errors[0].message,
          field: err.errors[0].path.join('.')
        });
      }
      throw err;
    }
  });

  app.delete(api.watchlist.remove.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).claims.sub;
    await storage.removeFromWatchlist(userId, Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingIpos = await storage.getIpos();
  if (existingIpos.length === 0) {
    console.log("Seeding database with initial IPOs...");
    const seedIpos = [
      {
        symbol: "TECH",
        companyName: "TechVision AI",
        priceRange: "$25 - $28",
        totalShares: "15M",
        expectedDate: new Date("2024-11-15").toISOString(), // Pass date string, Drizzle handles it
        status: "upcoming",
        description: "Leading AI solutions provider for enterprise workflow automation.",
        sector: "Technology",
      },
      {
        symbol: "GREEN",
        companyName: "GreenEnergy Corp",
        priceRange: "$18 - $21",
        totalShares: "10M",
        expectedDate: new Date("2024-11-20").toISOString(),
        status: "upcoming",
        description: "Renewable energy infrastructure and solar panel manufacturing.",
        sector: "Energy",
      },
      {
        symbol: "HLTH",
        companyName: "MediCare Plus",
        priceRange: "$30 - $35",
        totalShares: "8M",
        expectedDate: new Date("2024-10-25").toISOString(),
        status: "open",
        description: "Next-generation healthcare platform connecting patients with specialists.",
        sector: "Healthcare",
      },
      {
        symbol: "FIN",
        companyName: "Future Finance",
        priceRange: "$40 - $45",
        totalShares: "12M",
        expectedDate: new Date("2024-09-10").toISOString(),
        status: "closed",
        description: "Blockchain-based decentralized finance (DeFi) trading platform.",
        sector: "Finance",
      },
       {
        symbol: "AUTO",
        companyName: "Electric Motors Inc",
        priceRange: "$22 - $26",
        totalShares: "20M",
        expectedDate: new Date("2024-12-05").toISOString(),
        status: "upcoming",
        description: "Manufacturer of affordable electric vehicles for the mass market.",
        sector: "Consumer Discretionary",
      }
    ];

    for (const ipo of seedIpos) {
      // Drizzle date handling: pass Date object or ISO string. 
      // InsertIpo expects strings for text fields and Date/string for date fields.
      // Let's create a partial object matching InsertIpo structure.
      // Note: expectedDate in schema is 'date', which maps to string in output but Date/string in input.
      await storage.createIpo(ipo); 
    }
    console.log("Seeding complete.");
  }
}
