# AGENTS.md

## Project Overview

School Payment Management System — an extension of a primary coaching app for billing/payments. Express.js + Sequelize (MySQL) backend, React + Vite + Redux + Mantine frontend.

## Commands

| Task | Command |
|------|---------|
| Install backend deps | `npm install` (root) |
| Install frontend deps | `cd client && npm install` |
| Dev: backend only | `npm run server` (nodemon, port from `.env`, default 5000) |
| Dev: frontend only | `cd client && npm run dev` (Vite, port 3003) |
| Dev: both | `npm run dev` (concurrently runs both) |
| Production start | `npm start` (serves built client from `client/dist`) |
| Build frontend | `cd client && npm run build` |

## Setup

1. `cp dev.env .env` and update DB credentials
2. MySQL required — DB name from `.env` (`DB_NAME`)
3. Sequelize auto-syncs on startup (`alter: true` in `server.js`) — no migrations
4. `REMOVE_FOREIGN_KEY.sql` exists to drop a legacy FK constraint if needed

## Architecture

### Backend (`server.js` entrypoint)

- **PascalCase directories**: `Model/`, `Routes/`, `Controller/`, `Services/`, `Jobs/`, `Utils/`
- Models exported via barrel: `Model/index.js`
- Routes mounted at `/api/*` in `server.js`
- **Dual CORS**: internal routes use `CLIENT_DOMAIN`-restricted CORS; `/api/external/*` uses open CORS with `x-api-key` auth
- Production serves static `client/dist` with SPA fallback
- **6 cron jobs** start after DB sync — sync grades/students from 3 external sources (primary-coaching, school, coaching APIs)

### Frontend (`client/`)

- Vite app, `type: "module"` in package.json
- Redux (not Redux Toolkit) with thunk middleware
- UI: Mantine + Bootstrap + react-bootstrap
- Router: `react-router-dom` v6, auth via `PrivateOutlet`
- Token stored as `localStorage.token_coaching`
- Vite dev server port: **3003** (hardcoded in `vite.config.js`)
- `.env` `CLIENT_DOMAIN` must match (default `localhost:3003`)

### Key Models

`Payment`, `Student`, `Grade`, `Shift`, `Batch`, `User`, `Expense`, `Revenue`, `CombinedRevenue`, `ExpenseCategory`, `RevenueCategory`

- Grade/Shift/Batch use **composite primary keys** `(tenant, primaryId)` — `constraints: false` on all related FKs
- `Payment.userId` references student ID from external primary-coaching app, **not** the local `User` table
- `Payment.due_amount` (DECIMAL 10,2, nullable) — stores amount owed when `due: true`; only editable when due switch is ON; defaults `null`

### External API (`/api/external/*`)

Authenticated via `x-api-key` header or `Authorization: Bearer <key>` matching `EXTERNAL_API_KEY`. Endpoints:
- `POST /create` — single payment
- `POST /create-bulk` — bulk payments
- `GET /by-students` — payments by student list
- `GET /due-payments?tenant=&year=&month=` — due payment list (optional: `gradeId`, `shiftId`, `batchId`)
- `PATCH /payments/:id/due` — clear due status
- `GET /student-monthly-fees` — monthly fees for a student

### Tenants

Three tenant values: `primary`, `school`, `coaching`. Used to partition synced data and filter queries.

## Gotchas

- **No test framework** — no tests exist anywhere
- **No linter/formatter** — no eslint, prettier, or typecheck config
- Sequelize `alter: true` runs on every startup — schema changes are auto-applied (dev mode)
- `client/package.json` has `"type": "module"` but backend is CommonJS — don't mix import styles
- `.env` file is gitignored; `dev.env` and `prod.env` are templates (nearly identical)
- No CI/CD config exists
