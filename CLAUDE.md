# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Melody Home Merchandise (`melodyhome.in`) is a made-to-order e-commerce platform for a UNESCO-recognised ठठेरा (brass craft) artisan brand. Every order triggers an automated pipeline: Razorpay payment → PostgreSQL write → SQS queue → Shiprocket courier assignment + WhatsApp notification + packing list generation, all within 60 seconds and with no manual steps.

The full PRD is in `docs/PRD.md`.

## Commands

```bash
# From repo root
npm run dev:web       # Next.js dev server (apps/web)
npm run dev:api       # Express API dev server with tsx watch (apps/api)

# Per-package (cd into apps/web or apps/api)
npm run dev           # dev server for that package
npm run build         # production build
npm run lint          # ESLint
npm test              # Jest (API: min 80% coverage on order pipeline)
npm run test:watch    # Jest watch mode for a single file
npm run test:coverage # Jest coverage report

# Database
psql $DATABASE_URL -f packages/db/migrations/001_initial_schema.sql
psql $DATABASE_URL -f packages/db/seeds/001_products.sql

# Infrastructure
terraform plan        # preview infra changes
terraform apply       # apply to staging/prod
```

## Architecture

**Phase 1: Structured monolith** with explicit internal service boundaries — decompose to microservices only when order volume justifies it.

```
Next.js 14 (App Router, TypeScript)
    → Node.js / Express REST API
        ├── Product Service    → PostgreSQL + Redis (5-min TTL cache)
        ├── Order Service      → PostgreSQL + SQS (async downstream)
        ├── Payment Service    → Razorpay webhooks (idempotent handler)
        ├── Logistics Service  → Shiprocket API v2
        ├── Notification       → WhatsApp Business Cloud API v18
        └── AI Service         → Python / scikit-learn (recommendations + forecasting)
    → AWS S3 + CloudFront (product images)
    → Admin Dashboard (Next.js)
Infrastructure: AWS ECS Fargate, SQS, ElastiCache (Redis), RDS Aurora PostgreSQL
IaC: Terraform | CI/CD: GitHub Actions → ECR → ECS
```

**Async order processing:** On `payment.captured` webhook, write order to PostgreSQL atomically, then enqueue to SQS. Three independent consumers process the message: Shiprocket assignment, WhatsApp notification, packing list generator. Each retries independently with exponential backoff (FR-15). Failure of one consumer never propagates to others.

**CAP choices:** Order/payment data → Consistency + Partition Tolerance (no duplicate payments). Product catalogue → Availability + Partition Tolerance (stale cache acceptable, errors are not).

## Core Data Model

```
Product → ProductVariant (colour/size/fragrance, each with own SKU + HSN code)
Order → OrderItem (FK to ProductVariant)
Order → Notification (whatsapp/email × confirmed/production/dispatched/delivered)
CorporateInquiry (standalone — no FK to Order)
```

Order status lifecycle: `pending → confirmed → in_production → dispatched → delivered → cancelled`

## Critical Implementation Rules

**Razorpay webhooks** — always verify the signature before processing. Check order status before acting — webhooks can arrive duplicate, delayed, or out of order. The payment record and order record must be written in a single PostgreSQL transaction.

**GST** — every product has an `hsn_code`. Calculate GST per line item using HSN. Generate a GST-compliant invoice for every completed order (FR-06). This is a legal requirement, not optional.

**Made-to-order** — no inventory. Lead time (`lead_time_days`) must be shown on the product page, in cart, and at checkout. Never imply immediate dispatch.

**Shiprocket** — admin dashboard must always expose a manual override for courier assignment (constraint: Shiprocket can go down).

**AI cold start** — before 50 orders exist, fall back to manually curated `pairs_well_with` relationships seeded at product creation. Do not leave recommendations empty.

## Brand & UI

Strict palette — no deviations:
- Deep brown: `#3E0E00`
- Gold: `#C9913A`
- Cream: `#F6EFE2`

All product pages require meta tags, Open Graph tags, and `schema.org/Product` markup (NFR-11). Performance target: LCP < 2.5s on mobile India 4G.

## Tech Stack Versions

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js App Router, TypeScript | 14.x |
| Styling | Tailwind CSS | 3.x |
| Backend | Node.js, Express | 20.x LTS |
| Database | PostgreSQL (Supabase dev → Aurora prod) | 15.x |
| Cache | Redis (ElastiCache) | 7.x |
| AI/ML | Python, scikit-learn, pandas | 3.11 |
| Payments | Razorpay | v2 |
| Logistics | Shiprocket | v2 |
| Messaging | WhatsApp Business Cloud API | v18 |
| IaC | Terraform | 1.6.x |

## Product Catalogue (Seed Data)

20 SKUs across brass (ठठेरा), candles, camping throws, and growbags (Gamla/ਗਮਲਾ). HSN codes are already defined in `docs/PRD.md §6.2` — use them exactly when seeding. Do not invent HSN codes.
