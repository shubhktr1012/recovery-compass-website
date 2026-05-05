# Graph Report - web  (2026-05-05)

## Corpus Check
- 113 files · ~756,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 262 nodes · 320 edges · 16 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f07c8d90`
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
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `fetchContentful()` - 9 edges
3. `POST()` - 7 edges
4. `Badge()` - 7 edges
5. `attemptFulfillment()` - 7 edges
6. `sendWelcomeEmail()` - 7 edges
7. `useCart()` - 7 edges
8. `Home()` - 6 edges
9. `markTransactionPaid()` - 6 edges
10. `sendAppPurchaseWelcomeEmail()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → lib/supabase-middleware.ts
- `RootLayout()` --calls--> `getPrograms()`  [INFERRED]
  app/layout.tsx → lib/programs.ts
- `Home()` --calls--> `getFeaturedHomepageTestimonials()`  [INFERRED]
  app/page.tsx → lib/testimonials.ts
- `Home()` --calls--> `getHeroSection()`  [INFERRED]
  app/page.tsx → lib/page-content.ts
- `Home()` --calls--> `getFaqItems()`  [INFERRED]
  app/page.tsx → lib/page-content.ts

## Communities (51 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (10): handleAvatarUpload(), SmoothScrollProvider(), useLenis(), cn(), Alert(), CardDescription(), CardFooter(), Dialog() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (7): handleFinalize(), useCart(), ProgramProvider(), usePrograms(), openAuthModal(), handleSecondaryClick(), Sheet()

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (16): getDedupeKey(), isRecoverablePendingDelivery(), markDeliveryStatus(), POST(), unauthorized(), AppPurchaseWelcomeEmail(), formatStoreLabel(), isValidEmail() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (12): GET(), isAuthorizedRequest(), attemptFulfillment(), canonicalizeProgramSlug(), canonicalizeTransactionItems(), countTransactions(), formatUnknownError(), getFulfillmentHealthSnapshot() (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (12): RootLayout(), Home(), PageTransition(), CartProvider(), fetchContentful(), getCtaSection(), getFaqItems(), getHeroSection() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (4): Accordion(), AccordionItem(), AccordionTrigger(), Badge()

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (6): markTransactionFailed(), markTransactionPaid(), getErrorMessage(), POST(), getErrorMessage(), POST()

### Community 7 - "Community 7"
Cohesion: 0.3
Nodes (6): canonicalizeWebsiteProgramId(), dedupeById(), formatPaymentDescription(), formatProgramCountLabel(), nextCartItems(), normalizeCartItems()

### Community 8 - "Community 8"
Cohesion: 0.24
Nodes (5): getErrorMessage(), POST(), createTransaction(), createSupabaseServerClient(), formatTestimonialAttribution()

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

- **Why does `getFeaturedHomepageTestimonials()` connect `Community 4` to `Community 8`?**
  _High betweenness centrality (0.244) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `fetchContentful()` (e.g. with `getHeroSection()` and `getFaqItems()`) actually correct?**
  _`fetchContentful()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `attemptFulfillment()` (e.g. with `sendWelcomeEmail()` and `sendOpsAlertEmail()`) actually correct?**
  _`attemptFulfillment()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._