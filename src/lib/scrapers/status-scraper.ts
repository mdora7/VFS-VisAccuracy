import axios from "axios";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logger";
import type { ScrapeResult, StatusCheckResult } from "@/types";

const VFS_BASE_URL = process.env.VFS_BASE_URL ?? "https://www.vfsglobal.com";

export async function scrapeApplicationStatus(
  referenceNumber: string
): Promise<ScrapeResult> {
  const start = Date.now();

  try {
    // TODO: Implement actual VFS status check logic
    // This is a placeholder — the real implementation will depend on
    // VFS Turkey's specific status tracking page/API
    const response = await axios.get(`${VFS_BASE_URL}/turkey/track-application`, {
      params: { ref: referenceNumber },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15_000,
    });

    const duration = Date.now() - start;

    await prisma.scrapeLog.create({
      data: {
        type: "status",
        target: referenceNumber,
        success: true,
        duration,
      },
    });

    logger.info("Status scrape completed", { referenceNumber, duration });

    return { success: true, data: response.data, duration };
  } catch (error) {
    const duration = Date.now() - start;

    await prisma.scrapeLog.create({
      data: {
        type: "status",
        target: referenceNumber,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration,
      },
    });

    logger.error("Status scrape failed", { referenceNumber, error });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      duration,
    };
  }
}
