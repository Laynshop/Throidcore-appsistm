# Throidcore

Throidcore is a workflow workspace for AI-driven operations, dashboards, and automations.

## Stack
- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- Cache: Redis
- Deployment: Cloudflare Pages + Render

## Local development
1. `npm install`
2. `npm run docker:up`
3. `npm run prisma:generate`
4. `npm run prisma:migrate`
5. `npm run dev`

## Production configuration
- Frontend: Cloudflare Pages
- Backend: Render
- Database: Neon / Supabase
- DNS / SSL: Cloudflare

## Project structure
- `apps/web` – Next.js app
- `apps/api` – NestJS backend
- `prisma` – Prisma schema
