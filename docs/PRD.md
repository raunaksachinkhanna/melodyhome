# Melody Home Merchandise
## Product Requirements Document

**Author:** Raunak Khanna, BSc Computer Science, UBC Okanagan
**Founder:** Tannya Khanna
**Version:** 1.0
**Date:** May 20, 2026
**Status:** Draft
**Contact:** tannya@melodyhome.in

---

*"A system built to preserve a 500-year-old craft and eliminate 25 minutes of manual work per order."*

---

## 1. Background

Melody Home Merchandise is a purpose-driven collective founded by Tannya Khanna during the COVID-19 pandemic. Witnessing ठठेरा artisans — practitioners of a 500-year-old brass craft from Jandiala Guru, Punjab, recognised by UNESCO as an Intangible Cultural Heritage — living without income during the pandemic lockdowns, Tannya began what she describes as "a little give back to society." In this journey she encountered underprivileged women from villages surrounding the factory, many of them survivors of domestic violence, whose stories deepened the mission beyond craft revival into genuine social transformation. In 2024, Melody Home formalised into a structured business model: blending traditional ठठेरा craftsmanship with skill development, offering sustainable livelihoods to both artisans and marginalised women. Every product is made to order. Every purchase directly funds an artisan or a woman finding economic independence. The brand name itself reflects Tannya's identity as a vocalist — Melody Home is, in her words, a "Harmonious Rhythmic community." The growbags, stitched by these women, are called what the women themselves call them: "Gamla" — ਗਮਲਾ — गमला.

By 2026, the mission is real. The infrastructure is not. Orders arrive through Instagram DM and WhatsApp. Payment is collected across PayZapp, Google Pay, and UPI with no unified record. Shipping is booked through a phone call to Bluedart before their 6pm daily cutoff. One person holds every link of this chain together. When that person is unavailable, everything stops. This project exists to change that.

---

## 2. Problem Statement

Melody Home cannot scale. Every order placed today triggers a sequence of entirely manual interventions — a customer inquiry arrives via Instagram DM or WhatsApp, payment is collected across fragmented UPI channels with no unified record, packing is coordinated verbally, a phone call is placed to Bluedart before their 6pm cutoff, and the tracking number is manually communicated back to the customer. One person holds every link of this chain together. In one documented instance this chain broke — a customer did not receive their tracking number, the parcel was delayed, and no system existed to catch it. This is not an isolated failure. It is what this system reliably produces. At 7 orders a month the cost is 2.9 hours of avoidable human overhead and an estimated ₹9,03,000 INR in unrealised annual revenue — not because demand is absent, but because the infrastructure cannot serve it. Oldroyd et al. (2011) demonstrated that response times exceeding one hour reduce lead conversion probability by 7x; at Melody Home's current latency of up to 24 hours, the majority of inbound inquiries do not convert. The root cause is architectural: Dijkstra's (1974) principle of separation of concerns is entirely absent — business logic, logistics, payment verification, and customer communication are entangled within a single human workflow with no modularity, no fallback, and no path to scale. Corporate clients capable of placing 50–500 unit orders in a single transaction will not engage with a business operating through Instagram DMs. The system cannot be optimised because it has not been designed. It has simply accumulated.

---

## 3. Scope

| In Scope | Out of Scope |
|---|---|
| Direct-to-consumer storefront at melodyhome.in | Amazon / Flipkart marketplace integrations |
| Full checkout flow with Razorpay (INR) | International shipping and multi-currency |
| Automated Shiprocket courier assignment | Mobile application (iOS / Android) |
| WhatsApp Business API order notifications | Multi-language storefront (v1) |
| Corporate gifting inquiry flow + GST invoicing | User accounts and order history (v1) |
| AI recommendation engine | Loyalty and rewards programme |
| Demand forecasting for artisan briefing | Real-time inventory tracking |
| Auto-generated packing and production lists | Subscription or recurring orders |
| Admin dashboard for order management | Third-party seller marketplace |
| Product variant support (colour, size, fragrance) | Social commerce integrations |

