import cron from "node-cron";
import { logger } from "@/lib/logger";

const jobs = new Map<string, cron.ScheduledTask>();

export function scheduleJob(
  name: string,
  cronExpression: string,
  handler: () => Promise<void>
): void {
  if (jobs.has(name)) {
    logger.warn("Job already scheduled, stopping previous", { name });
    jobs.get(name)?.stop();
  }

  const task = cron.schedule(cronExpression, async () => {
    logger.info("Running scheduled job", { name });
    try {
      await handler();
    } catch (error) {
      logger.error("Scheduled job failed", { name, error });
    }
  });

  jobs.set(name, task);
  logger.info("Job scheduled", { name, cronExpression });
}

export function stopJob(name: string): void {
  const task = jobs.get(name);
  if (task) {
    task.stop();
    jobs.delete(name);
    logger.info("Job stopped", { name });
  }
}

export function stopAllJobs(): void {
  for (const [name, task] of jobs) {
    task.stop();
    logger.info("Job stopped", { name });
  }
  jobs.clear();
}
