# Graph Report - web  (2026-05-04)

## Corpus Check
- 111 files · ~755,521 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 246 nodes · 288 edges · 15 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ebf8b98`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `POST()` - 7 edges
3. `Badge()` - 7 edges
4. `attemptFulfillment()` - 7 edges
5. `sendWelcomeEmail()` - 7 edges
6. `useCart()` - 7 edges
7. `markTransactionPaid()` - 6 edges
8. `sendAppPurchaseWelcomeEmail()` - 6 edges
9. `POST()` - 5 edges
10. `POST()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → lib/supabase-middleware.ts
- `Home()` --calls--> `getFeaturedHomepageTestimonials()`  [INFERRED]
  app/page.tsx → lib/testimonials.ts
- `POST()` --calls--> `sendAppPurchaseWelcomeEmail()`  [INFERRED]
  app/api/internal/app-purchase-email/route.ts → lib/mail.ts
- `POST()` --calls--> `markTransactionPaid()`  [INFERRED]
  app/api/checkout/webhook/route.ts → lib/commerce.ts
- `POST()` --calls--> `markTransactionFailed()`  [INFERRED]
  app/api/checkout/webhook/route.ts → lib/commerce.ts

## Communities (50 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (10): handleAvatarUpload(), cn(), Accordion(), AccordionItem(), AccordionTrigger(), Alert(), Badge(), CardDescription() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (15): Home(), getErrorMessage(), POST(), attemptFulfillment(), canonicalizeProgramSlug(), canonicalizeTransactionItems(), createTransaction(), formatUnknownError() (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (16): getDedupeKey(), isRecoverablePendingDelivery(), markDeliveryStatus(), POST(), unauthorized(), AppPurchaseWelcomeEmail(), formatStoreLabel(), isValidEmail() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (5): handleFinalize(), useCart(), openAuthModal(), handleSecondaryClick(), Sheet()

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (6): markTransactionFailed(), markTransactionPaid(), getErrorMessage(), POST(), getErrorMessage(), POST()

### Community 6 - "Community 6"
Cohesion: 0.3
Nodes (6): canonicalizeWebsiteProgramId(), dedupeById(), formatPaymentDescription(), formatProgramCountLabel(), nextCartItems(), normalizeCartItems()

### Community 7 - "Community 7"
Cohesion: 0.2
Nodes (4): PageTransition(), SmoothScrollProvider(), useLenis(), CartProvider()

### Community 8 - "Community 8"
Cohesion: 0.38
Nodes (4): GET(), isAuthorizedRequest(), countTransactions(), getFulfillmentHealthSnapshot()

### Community 9 - "Community 9"
Cohesion: 0.43
Nodes (5): formatReceiptDate(), WelcomeReceiptEmail(), sendWelcomeEmail(), GET(), getErrorMessage()

### Community 10 - "Community 10"
Cohesion: 0.53
Nodes (4): clearSupabaseCookies(), isRefreshTokenNotFoundError(), updateSession(), proxy()

### Community 12 - "Community 12"
Cohesion: 0.7
Nodes (4): ensureChrome(), main(), printHtmlToPdf(), renderReceiptHtml()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 0` to `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 11`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `useCart()` connect `Community 3` to `Community 0`, `Community 6`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `sendWelcomeEmail()` connect `Community 9` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `attemptFulfillment()` (e.g. with `sendWelcomeEmail()` and `sendOpsAlertEmail()`) actually correct?**
  _`attemptFulfillment()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `sendWelcomeEmail()` (e.g. with `GET()` and `attemptFulfillment()`) actually correct?**
  _`sendWelcomeEmail()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._