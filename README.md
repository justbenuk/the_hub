# Tamworth Hub

A clean, modern community hub built with Next.js App Router, Server Actions, Prisma, and shadcn/ui.

Features include:

- Business directory with listing requests
- Jobs, events, news, and charities sections
- Public submission forms with admin moderation workflow
- Search and filtering on each section page
- Stripe subscription checkout and billing portal for paid plans
- Admin analytics with profile views, clicks, and CTR
- SEO enhancements for business profiles (metadata, OG image, JSON-LD)
- Admin clients view with user plans and linked listings
- Owner listing edit workflow that re-enters moderation
- Automatic featured ranking/badges for paid plan businesses and matching job posts

## Stack

- Next.js 16 (App Router)
- Prisma 7 + SQLite
- Server Actions for auth and business listing requests
- shadcn/ui components + Tailwind CSS

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Run Prisma migration:

```bash
DATABASE_URL="file:./dev.db" npm run prisma:migrate -- --name init
```

4. Seed local sample data:

```bash
DATABASE_URL="file:./dev.db" npm run prisma:seed
```

5. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Stripe Setup

Add these values to `.env.local`:

- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_PARTNER`

Run Stripe webhook listener in development:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The business pricing page is at `/for-business`.

## Admin Setup

To grant an existing user admin access:

```bash
DATABASE_URL="file:./dev.db" npm run make:admin -- you@example.com
```

Admin moderation is available at `/admin/moderation`.

Client account overview is available at `/admin/clients`.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - create/apply migrations
- `npm run prisma:seed` - seed Tamworth sample directory/news/events/jobs data
- `npm run prisma:studio` - open Prisma Studio
- `npm run make:admin -- you@example.com` - promote an existing user to admin

## Auth

Auth uses secure password hashing (`scrypt`) and HTTP-only session cookies backed by Prisma `Session` records.
