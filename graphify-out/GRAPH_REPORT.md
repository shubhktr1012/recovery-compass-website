# Graph Report - web  (2026-06-15)

## Corpus Check
- 241 files · ~981,576 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 783 nodes · 1424 edges · 32 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 206 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c154de61`
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
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 35 edges
2. `requireAdminApi()` - 28 edges
3. `adminApiError()` - 27 edges
4. `getAdminDateRange()` - 26 edges
5. `POST()` - 18 edges
6. `renderDietPlanHtml()` - 18 edges
7. `NavbarSticky()` - 17 edges
8. `getAdminAccess()` - 17 edges
9. `getSupabaseAdmin()` - 15 edges
10. `createSupabaseServerClient()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `getBrowserRedirectTarget()` --calls--> `detectDownloadPlatform()`  [INFERRED]
  app/app/page.tsx → lib/constants.ts
- `submitAnswers()` --calls--> `openAuthModal()`  [INFERRED]
  app/program-finder/page.tsx → lib/context/user-context.tsx
- `submitAnswers()` --calls--> `toCartItem()`  [INFERRED]
  app/program-finder/page.tsx → lib/public-programs.ts
- `AdminSignInPage()` --calls--> `getAdminAccess()`  [INFERRED]
  app/admin/sign-in/page.tsx → lib/admin/auth.ts
- `AdminDashboardLayout()` --calls--> `getAdminAccess()`  [INFERRED]
  app/admin/(dashboard)/layout.tsx → lib/admin/auth.ts

## Communities (79 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (65): GET(), adminApiError(), requireAdminApi(), recordAdminAuditLog(), canGrantPrograms(), canManageDietPlans(), addToTrend(), createTrend() (+57 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (35): getErrorMessage(), haveSameMembers(), isValidEmail(), normalizeProgramOrder(), POST(), uniqueValues(), GET(), isAuthorizedRequest() (+27 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (31): AccessDenied(), getAdminAccess(), getAdminApiAccess(), getRequestHost(), normalizeAdminEmail(), parseAdminEmails(), resolveAdminUser(), resolveAdminUserFromDb() (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): getErrorMessage(), hashClaimToken(), isValidEmail(), isValidUuid(), PUT(), normalizeProgramValues(), normalizeQuestionnaireProgramValues(), getSupabaseAdmin() (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (31): buildDietPlanRepairPrompt(), callGeminiModel(), extractJsonObject(), generateDietPlanJsonText(), generateDietPlanWithAnthropic(), generateDietPlanWithGemini(), generateValidatedDietPlanJson(), getErrorMessage() (+23 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (26): getDedupeKey(), isRecoverablePendingDelivery(), markDeliveryStatus(), POST(), unauthorized(), AppPurchaseWelcomeEmail(), formatStoreLabel(), formatReceiptDate() (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (24): POST(), assertDetoxLeadCanBeCompleted(), claimDetoxLeadForCompletion(), completeDetoxLead(), consumeDetoxRateLimit(), createDetoxLead(), deliverDetoxProgram(), getDetoxLead() (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (24): restoreDraft(), getGuidedIssueLabel(), getGuidedIssueOptions(), getGuidedJourney(), getJourneyConfig(), getRecommendedProgramForJourney(), getSecondarySymptomOptions(), getSelfSelectOptions() (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (15): getErrorMessage(), handlePayment(), loadRazorpayScript(), serializeRazorpayFailure(), isDietPlanCartId(), canonicalizeWebsiteProgramId(), dedupeById(), formatPaymentDescription() (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.1
Nodes (4): NavbarSticky(), PrivacyContent(), FooterVariantTwo(), Separator()

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (14): RootLayout(), Home(), PageTransition(), CartProvider(), fetchContentful(), getHomepageCommunityData(), getCtaSection(), getFaqItems() (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (22): esc(), getPublicAssetDataUri(), renderAbout(), renderBedtimeSection(), renderBrandFontCss(), renderClientStrip(), renderDietPlanHtml(), renderDiningOut() (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (14): getAdminRouteBaseUrl(), isValidAdminEmail(), isValidUuid(), normalizeAdminEmail(), normalizeAdminText(), parseAmountInPaise(), parseDietPlanGenerationPayload(), parseHttpsUrl() (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (6): clearLocalDraft(), getErrorMessage(), handlePayment(), loadPrefill(), loadRazorpayScript(), normalizeQuestionnaireDraft()

### Community 15 - "Community 15"
Cohesion: 0.31
Nodes (11): cleanGeneratedHtml(), esc(), getPublicAssetDataUri(), getQuestionnaireStringArray(), getSelectedHealthConditions(), renderBrandFontCss(), renderDetoxHtml(), renderFontFace() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.26
Nodes (6): getErrorMessage(), isRecord(), isStringRecord(), parseAnswers(), POST(), isProgramFinderEnabled()

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (8): handleQuickAdd(), ProgramProvider(), usePrograms(), formatProgramPrice(), getProgramCardStructureFacts(), getProgramFacts(), toCartItem(), Sheet()

### Community 20 - "Community 20"
Cohesion: 0.24
Nodes (6): handleNext(), isStringArray(), stepIsComplete(), submitAnswers(), toggleMultiValue(), updateQuestionValue()

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (4): handleAvatarUpload(), SmoothScrollProvider(), useLenis(), Alert()

### Community 22 - "Community 22"
Cohesion: 0.31
Nodes (4): AnnouncementBanner(), getDownloadHref(), isExternalDownloadPlatform(), useDownloadPlatform()

### Community 24 - "Community 24"
Cohesion: 0.32
Nodes (3): getBrowserRedirectTarget(), detectDownloadPlatform(), getClientSnapshot()

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (3): handleFinalize(), openAuthModal(), handleSecondaryClick()

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (3): CardDescription(), CardFooter(), Label()

### Community 30 - "Community 30"
Cohesion: 0.6
Nodes (3): Accordion(), AccordionItem(), AccordionTrigger()

### Community 32 - "Community 32"
Cohesion: 0.7
Nodes (4): ensureChrome(), main(), printHtmlToPdf(), renderReceiptHtml()

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createSupabaseServerClient()` connect `Community 3` to `Community 1`, `Community 2`, `Community 6`, `Community 10`, `Community 16`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 17` to `Community 0`, `Community 8`, `Community 9`, `Community 13`, `Community 14`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 25`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 35`, `Community 36`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 4` to `Community 0`, `Community 3`, `Community 5`, `Community 11`, `Community 12`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `requireAdminApi()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`requireAdminApi()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `adminApiError()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`adminApiError()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `getAdminDateRange()` (e.g. with `AdminPurchasesPage()` and `AdminDietPlansPage()`) actually correct?**
  _`getAdminDateRange()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `POST()` (e.g. with `requireAdminApi()` and `canManageDietPlans()`) actually correct?**
  _`POST()` has 11 INFERRED edges - model-reasoned connections that need verification._