---

## 4. Target Users & Usage Scenarios

**4.1 Target User Groups**

| User Group | Description | Primary Need |
|---|---|---|
| Individual Buyer | Urban, values-driven consumer purchasing for gifting, home décor, or personal use | Seamless discovery, checkout, and delivery tracking |
| Corporate Client | HR or procurement professional sourcing festival, onboarding, or event gifts in bulk | Bulk order flow, GST invoice, lead time clarity |
| Wedding Planner | Curator sourcing artisan gift sets for wedding favours or ceremonies | Curated gifting sets, customisation inquiry |
| Operations Team | Tannya and the packing team fulfilling orders | Auto-generated packing lists and production orders |
| System Administrator | Raunak managing the platform | Product CRUD, order management, analytics |

**4.2 Usage Scenarios**

**Scenario 1 — Individual Purchase**
A customer discovers Melody Home on Instagram, visits melodyhome.in, browses the brass catalogue, and adds the Aśva Stirrer (set of 2, ₹1,650) to cart. The system displays a lead time notice — made to order, dispatched within 7 working days. The customer completes checkout via Razorpay UPI. On payment confirmation, the system writes the order to the database, queues a WhatsApp notification, triggers Shiprocket courier assignment, and generates a production order for the artisan team — all within 30 seconds. The customer receives a WhatsApp message with order confirmation. When dispatched, they receive a second message with the Shiprocket tracking link. No human intervention required.

**Scenario 2 — Corporate Gifting**
An HR manager at a Delhi-based company needs 200 Brass Coaster sets for Diwali. She visits the Corporate Gifting page, fills the inquiry form specifying quantity, budget, and delivery date. The system sends her a WhatsApp acknowledgement and emails Tannya with the full inquiry details. Tannya responds with a custom quote, GST invoice, and production timeline. The system generates a bulk production brief for the artisan team.

**Scenario 3 — Demand Forecasting**
Four weeks before Diwali, the AI demand forecasting module analyses the previous year's order patterns and predicts a 6x spike in brass product orders. The system automatically generates a production brief for the artisan team: estimated units per SKU, materials required, recommended start date. Tannya reviews and confirms. Artisans begin production before orders arrive — eliminating the reactive scramble of previous years.

**Scenario 4 — Admin Order Management**
Raunak logs into the admin dashboard. He sees all active orders, their Shiprocket status, WhatsApp notification delivery confirmation, and any failed webhook events. A Razorpay payment has succeeded but the Shiprocket call has failed for one order — the system has flagged it with a retry alert. He triggers a manual retry with one click.

---

## 5. Requirements

**5.1 Functional Requirements**

| ID | Requirement |
|---|---|
| FR-01 | The system SHALL display all products with name, description, price (sales + MRP), SKU, materials, dimensions, and artisan story |
| FR-02 | The system SHALL support product variants (colour, size, fragrance) with independent SKU and HSN code mapping per variant |
| FR-03 | The system SHALL display a made-to-order lead time notice on every product page and at checkout |
| FR-04 | The system SHALL process payments exclusively via Razorpay and support UPI, cards, and net banking |
| FR-05 | The system SHALL calculate GST per product using the HSN code mapped to each SKU |
| FR-06 | The system SHALL generate a GST-compliant invoice for every completed order |
| FR-07 | The system SHALL trigger Shiprocket courier assignment automatically within 60 seconds of payment confirmation |
| FR-08 | The system SHALL send a WhatsApp message to the customer at four order events: confirmed, production started, dispatched, delivered |
| FR-09 | The system SHALL generate a packing list and production order for the operations team on every new order |
| FR-10 | The system SHALL provide a corporate gifting inquiry form capturing quantity, budget, event date, and contact details |
| FR-11 | The system SHALL provide an admin dashboard displaying all orders, Shiprocket AWB status, and WhatsApp delivery confirmation |
| FR-12 | The system SHALL surface AI-powered product recommendations on product detail pages and cart |
| FR-13 | The system SHALL generate a demand forecast 4 weeks before each major festival season |
| FR-14 | The system SHALL support product CRUD operations via the admin dashboard without code changes |
| FR-15 | The system SHALL retry failed Shiprocket and WhatsApp API calls automatically using exponential backoff |

