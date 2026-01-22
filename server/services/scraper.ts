import axios from "axios";
import * as cheerio from "cheerio";
import type { InsertIpo } from "@shared/schema";
import { calculateIpoScore } from "./scoring";

const CHITTORGARH_BASE = "https://www.chittorgarh.com";
const IPO_DASHBOARD = `${CHITTORGARH_BASE}/report/ipo-in-india-702/`;

interface RawIpoData {
  symbol: string;
  companyName: string;
  openDate: string;
  closeDate: string;
  priceRange: string;
  lotSize: number;
  issueSize: string;
  status: "upcoming" | "open" | "closed";
  detailUrl: string;
}

interface GmpData {
  symbol: string;
  gmp: number;
  expectedListing: number;
}

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

async function fetchPage(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { 
      headers,
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.toLowerCase() === "tba" || dateStr === "-") return null;
  
  try {
    const cleaned = dateStr.trim().replace(/\s+/g, " ");
    const months: { [key: string]: string } = {
      jan: "01", january: "01",
      feb: "02", february: "02",
      mar: "03", march: "03",
      apr: "04", april: "04",
      may: "05",
      jun: "06", june: "06",
      jul: "07", july: "07",
      aug: "08", august: "08",
      sep: "09", sept: "09", september: "09",
      oct: "10", october: "10",
      nov: "11", november: "11",
      dec: "12", december: "12",
    };
    
    const match = cleaned.match(/(\d{1,2})\s*([a-zA-Z]+)\s*,?\s*(\d{4})/);
    if (match) {
      const day = match[1].padStart(2, "0");
      const monthKey = match[2].toLowerCase();
      const month = months[monthKey];
      const year = match[3];
      
      if (month) {
        return `${year}-${month}-${day}`;
      }
    }
    
    const simpleMatch = cleaned.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (simpleMatch) {
      return cleaned;
    }
  } catch (e) {
    console.error("Date parse error:", dateStr, e);
  }
  
  return null;
}

function determineStatus(openDate: string | null, closeDate: string | null): "upcoming" | "open" | "closed" {
  if (!openDate) return "upcoming";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const open = new Date(openDate);
  const close = closeDate ? new Date(closeDate) : null;
  
  if (today < open) return "upcoming";
  if (close && today > close) return "closed";
  if (today >= open && (!close || today <= close)) return "open";
  
  return "upcoming";
}

export async function scrapeMainboardIPOs(): Promise<RawIpoData[]> {
  console.log("📊 Scraping Chittorgarh IPO dashboard...");
  
  const html = await fetchPage(IPO_DASHBOARD);
  const $ = cheerio.load(html);
  
  const ipos: RawIpoData[] = [];
  
  $("table").each((_, table) => {
    const headerText = $(table).find("th").first().text().toLowerCase();
    if (!headerText.includes("ipo") && !headerText.includes("company")) return;
    
    $(table).find("tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 4) return;
      
      const companyCell = cells.eq(0);
      const companyName = companyCell.text().trim();
      const detailLink = companyCell.find("a").attr("href");
      
      if (!companyName || companyName.length < 3) return;
      
      const symbol = companyName
        .replace(/\s+(Ltd|Limited|IPO|India|Private|Pvt)\.?/gi, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 10);
      
      const openDateStr = cells.eq(1).text().trim();
      const closeDateStr = cells.eq(2).text().trim();
      const issueSize = cells.eq(3).text().trim();
      const priceRange = cells.eq(4)?.text()?.trim() || "";
      const lotSizeText = cells.eq(5)?.text()?.trim() || "";
      
      const openDate = parseDate(openDateStr);
      const closeDate = parseDate(closeDateStr);
      const status = determineStatus(openDate, closeDate);
      
      const lotSize = parseInt(lotSizeText.replace(/[^0-9]/g, "")) || 0;
      
      if (symbol && companyName) {
        ipos.push({
          symbol,
          companyName: companyName.replace(/\s+IPO$/i, "").trim(),
          openDate: openDateStr,
          closeDate: closeDateStr,
          priceRange: priceRange || "TBA",
          lotSize,
          issueSize: issueSize || "TBA",
          status,
          detailUrl: detailLink ? (detailLink.startsWith("http") ? detailLink : `${CHITTORGARH_BASE}${detailLink}`) : "",
        });
      }
    });
  });
  
  console.log(`✅ Found ${ipos.length} IPOs from Chittorgarh`);
  return ipos;
}

