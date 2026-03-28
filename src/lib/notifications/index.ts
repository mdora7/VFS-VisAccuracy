import type { NotificationChannel, NotificationPayload } from "@/types";
import { sendTelegramMessage } from "./telegram";
import { sendWhatsAppMessage } from "./whatsapp";
import { sendSms } from "./sms";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db/client";

export async function notify(payload: NotificationPayload): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: payload.recipientId },
  });

  if (!user) {
    logger.warn("User not found for notification", {
      recipientId: payload.recipientId,
    });
    return;
  }

  const dispatchers: Record<NotificationChannel, () => Promise<boolean>> = {
    telegram: () => {
      if (!user.telegram) return Promise.resolve(false);
      return sendTelegramMessage(user.telegram, payload.message);
    },
    whatsapp: () => {
      if (!user.whatsapp) return Promise.resolve(false);
      return sendWhatsAppMessage(user.whatsapp, payload.message);
    },
    sms: () => {
      if (!user.phone) return Promise.resolve(false);
      return sendSms(user.phone, payload.message);
    },
  };

  const results = await Promise.allSettled(
    payload.channels.map((ch) => dispatchers[ch]())
  );

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      logger.error("Notification channel failed", {
        channel: payload.channels[i],
        error: result.reason,
      });
    }
  });
}