**5.2 Non-Functional Requirements**

| ID | Requirement |
|---|---|
| NFR-01 | The system SHALL achieve p99 API response latency of under 200ms under normal load |
| NFR-02 | The system SHALL achieve Largest Contentful Paint (LCP) under 2.5 seconds on mobile at India 4G baseline |
| NFR-03 | The system SHALL maintain 99.9% uptime measured monthly |
| NFR-04 | The system SHALL handle a minimum of 500 concurrent users without degradation |
| NFR-05 | The system SHALL enforce HTTPS on all endpoints |
| NFR-06 | The system SHALL sanitise all user inputs against OWASP Top 10 vulnerabilities |
| NFR-07 | The system SHALL rate-limit the checkout API to prevent payment abuse |
| NFR-08 | The system SHALL verify Razorpay webhook signatures before processing any payment event |
| NFR-09 | The system SHALL comply with WCAG 2.1 AA accessibility standards |
| NFR-10 | The system SHALL be instrumented with structured JSON logging and error alerting |
| NFR-11 | All product pages SHALL include meta tags, Open Graph tags, and schema.org Product markup for SEO |
| NFR-12 | The system SHALL achieve 80% unit test coverage on the order processing pipeline |

---

## 6. Data Requirements

**6.1 Core Entities**

```
Product
  — id, sku, name, description, artisan_story
  — category, material, hsn_code
  — base_price, mrp, images[]
  — lead_time_days, is_active
  — created_at, updated_at

ProductVariant
  — id, product_id (FK), sku, colour
  — size, fragrance, price, mrp
  — stock_note

Order
  — id, customer_name, customer_phone
  — customer_email, shipping_address
  — total_amount, gst_amount, invoice_number
  — status (pending | confirmed | in_production
            | dispatched | delivered | cancelled)
  — razorpay_payment_id, shiprocket_awb
  — created_at, updated_at

OrderItem
  — id, order_id (FK), product_variant_id (FK)
  — quantity, unit_price, hsn_code

Notification
  — id, order_id (FK), channel (whatsapp | email)
  — event (confirmed | production | dispatched | delivered)
  — status (queued | sent | failed), sent_at

CorporateInquiry
  — id, company_name, contact_name, phone
  — email, quantity, budget, event_date
  — message, status, created_at
```

**6.2 Product Catalogue (Seed Data)**

| SKU | Product | Variant | Sales Price | MRP | HSN |
|---|---|---|---|---|---|
| THA-COSTERS-HB-11 | Brass Coasters | Set of 2 | ₹799 | ₹1,100 | 7409 |
| MH-FB-11 | Flat Bowl Candle | Single | ₹1,350 | ₹1,650 | 741999 |
| STRR-GLBR-11 | Aśva Stirrer | Set of 2 | ₹1,650 | ₹1,950 | 7013 |
| MH-SNFR-11 | Brass Snuffer (Butterfly) | Single | ₹1,199 | ₹1,500 | 7409 |
| MH-SNFR-12 | Brass Snuffer (Music Note) | Single | ₹1,199 | ₹1,500 | 7409 |
| MH-CBP-BF-11 | Camping Throw | Brown Fawn | ₹1,699 | ₹2,499 | 63012000 |
| MH-CBP-GNB-11 | Camping Throw | Navy Green | ₹1,699 | ₹2,499 | 63012000 |
| MH-CBP-GRB-11 | Camping Throw | Grey Navy | ₹1,699 | ₹2,499 | 63012000 |
| MH-CBP-RB-11 | Camping Throw | Red Black | ₹1,699 | ₹2,499 | 63012000 |
| MH-LCAN-S4 | Ladoo Candle | Set of 4 | ₹320 | ₹400 | 341310 |
| MH-LCAN-S2 | Ladoo Candle | Set of 2 | ₹190 | ₹250 | 341310 |
| MH-CCAN-11 | Coconut Cinnamon Candle | Single | ₹600 | ₹799 | 341310 |
| MH-CGJAR-11 | Cinnamon Glass Jar | Single | ₹585 | ₹750 | 341310 |
| MH-IHPB-11 | Hot Pink Candle Jar | Single | ₹699 | ₹899 | 341310 |
| MH-IHBB-11 | Black Candle Jar | Single | ₹699 | ₹899 | 341310 |
| MH-INCL-11 | Brass Incense Holder | Single | ₹799 | ₹999 | 7409 |
| MH-JARS-S | ठठेरा Jar (Small) | 7×10cm | ₹560 | ₹750 | 7419 |
| MH-JARS-M | ठठेरा Jar (Medium) | 8×11cm | ₹750 | ₹950 | 7419 |
| MH-JARS-L | ठठेरा Jar (Large) | 9×13cm | ₹900 | ₹1,100 | 7419 |
| MH-GBAG-11 | Growbag (Gamla) | Set of 3 | ₹599 | ₹799 | 63079090 |

