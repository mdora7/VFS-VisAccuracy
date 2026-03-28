import twilio from "twilio";
import { logger } from "@/lib/logger";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials are not set");
  return twilio(sid, token);
}

export async function sendSms(
  to: string,
  message: string
): Promise<boolean> {
  try {
    const client = getClient();
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    logger.info("SMS sent", { to });
    return true;
  } catch (error) {
    logger.error("Failed to send SMS", { to, error });
    return false;
  }
}
