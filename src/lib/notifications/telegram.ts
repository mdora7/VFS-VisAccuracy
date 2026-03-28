import { Telegraf } from "telegraf";
import { logger } from "@/lib/logger";

let bot: Telegraf | null = null;

function getBot(): Telegraf {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
    bot = new Telegraf(token);
  }
  return bot;
}

export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    await getBot().telegram.sendMessage(chatId, message, {
      parse_mode: "HTML",
    });
    logger.info("Telegram message sent", { chatId });
    return true;
  } catch (error) {
    logger.error("Failed to send Telegram message", { chatId, error });
    return false;
  }
}
