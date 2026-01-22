import TelegramBot from "node-telegram-bot-api";
import type { Ipo } from "@shared/schema";

let bot: TelegramBot | null = null;

export function initTelegramBot(): TelegramBot | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("Telegram bot token not configured");
    return null;
  }
  
  try {
    bot = new TelegramBot(token, { polling: false });
    console.log("Telegram bot initialized");
    return bot;
  } catch (error) {
    console.error("Failed to initialize Telegram bot:", error);
    return null;
  }
}

export function getBot(): TelegramBot | null {
  return bot;
}

export async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  if (!bot) {
    console.error("Telegram bot not initialized");
    return false;
  }
  
  try {
    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

export async function sendIpoAlert(chatId: string, ipo: Ipo, alertType: string): Promise<boolean> {
  const message = formatIpoAlertMessage(ipo, alertType);
  return sendTelegramMessage(chatId, message);
}

function formatIpoAlertMessage(ipo: Ipo, alertType: string): string {
  let header = "";
  switch (alertType) {
    case "new_ipo":
      header = "<b>[New IPO Listed]</b>";
      break;
    case "gmp_change":
      header = "<b>[GMP Update]</b>";
      break;
    case "open_date":
      header = "<b>[IPO Opening Soon]</b>";
      break;
    case "ai_analysis":
      header = "<b>[AI Analysis Ready]</b>";
      break;
    default:
      header = "<b>[IPO Alert]</b>";
  }
  
  const scoreLabel = getScoreLabel(ipo.overallScore);
  const riskLabel = getRiskLabel(ipo.riskLevel);
  
  let message = `${header}

<b>${ipo.companyName}</b> (${ipo.symbol})
Sector: ${ipo.sector || "N/A"}
Price: ${ipo.priceRange}
Status: ${ipo.status.toUpperCase()}

[${scoreLabel}] Overall Score: ${ipo.overallScore?.toFixed(1) || "N/A"}/10
[${riskLabel}] Risk Level: ${ipo.riskLevel || "N/A"}`;

  if (ipo.gmp !== null && ipo.gmp !== undefined) {
    const gmpSign = ipo.gmp >= 0 ? "+" : "";
    message += `\nGMP: ${gmpSign}Rs.${ipo.gmp}`;
  }
  
  if (ipo.redFlags && ipo.redFlags.length > 0) {
    message += `\n\n<b>Red Flags:</b>\n${ipo.redFlags.slice(0, 3).map(f => `- ${f}`).join("\n")}`;
  }
  
  if (ipo.aiSummary) {
    message += `\n\n<b>AI Summary:</b>\n${ipo.aiSummary.slice(0, 200)}...`;
  }
  
  message += `\n\n<i>Disclaimer: This is for screening only, not investment advice.</i>`;
  
  return message;
}

function getScoreLabel(score: number | null): string {
  if (!score) return "Score";
  if (score >= 7) return "Strong";
  if (score >= 5) return "Moderate";
  return "Weak";
}

function getRiskLabel(risk: string | null): string {
  switch (risk) {
    case "conservative": return "Low Risk";
    case "moderate": return "Medium Risk";
    case "aggressive": return "High Risk";
    default: return "Unknown";
  }
}

export async function verifyTelegramChatId(chatId: string): Promise<boolean> {
  if (!bot) return false;
  
  try {
    await bot.sendMessage(chatId, "[Success] IPO Analyzer alerts connected. You will receive notifications here.", {
      parse_mode: "HTML"
    });
    return true;
  } catch (error) {
    console.error("Invalid Telegram chat ID:", error);
    return false;
  }
}
