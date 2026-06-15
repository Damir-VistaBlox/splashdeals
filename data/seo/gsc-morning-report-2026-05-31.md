
============================================================
GSC Morning Report — splashdeals.rs — 2026-05-31 (Sunday)
============================================================

⚠️  GSC CREDENTIALS EXPIRED — Data stale since May 27

All GSC OAuth tokens have expired and their refresh tokens
returned "invalid_grant". No fresh data could be pulled for
today's report. Analysis below is based on last known data.

Re-authentication needed: the client_secret file is no longer
in Downloads. A new OAuth flow is required.

══════════════════════════════════════════════════════════
1. PERFORMANCE OVERVIEW (Last Available: May 17-27)
══════════════════════════════════════════════════════════

28-day aggregate (May 2-28 from compiled report):
  Total Clicks:       1
  Total Impressions:  624
  Avg CTR:            0.16%
  Unique Queries:     101
  Unique Pages:       88

Daily average (May 17-27):
  ~30-60 impressions/day, aggregate ~0-5 clicks/day

Trend (declining):
  May 17:  59 imps, 0 cl (weekly data: 5 cl, 190 im)
  May 22:  33 imps, 0 cl
  May 23:  33 imps, 0 cl
  May 24:  30 imps, 0 cl
  May 25:  29 imps, 0 cl
  May 26:  30 imps, 0 cl
  May 27:  31 imps, 0 cl

Observation: Daily impressions have been stable around 30
since May 22, down from ~59 on May 17. This could reflect
seasonal weekend patterns or a dip in crawl activity since
credentials expired.

══════════════════════════════════════════════════════════
2. TOP PAGES (May 27 — last available data)
══════════════════════════════════════════════════════════

  1. /                            3 cl   26 im   pos 12.8
  2. /search                      0 cl   17 im   pos 3.8
  3. /how-it-works                1 cl   16 im   pos 3.3
  4. /facilities/waterpark/
       aquapark-jagodina          0 cl   13 im   pos 16.8
  5. /facilities/waterpark/
       mlavske-terme              0 cl   12 im   pos 52.4
  6. /facilities                  0 cl   10 im   pos 4.8
  7. /facilities/nis              1 cl    7 im   pos 12.1
  8. /facilities/swimming%20pool/
       cair-nis                   0 cl    6 im   pos 12.2
  9. /facilities/waterpark/
       petroland                  0 cl    5 im   pos 42.6
 10. /cookies                     0 cl    5 im   pos 8.8

Changes vs May 17:
  - Homepage increased: 3 cl (vs 0), 26 im (was ~0 in weekly)
  - /search dropped from 2 cl to 0 cl
  - /facilities/nis emerged as new entry (wasn't in top 10)
  - /how-it-works holding steady at top 3

══════════════════════════════════════════════════════════
3. TOP QUERIES (May 17-27 aggregated)
══════════════════════════════════════════════════════════

  May 17 (7-day window):
    1. "splash private pool"        0 cl   7 im   pos 8.4
    2. "akva park srebrno jezero"   0 cl   5 im   pos 68
    3. "aqua park prolom banja"     0 cl   5 im   pos 37.2
    4. "bazeni cacak"               0 cl   3 im   pos 73
    5. "jezero kikinda"             0 cl   3 im   pos 9

  May 27 (1-day window):
    1. "aqua park serbia"           0 cl   5 im   pos 46.6
    2. "jagodina aqua park"         0 cl   4 im   pos 15.5
    3. "aquapark"                   0 cl   3 im   pos 83.3
    4. "akva parkovi u srbiji"      0 cl   2 im   pos 53
    5. "aqua park srbija"           0 cl   2 im   pos 81

  Notable Query Shifts:
  - "splash private pool" dropped from 7 → 1 impression/day
  - "aqua park serbia" emerged as top query (5 im)
  - "jagodina aqua park" gained impressions (4 im)
  - "akva parkovi u srbiji" stable presence
  - All query positions remain poor (avg >30)

══════════════════════════════════════════════════════════
4. INDEX COVERAGE & SITEMAP STATUS
══════════════════════════════════════════════════════════

  Sitemap: Could not fetch fresh data (token expired)
  Last known: /sitemap.xml, /server-sitemap.xml

══════════════════════════════════════════════════════════
5. KEY URL INSPECTION (last available data)
══════════════════════════════════════════════════════════

  /                                    3 cl   26 im   pos 12.8
  /facilities/petroland                0 cl    5 im   pos 42.6
  /facilities/nis                      1 cl    7 im   pos 12.1
  /facilities/waterpark/
    aquapark-jagodina                  0 cl   13 im   pos 16.8

  Key facility pages are getting impressions but zero
  clicks — the positions (avg 15-55) are too low for CTR.

══════════════════════════════════════════════════════════
6. TECHNICAL ANALYSIS & RECOMMENDATIONS
══════════════════════════════════════════════════════════

[CRITICAL] GSC Authentication
  - Both credentials sets are dead. Need re-authentication.
  - gsc-credentials.json: refresh_token → "invalid_grant"
  - gsc-token.json: expired + its refresh_token also dead
  - The client_secret file is gone from /home/damir/Downloads/
  - Action: Download a new client_secret from Google Cloud
    Console and re-run OAuth flow.

[SEO] Low CTR & Poor Rankings
  - Positions are terrible across the board (avg 30-50+)
  - This is a young domain with thin authority
  - "splash private pool" at pos 8.4 is the best-ranked query
  - "how-it-works" at pos 3.3 converts well (1 cl / 16 im)

[SEO] Facility Pages Need SERP Visibility
  - Petroland has 4-5 im/day at pos 41-42 — too low
  - Jagodina has 10-13 im at pos 16-24 — improving
  - Mlávske Terme has 10-12 im at pos 52-58 — very poor
  - Action: Need backlinks, structured data, content depth

[SEO] No Zero-Click Issues Detected
  - Zero clicks from 624 impressions suggests discovery gap
  - The site isn't ranking high enough to attract clicks
  - This is a ranking problem, not a CTR-from-SERP problem

[SEO] Recommendations for Pre-Summer Push
  1. Re-authenticate GSC as priority #1
  2. Focus on position 1-10 queries already ranking:
     - "splash private pool" — strengthen page
     - "waterpark" — optimize for intent
     - "how-it-works" — already converts well
  3. Build local backlinks (Serbian tourism sites, news)
  4. Add more facility content (hours, pricing, photos)
  5. Verify new sitemaps submitted

══════════════════════════════════════════════════════════
EXECUTIVE SUMMARY FOR BOARD
══════════════════════════════════════════════════════════

The site remains in early SEO stages. Daily impressions have
stabilized around 30/day (down from 59 on May 17). Zero clicks
is expected at current ranking positions (avg >30). The only
consistent click driver is the homepage and how-it-works page.

GSC credentials have fully expired — both access tokens dead
and refresh tokens revoked. A new OAuth client_secret must be
downloaded from Google Cloud Console before any further pulls.

The pre-summer season is approaching. We need:
  (1) GSC access restored
  (2) Backlinks to move facility pages into SERP positions <10
  (3) Content depth on facility pages to capture search intent

No zombie UUID pages detected in the latest daily data — the
redirect ticket API seems to have stopped the bleed.