---

## 7. Architecture & Technical Design

**7.1 System Topology**

```
Customer (Next.js 14 / TypeScript)
    → Vercel CDN Edge Network
        → REST API (Node.js / Express)
            ├── Product Service    → PostgreSQL + Redis
            ├── Order Service      → PostgreSQL + SQS
            ├── Payment Service    → Razorpay Webhooks
            ├── Logistics Service  → Shiprocket API
            ├── Notification       → WhatsApp Business API
            └── AI Service         → Recommendations +
                                     Demand Forecasting
        → AWS S3 + CloudFront (images)
        → Admin Dashboard (Next.js)

Infrastructure: AWS (ECS Fargate, S3, SQS, CloudFront)
IaC: Terraform
CI/CD: GitHub Actions → ECR → ECS
Monitoring: CloudWatch + Datadog
```

**7.2 Architectural Trade-offs**

*Trade-off 1 — Monolith-first with explicit service boundaries*

The system is architected as a structured monolith in Phase 1 with clear internal service boundaries that enable microservices extraction in Phase 2. Fowler (2002) explicitly cautions against premature distribution: distributed system complexity must be justified by the scale problem it solves. At 7 current orders per month, the operational cost of managing inter-service communication, distributed tracing, and network latency outweighs the benefits. The monolith ships faster, debugs easier, and generates the real-world load data needed to justify decomposition later.

*Trade-off 2 — PostgreSQL over NoSQL for transactional data*

Order and payment data is relational by nature — an order references a customer, product variant, payment record, shipment, and notification log. Codd's relational model (1970) was designed for precisely this pattern. More critically, payment data requires ACID guarantees. A payment that succeeds but whose corresponding order record fails to write is not an acceptable system state. PostgreSQL's transaction model guarantees atomicity across both writes. MongoDB's document model does not enforce referential integrity and its eventual consistency model introduces risk at exactly the point — payment confirmation — where consistency is most critical.

*Trade-off 3 — Asynchronous order processing via SQS*

On payment.captured webhook receipt, the order is written to PostgreSQL and a message is placed on an SQS queue. Downstream consumers — Shiprocket service, WhatsApp notification service, packing list generator — process this message independently. This follows the producer-consumer pattern formalised by Dijkstra (1965). Three consequences follow: the checkout API response is decoupled from downstream processing latency; failed downstream calls retry automatically without affecting the core order record; and the system exhibits no single point of failure (Avizienis et al., 2004) — failure of any one consumer does not propagate to others. Little's Law (Little, 1961) — L = λW — confirms queue depth remains trivially manageable at target throughput: at 50 orders per day with sub-2-second processing time per message, mean queue depth never exceeds 2.

*Trade-off 4 — CAP theorem applied to consistency model*

