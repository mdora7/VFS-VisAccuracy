import twilio from "twilio";
import { logger } from "@/lib/logger";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials are not set");
  return twilio(sid, token);
}

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  try {
    const client = getClient();
    const from = process.env.TWILIO_WHATSAPP_NUMBER;
    await client.messages.create({
      body: message,
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });
    logger.info("WhatsApp message sent", { to });
    return true;
  } catch (error) {
    logger.error("Failed to send WhatsApp message", { to, error });
    return false;
  }
}