export async function scrapeGmpData(): Promise<GmpData[]> {
  console.log("💹 Scraping GMP data...");
  
  const gmpUrl = `${CHITTORGARH_BASE}/report/grey-market-premium-702/`;
  
  try {
    const html = await fetchPage(gmpUrl);
    const $ = cheerio.load(html);
    
    const gmpData: GmpData[] = [];
    
    $("table tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 3) return;
      
      const companyName = cells.eq(0).text().trim();
      const gmpText = cells.eq(1).text().trim();
      const expectedText = cells.eq(2).text().trim();
      
      const symbol = companyName
        .replace(/\s+(Ltd|Limited|IPO|India|Private|Pvt)\.?/gi, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 10);
      
      const gmp = parseInt(gmpText.replace(/[^-0-9]/g, "")) || 0;
      const expectedListing = parseInt(expectedText.replace(/[^0-9]/g, "")) || 0;
      
      if (symbol) {
        gmpData.push({ symbol, gmp, expectedListing });
      }
    });
    
    console.log(`✅ Found GMP data for ${gmpData.length} IPOs`);
    return gmpData;
  } catch (error) {
    console.error("GMP scrape failed:", error);
    return [];
  }
}

function extractPriceFromRange(priceRange: string): number | null {
  const match = priceRange.match(/₹?\s*(\d+(?:,\d+)?(?:\.\d+)?)/g);
  if (match && match.length > 0) {
    const lastPrice = match[match.length - 1];
    return parseFloat(lastPrice.replace(/[₹,\s]/g, ""));
  }
  return null;
}

export async function scrapeAndTransformIPOs(): Promise<InsertIpo[]> {
  try {
    const [rawIpos, gmpData] = await Promise.all([
      scrapeMainboardIPOs(),
      scrapeGmpData(),
    ]);
    
    const gmpMap = new Map(gmpData.map(g => [g.symbol, g]));
    
    const transformedIpos: InsertIpo[] = rawIpos.map(raw => {
      const gmp = gmpMap.get(raw.symbol);
      const upperPrice = extractPriceFromRange(raw.priceRange);
      const minInvestment = upperPrice && raw.lotSize ? `₹${(upperPrice * raw.lotSize).toLocaleString("en-IN")}` : null;
      
      const openDate = parseDate(raw.openDate);
      
      const baseIpo: Partial<InsertIpo> = {
        symbol: raw.symbol,
        companyName: raw.companyName,
        priceRange: raw.priceRange.includes("₹") ? raw.priceRange : `₹${raw.priceRange}`,
        totalShares: null,
        expectedDate: openDate,
        status: raw.status,
        description: `${raw.companyName} IPO. Issue size: ${raw.issueSize}.`,
        sector: null,
        issueSize: raw.issueSize,
        lotSize: raw.lotSize || null,
        minInvestment,
        gmp: gmp?.gmp ?? null,
        revenueGrowth: null,
        ebitdaMargin: null,
        patMargin: null,
        roe: null,
        roce: null,
        debtToEquity: null,
        peRatio: null,
        pbRatio: null,
        sectorPeMedian: null,
        freshIssue: null,
        ofsRatio: null,
        subscriptionQib: null,
        subscriptionHni: null,
        subscriptionRetail: null,
        promoterHolding: null,
        postIpoPromoterHolding: null,
      };
      
      const scores = calculateIpoScore(baseIpo);
      
      return {
        ...baseIpo,
        fundamentalsScore: scores.fundamentalsScore,
        valuationScore: scores.valuationScore,
        governanceScore: scores.governanceScore,
        overallScore: scores.overallScore,
        riskLevel: scores.riskLevel,
        redFlags: scores.redFlags,
        pros: scores.pros,
      } as InsertIpo;
    });
    
    console.log(`📦 Transformed ${transformedIpos.length} IPOs ready for database`);
    return transformedIpos;
  } catch (error) {
    console.error("Scrape and transform failed:", error);
    throw error;
  }
}

export async function testScraper(): Promise<{ success: boolean; count: number; sample: RawIpoData[] }> {
  try {
    const ipos = await scrapeMainboardIPOs();
    return {
      success: true,
      count: ipos.length,
      sample: ipos.slice(0, 3),
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      sample: [],
    };
  }
}