Brewer (2000) establishes that a distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance. For order and payment data, Consistency + Partition Tolerance is chosen over Availability — a momentarily unavailable checkout is preferable to a duplicate payment or an order written without a payment record. For the product catalogue and recommendation data, Availability + Partition Tolerance is chosen over Consistency — a slightly stale product listing is acceptable; a catalogue that returns errors is not. Redis cache serves the catalogue with a 5-minute TTL, invalidated on product update events.

**7.3 AI Layer**

*Recommendation engine:* Item-item collaborative filtering (Goldberg et al., 1992) identifies products frequently purchased together. At current catalogue size (< 25 SKUs), a cosine similarity matrix computed over the purchase co-occurrence graph is sufficient — neural network overhead is not justified by data volume. The model retrains weekly. Cold start strategy: before sufficient purchase data exists (< 50 orders), the system falls back to manually curated "pairs well with" relationships seeded at product creation — candle + snuffer, incense holder + coasters. This hybrid approach ensures recommendations are never empty and degrade gracefully to data-driven as volume grows.

*Demand forecasting:* A seasonal decomposition model (Cleveland et al., 1990) identifies festival-season demand patterns — Diwali (October), Holi (March), wedding season (November–February) — and generates 4-week forward production briefs. At sub-100 historical orders, the model is bootstrapped with categorical priors: brass products peak at Diwali, candles peak year-round with a wedding season spike, throws peak in winter. As order history accumulates the priors are weighted down and empirical patterns dominate.

**7.4 Tech Stack**

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router), TypeScript | 14.x |
| Styling | Tailwind CSS | 3.x |
| Backend | Node.js, Express | 20.x LTS |
| Database | PostgreSQL (Supabase → Aurora) | 15.x |
| Cache | Redis (ElastiCache) | 7.x |
| Queue | AWS SQS | — |
| Payments | Razorpay | v2 |
| Logistics | Shiprocket | v2 |
| Messaging | WhatsApp Business Cloud API | v18 |
| AI/ML | Python, scikit-learn, pandas | 3.11 |
| Infrastructure | AWS ECS Fargate, S3, CloudFront | — |
| IaC | Terraform | 1.6.x |
| CI/CD | GitHub Actions | — |
| Monitoring | CloudWatch, Datadog | — |

**7.5 CI/CD Pipeline**

```
git push → GitHub Actions
    → Lint + Type Check (ESLint, tsc)
    → Unit Tests (Jest, min 80% coverage)
    → Integration Tests (order pipeline)
    → Docker build → push to ECR
    → Terraform plan (preview)
    → Deploy to ECS Fargate (staging)
    → Smoke tests
    → Manual approval gate
    → Deploy to ECS Fargate (production)
    → Datadog deployment marker
```

---

## 8. Constraints

| Constraint | Description |
|---|---|
| Made-to-order model | No inventory buffer. Production begins on order confirmation. Lead time must be prominently communicated at all stages |
| Solo developer | All engineering, deployment, and maintenance is handled by a single developer. Architecture must prioritise operational simplicity and comprehensive documentation |
| GST compliance | All transactions require HSN-code-based GST calculation and invoice generation per Indian tax law |
| Shiprocket dependency | Logistics automation is entirely dependent on Shiprocket API availability. Manual override must exist in admin dashboard |
| WhatsApp Business API limits | Meta enforces message template approval and per-day messaging limits. All notification templates require pre-approval before launch |
| Razorpay webhook reliability | Payment confirmation is webhook-driven. System must handle duplicate, delayed, and out-of-order webhook events idempotently |
| India 4G baseline | Primary users are mobile-first, India-based. All performance targets are measured at 4G throughput, not broadband |
| Brand colours | Deep brown #3E0E00, gold #C9913A, cream #F6EFE2. All UI must adhere strictly to brand palette |

---

## 9. Success Metrics & Criteria

