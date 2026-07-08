# Market Research — Melody Home

Research on who buys handmade artisan brass and heritage craft in India, and
what it means for how the storefront should be designed. Compiled to inform the
frontend build. Sources are Indian home-décor / handicraft market reports and
D2C category analysis (2025).

> **Scope note.** This research exists to help the *business* sell — it informs
> product, merchandising, and UX decisions for real customers. It is **not** a
> portfolio artifact and has no bearing on the project's value as an engineering
> showcase. Those are two separate goals; this document serves the first.

---

## 1. The market is real, growing, and moving toward this brand

- India's **D2C online home-décor market** is projected at roughly **$5.4B in
  2025**, up from ~$2B in 2020 — a category in sustained growth, not a niche.
- The broader Indian home-décor market was ~$25.5B in 2024, projected to ~$40.8B
  by 2033 (~5.4% CAGR).
- The demand shift favours exactly what Melody Home sells: eco-conscious
  consumers now prefer **handmade over mass-produced**, and there is growing
  appreciation for **artisan-made, ethically-produced, story-driven** pieces.
- India is increasingly seen not just as a *source* of décor but a *destination*
  for décor **that tells a story** — heritage + meaning is the growth driver.

**Implication:** the brand's core positioning (UNESCO-recognised ठठेरा brass,
women artisans, made-to-order) is aligned with where the market is heading. The
story is not a nice-to-have; it is the differentiator the category rewards.

---

## 2. Two distinct buyer segments

### Segment A — Younger, urban, aesthetic-driven
- Minimalist / modern homes incorporating **ethnic accents** (brass pieces,
  hand-painted elements) — "simplicity + tradition" is the timeless look that
  appeals to younger buyers.
- Wants **fusion**: heritage craft that fits a contemporary apartment.
- Responds to: clean design, strong photography, a genuine story, restraint.
- **This is the primary audience for the current catalogue design direction.**

### Segment B — Gifting & festival buyers (the revenue lever)
- Major spending spikes around **Diwali, Navratri, and the festive season** —
  gift shopping, home makeovers, festival décor.
- Brass diyas, trays, and gifting items are festival staples.
- Connects directly to the **corporate gifting** segment already in the PRD.
- Behaves differently: buys in **bursts**, cares about **presentation**, is
  **less price-sensitive** (it's a gift), needs **reassurance** before buying.

**Implication:** steady daily sales are not where the money is — **gifting and
festival bursts are.** The site must flex for gifting (clear corporate-gifting
path, eventually festival merchandising), not just individual browsing.

---

## 3. Trust matters more here than in generic e-commerce

Handmade + made-to-order asks the customer to **wait** and to buy something they
**can't touch first**. That raises the trust bar. Conversion in this category
depends on:
- **Honest lead-time** stated as a feature ("made to order, allow 7 days"), not
  buried fine print.
- **Real provenance** — the UNESCO recognition, the place (Jandiala Guru), the
  craft name (ठठेरा), the women artisans. Stated *truthfully*, never as a
  guilt-lever or over-claimed endorsement.
- **Secure-checkout signals** — visible payment security (Razorpay), clear
  pricing, clear shipping, no dark patterns.
- **"Handmade" honesty** — no two pieces identical; that's a feature, say so.

---

## 4. Design implications (evidence-backed)

1. **Story-first homepage.** Lead with feeling and the artisan narrative, not a
   wall of information. The growth audience (Segment A) bounces from cluttered
   pages. Full detail lives on the product page for buyers already interested
   enough to click.

2. **One page, two reading depths.** Emotional + clean at the top (younger
   buyers); trust + detail as you scroll (gifting/older buyers who need
   reassurance before spending). Serves both segments without compromise.

3. **Photography is the single biggest lever.** This category sells on *how the
   handmade object looks* and the story it carries. Warm, well-lit shots of the
   actual pieces will do more for conversion than any front-end code. **Highest-
   priority real-world action for the business.**

4. **Build for the festival calendar.** The biggest revenue moments are
   festival-driven. The site needs a clear gifting path and the ability to flex
   for festival merchandising over time.

5. **Warm, premium, heritage register.** The brand palette
   (deep brown `#3E0E00`, gold `#C9913A`, cream `#F6EFE2`) matches the tone the
   category lives in — warm, earthy, gold. Confirmed as well-suited.

6. **Mobile-first, non-negotiable.** Most Indian D2C traffic is on phones. The
   build starts from the mobile layout, not desktop.

---

## 5. The honest bottom line

Design instincts and market data agree: **clean, story-first, warm, restrained,
with a strong trust layer for the gifting/festival buyers who drive revenue.**
Build the storefront for real customers (two segments), and let the engineering
underneath stand on its own as the technical achievement. One artifact should
not be asked to do both jobs.
