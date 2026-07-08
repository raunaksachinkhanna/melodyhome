# Frontend Build Spec — Melody Home Storefront

A concrete plan for the customer-facing storefront, derived from the market
research and the payment backend already built and tested. This is the target to
build against — screen by screen, mobile-first — not a vibe.

> **Principle carried from the whole project:** understand each piece, build one
> screen at a time, prove it works against the real API. Same discipline as the
> backend.

---

## Design north star

**Quiet confidence.** Simple enough to trust, honest enough to support a cause,
well-crafted enough that the taste shows. Impressiveness comes from *coherence
and restraint*, not visual fireworks.

- **Palette:** deep brown `#3E0E00`, gold `#C9913A`, cream `#F6EFE2`
  (already wired into `tailwind.config.ts` as brand tokens).
- **Tone:** warm, heritage-premium, artisan-forward.
- **Story-first:** the artisan narrative is the hero, stated truthfully.
- **Mobile-first:** build the phone layout first, scale up. Most traffic is
  mobile.
- **Trust layer:** honest lead-time, provenance, secure-checkout signals.

---

## What's already built (the backend this sits on)

- `GET /api/products` — returns the product catalogue as JSON (active products).
- `POST /api/orders` — takes a cart (variant ids + quantities) + customer
  details, computes the **true total server-side** from DB prices, creates a
  Razorpay order, returns `{ razorpay_order_id, amount, currency, key_id }`.
- `POST /api/webhooks/razorpay` — receives the signed payment webhook, verifies
  it, and writes the confirmed order to the DB (idempotent, atomic). **Proven.**

The frontend's job is to call these — nothing about payment *logic* lives in the
browser. The browser collects the cart and opens Razorpay's popup; the server
decides price and truth.

---

## Screens to build (in order)

### 1. Catalogue / storefront home  *(build first)*
The concept already sketched. Structure top-to-bottom:
- **Hero** — artisan story in a sentence + one strong image. UNESCO ठठेरा,
  Jandiala Guru, women artisans. Emotional, clean, not a text dump.
- **Collection grid** — product cards pulling from `GET /api/products`. Each
  card: image, name, one-line description, price + MRP, a "handmade"/provenance
  badge.
- **Category filter** — All / Brass / Candles / Textiles (client-side filter of
  the fetched products; no new endpoint needed).
- **Made-to-order trust banner** — reframes the 7-day lead time as a feature.
- **Data source:** `GET /api/products`. This is the first real API wiring —
  prove the grid renders live data before styling it heavily.

### 2. Product detail page
Where the interested buyer goes deeper (the "second reading depth").
- Large image(s), full name, price.
- **Full artisan story** — the longer provenance narrative lives here.
- **Variant picker** — colour / size / fragrance (from `product_variants`).
  Selecting a variant sets which `product_variant_id` goes into the cart.
- Made-to-order lead time, dimensions, care, "no two identical" honesty.
- **Add to cart** button.

### 3. Cart
- Line items (variant, quantity, unit price), quantity adjust, remove.
- Running subtotal (display only — the *authoritative* total is computed
  server-side at checkout; never trust the browser's number for payment).
- **Cart state** lives in React state / context for the session. (Note:
  browser storage APIs are constrained in some environments — keep cart in
  memory for v1 unless a persistence approach is chosen deliberately.)
- "Proceed to checkout" button.

### 4. Checkout
- Customer form: name, phone, email (optional), shipping address
  (line1, city, state, pincode, line2 optional) — matching what `POST
  /api/orders` and the webhook expect.
- On submit: call `POST /api/orders` with the cart → receive
  `{ razorpay_order_id, amount, key_id }` → open **Razorpay's browser checkout
  popup** using those values.
- The popup handles the actual payment. On success, the customer sees a
  confirmation; the **order is only truly created when the signed webhook
  arrives** (already built). The browser's "success" is a UX signal, not the
  source of truth.
- **New tool to learn here:** Razorpay's frontend Checkout (the browser popup
  script). Understand how it takes the `order_id` + `key_id` and returns a
  payment result. Read Razorpay's *current* Checkout docs when building.

### 5. Order confirmation
- Simple, reassuring: "Thank you — your order is confirmed." Order reference,
  what happens next (made to order, ~7 days, tracking to follow via WhatsApp).

### 6. Corporate gifting page  *(revenue lever — from PRD + research)*
- Dedicated path for the gifting/festival segment (less price-sensitive, buys in
  bursts). An inquiry form feeding the `corporate_inquiries` table (already in
  the schema). Presentation-forward.

---

## Build sequence (recommended)

1. **Catalogue home**, wired to `GET /api/products` — prove live data renders.
2. **Product detail** with variant picker — prove a variant selection produces
   the right `product_variant_id`.
3. **Cart** (in-memory) — prove items accumulate and a checkout payload builds.
4. **Checkout** — wire `POST /api/orders`, integrate Razorpay's browser popup,
   complete the full loop end-to-end (browse → pay → webhook creates the order).
5. **Confirmation** + **corporate gifting** to round it out.

Each step: build → test against the real API → then refine styling. Don't
polish a screen before it works.

---

## Highest-priority non-code action

**Real product photography.** Every research signal points to the same thing:
this category sells on how the handmade object *looks* and the story it tells.
Warm, well-lit photos of the actual pieces will move conversion more than any
front-end work. Worth prioritising with the business owner (Tannya) in parallel
with the build — the design is a frame; the photos are the picture.

---

## Deferred / later

- Cart persistence across sessions (deliberate choice needed).
- User accounts / order history (out of scope for v1 per PRD).
- Festival-specific merchandising modes.
- The downstream fulfilment automation (Shiprocket, WhatsApp, packing lists) —
  the webhook's `// TODO`, a separate backend workstream.
