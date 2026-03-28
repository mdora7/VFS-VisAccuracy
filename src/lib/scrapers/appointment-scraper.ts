import axios from "axios";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logger";
import type { ScrapeResult } from "@/types";

const VFS_BASE_URL = process.env.VFS_BASE_URL ?? "https://www.vfsglobal.com";
const MIN_INTERVAL_MS = 30_000;

let lastScrapeTime = 0;

export async function scrapeAppointments(
  visaType: string,
  consulate: string
): Promise<ScrapeResult> {
  const now = Date.now();
  if (now - lastScrapeTime < MIN_INTERVAL_MS) {
    logger.warn("Scrape rate limit: too soon since last request");
    return { success: false, error: "Rate limited", duration: 0 };
  }

  const start = Date.now();

  try {
    lastScrapeTime = now;

    // TODO: Implement actual VFS scraping logic
    // This is a placeholder — the real implementation will depend on
    // VFS Turkey's specific endpoints and page structure
    const response = await axios.get(`${VFS_BASE_URL}/turkey/appointments`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15_000,
    });

    const duration = Date.now() - start;

    await prisma.scrapeLog.create({
      data: {
        type: "appointment",
        target: `${consulate}/${visaType}`,
        success: true,
        duration,
      },
    });

    logger.info("Appointment scrape completed", {
      consulate,
      visaType,
      duration,
    });

    return { success: true, data: response.data, duration };
  } catch (error) {
    const duration = Date.now() - start;

    await prisma.scrapeLog.create({
      data: {
        type: "appointment",
        target: `${consulate}/${visaType}`,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration,
      },
    });

    logger.error("Appointment scrape failed", { consulate, visaType, error });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      duration,
    };
  }
}
