# VFS-VisAccuracy

## Project Overview
A VFS Global visa appointment tracker and application status monitor for the **Turkey region**. Built with Next.js (API-first), PostgreSQL, and Docker. Notifications via Telegram, WhatsApp, and SMS.

## Tech Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: Next.js 14 (App Router) — API routes first, frontend later
- **Database**: PostgreSQL 16 via Prisma ORM
- **Containerization**: Docker & Docker Compose (Ubuntu-based images)
- **Notifications**: Telegram Bot API, WhatsApp (via whatsapp-web.js or Twilio), SMS (Twilio)
- **Language**: TypeScript (strict mode)

## Project Structure
```
src/
  app/
    api/          # Next.js API routes
  lib/
    db/           # Prisma client & utilities
    scrapers/     # VFS appointment & status scrapers
    notifications/ # Telegram, WhatsApp, SMS services
    scheduler/    # Cron/interval job management
    utils/        # Shared helpers
  types/          # TypeScript type definitions
prisma/
  schema.prisma   # Database schema
  migrations/     # Prisma migrations
docker/           # Dockerfiles and compose
```

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint check
- `npm run type-check` — TypeScript type checking
- `npx prisma migrate dev` — Run database migrations
- `npx prisma generate` — Regenerate Prisma client
- `npx prisma studio` — Open Prisma database GUI
- `docker compose up -d` — Start all services (app + db)
- `docker compose down` — Stop all services

## Code Conventions
- Use TypeScript strict mode — no `any` types unless absolutely necessary
- Use `async/await` over raw promises
- All API routes return consistent JSON: `{ success: boolean, data?: T, error?: string }`
- Environment variables go in `.env.local` (never committed) — use `.env.example` as template
- Prisma schema is the single source of truth for DB types
- Keep scraper logic isolated from notification logic
- One notification service per file in `src/lib/notifications/`
- Use named exports, not default exports
- Error handling: let errors bubble up to API route handlers, catch there

## Scraping Guidelines
- Respect rate limits — minimum 30s between VFS requests
- Use proper User-Agent headers
- Implement retry with exponential backoff
- Log all scrape attempts for debugging
- Cache results to avoid redundant notifications

## Database
- Always create migrations for schema changes (`npx prisma migrate dev --name descriptive_name`)
- Never edit migration files after they've been applied
- Use Prisma's `@updatedAt` for audit trails

## Docker
- App runs on port 3000
- PostgreSQL on port 5432
- Use `docker/` directory for all Docker-related files
- Base image: `node:20-slim` (Debian/Ubuntu based)

## Environment Variables
See `.env.example` for all required variables. Key ones:
- `DATABASE_URL` — PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN` — Telegram bot API token
- `TELEGRAM_CHAT_ID` — Target Telegram chat
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — For SMS & WhatsApp
- `VFS_BASE_URL` — VFS Global Turkey endpoint
