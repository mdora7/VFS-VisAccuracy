# VFS-VisAccuracy

A real-time VFS Global visa appointment tracker and application status monitor for the **Turkey region**. Monitors appointment slot availability and application status changes, then pushes instant notifications via Telegram, WhatsApp, and SMS.

## Features

- **Appointment Tracking** — Continuously monitors VFS Turkey for available visa appointment slots
- **Application Status Monitoring** — Tracks application status changes by reference number
- **Multi-Channel Notifications** — Alerts via Telegram Bot, WhatsApp, and SMS (Twilio)
- **Rate-Limited Scraping** — Respects VFS rate limits with exponential backoff
- **Scrape Logging** — Full audit trail of every scrape attempt (success/failure/duration)
- **Scheduled Jobs** — Configurable cron-based monitoring intervals
- **REST API** — JSON API for managing trackers, users, and statuses
- **Dockerized** — One-command deployment with Docker Compose

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Notifications | Telegraf, Twilio (WhatsApp + SMS) |
| Scheduling | node-cron |
| Logging | Winston |
| Containerization | Docker & Docker Compose |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop
- Telegram Bot Token (via [@BotFather](https://t.me/BotFather))
- Twilio Account (for SMS & WhatsApp)

### Installation

```bash
# Clone the repo
git clone https://github.com/mdora7/VFS-VisAccuracy.git
cd VFS-VisAccuracy

# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local
# Fill in your credentials in .env.local

# Start PostgreSQL
docker compose -f docker/docker-compose.yml up db -d

# Run database migrations
npx prisma migrate dev

# Start the dev server
npm run dev
```

The API will be available at `http://localhost:3000`.

### Docker (Full Stack)

```bash
# Start both app + database
docker compose -f docker/docker-compose.yml up -d
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check & DB connectivity |
| `GET` | `/api/appointments` | List appointment trackers |
| `POST` | `/api/appointments` | Create a new appointment tracker |
| `GET` | `/api/status` | List all tracked applications |
| `GET` | `/api/status?ref=XXX` | Get status by reference number |
| `POST` | `/api/status` | Track a new application |

### Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "data": { ... },
  "error": "message (only on failure)"
}
```

## Project Structure

```
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── health/
│   │       ├── appointments/
│   │       └── status/
│   ├── lib/
│   │   ├── db/              # Prisma client
│   │   ├── logger.ts        # Winston logger
│   │   ├── notifications/   # Telegram, WhatsApp, SMS
│   │   ├── scrapers/        # VFS appointment & status scrapers
│   │   └── scheduler/       # Cron job management
│   └── types/               # Shared TypeScript types
├── .env.example
├── CLAUDE.md
└── package.json
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `VFS_BASE_URL` | VFS Global base URL |
| `VFS_REGION` | Target region (`turkey`) |
| `SCRAPE_INTERVAL_MS` | Scraping interval in milliseconds |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for notifications |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio SMS sender number |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender number |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type check |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run docker:up` | Start all Docker services |
| `npm run docker:down` | Stop all Docker services |

## License

MIT
