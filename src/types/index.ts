export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AppointmentSlotData {
  date: string;
  time: string;
  available: boolean;
  consulate: string;
  visaType: string;
}

export interface StatusCheckResult {
  referenceNumber: string;
  currentStatus: string;
  previousStatus?: string;
  changedAt?: string;
}

export interface NotificationPayload {
  type: "appointment" | "status";
  message: string;
  channels: NotificationChannel[];
  recipientId: string;
}

export type NotificationChannel = "telegram" | "whatsapp" | "sms";

export interface ScrapeResult {
  success: boolean;
  data?: unknown;
  error?: string;
  duration: number;
}