| Metric | Baseline | Target | Pass Criteria |
|---|---|---|---|
| Order processing time | 25 min/order | < 2 min/order | Automated pipeline completes within 120 seconds of payment.captured event |
| Customer response latency | Up to 24 hours | < 30 seconds | WhatsApp confirmation delivered within 30 seconds of payment confirmation |
| Monthly order capacity | 7 orders | 50+ orders | System handles 50 concurrent orders without errors under load test |
| Manual steps per order | 6 steps | 1 step | Only action required from operations team is printing the Shiprocket label |
| API p99 latency | Unmeasured | < 200ms | Datadog p99 under sustained load test |
| Page load (LCP, mobile 4G) | Unmeasured | < 2.5 seconds | Measured via Lighthouse CI on each deployment |
| Checkout conversion rate | Unmeasured | > 35% | Google Analytics 4 funnel report, 30 days post-launch |
| Shiprocket auto-assignment | 0% | > 95% | < 5% of orders require manual courier intervention |
| WhatsApp delivery rate | 0% | > 98% | < 2% notification failures across all order events |
| Uptime | Unmeasured | 99.9% | < 43 minutes downtime per month, measured by CloudWatch |
| Corporate gifting inquiries | 0/month | 5+/month | Google Analytics 4 form submission events, 60 days post-launch |
| Test coverage (order pipeline) | 0% | > 80% | Jest coverage report on CI |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Razorpay webhook delivery failure | Medium | Critical | Idempotent handler with order status check before processing; Razorpay dashboard as fallback verification |
| Shiprocket API downtime | Low | High | Retry queue with exponential backoff; manual override in admin dashboard; Delhivery as fallback courier |
| WhatsApp template rejection by Meta | Medium | High | Submit all templates 2 weeks before launch; email notification as fallback channel |
| Made-to-order lead time mismatch | High | High | Prominent lead time display on product page, cart, and checkout confirmation; demand forecasting to pre-brief artisans |
| Payment success, order write failure | Low | Critical | Database transaction wraps payment record and order record atomically; Razorpay webhook retry guarantees reprocessing |
| Peak load degradation (Diwali) | Medium | High | Load testing with k6 before festival season; Redis cache reduces DB load; ECS auto-scaling configured |
| Knowledge concentration risk | High | High | Architecture Decision Records (ADRs) in repository; infrastructure as code via Terraform; runbook for every operational procedure; CloudWatch alerts to email and WhatsApp |
| Corporate client expects instant fulfilment | Medium | Medium | Dedicated corporate gifting page with explicit lead times; direct WhatsApp contact line for bulk coordination |
| Cold start — insufficient AI training data | High | Low | Manually curated fallback recommendations at launch; model activates automatically at 50 orders |

---

## References

Avizienis, A., Laprie, J.-C., Randell, B., & Landwehr, C. (2004). Basic concepts and taxonomy of dependable and secure computing. *IEEE Transactions on Dependable and Secure Computing, 1*(1), 11–33.

Brewer, E. (2000). Towards robust distributed systems. *Proceedings of the 19th Annual ACM Symposium on Principles of Distributed Computing.*

Cleveland, R. B., Cleveland, W. S., McRae, J. E., & Terpenning, I. (1990). STL: A seasonal-trend decomposition procedure based on loess. *Journal of Official Statistics, 6*(1), 3–73.

Codd, E. F. (1970). A relational model of data for large shared data banks. *Communications of the ACM, 13*(6), 377–387.

Dijkstra, E. W. (1965). Solution of a problem in concurrent programming control. *Communications of the ACM, 8*(9), 569.

Dijkstra, E. W. (1974). On the role of scientific thought. *Selected Writings on Computing: A Personal Perspective.*

Fowler, M. (2002). *Patterns of Enterprise Application Architecture.* Addison-Wesley.

Goldberg, D., Nichols, D., Oki, B. M., & Terry, D. (1992). Using collaborative filtering to weave an information tapestry. *Communications of the ACM, 35*(12), 61–70.

IEEE. (1998). *IEEE Recommended Practice for Software Requirements Specifications (IEEE Std 830-1998).* IEEE.

Little, J. D. C. (1961). A proof for the queuing formula L = λW. *Operations Research, 9*(3), 383–387.

Oldroyd, J. D., McElheran, K., & Elkington, D. (2011). The short life of online sales leads. *Harvard Business Review, 89*(3), 28.

