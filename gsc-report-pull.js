/**
 * GSC 28-day report pull — uses combined credentials file
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDS_PATH = path.join(__dirname, 'data/seo/gsc-credentials.json');
const SITE_URL = 'sc-domain:splashdeals.rs';

async function main() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const oAuth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret);
  oAuth2Client.setCredentials({
    refresh_token: creds.refresh_token,
    token: creds.token,
  });

  // Force token refresh to get a fresh one
  console.log('Refreshing token...');
  const { credentials: freshCreds } = await oAuth2Client.refreshAccessToken();
  // Merge back the scopes and other fields
  oAuth2Client.setCredentials(freshCreds);
  // Save refreshed token
  const tokenOut = {
    access_token: freshCreds.access_token,
    refresh_token: freshCreds.refresh_token || creds.refresh_token,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    token_type: 'Bearer',
    expiry_date: freshCreds.expiry_date,
  };
  fs.writeFileSync(path.join(__dirname, 'data/seo/gsc-token.json'), JSON.stringify(tokenOut, null, 2));
  console.log('Token refreshed and saved.');

  const now = new Date();
  const endStr = now.toISOString().split('T')[0];
  const startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const startStr = startDate.toISOString().split('T')[0];
  console.log(`\nPeriod: ${startStr} → ${endStr}\n`);

  const webmasters = google.webmasters({ version: 'v3', auth: oAuth2Client });
  const report = { period: `${startStr} → ${endStr}`, generated: now.toISOString() };

  // 1. Site verification
  const sitesRes = await webmasters.sites.list();
  const sites = (sitesRes.data.siteEntry || []).map(s => ({
    url: s.siteUrl, permission: s.permissionLevel
  }));
  console.log('Site verification:', JSON.stringify(sites, null, 2));

  // 2. Performance by query (top 50)
  const qRes = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: startStr, endDate: endStr, dimensions: ['query'], rowLimit: 50 },
  });
  const queries = (qRes.data.rows || []).map(r => ({
    query: r.keys[0], clicks: r.clicks, impressions: r.impressions,
    ctr: (r.ctr * 100).toFixed(2) + '%', position: r.position.toFixed(1)
  }));
  const totalClicks = queries.reduce((s, r) => s + r.clicks, 0);
  const totalImps = queries.reduce((s, r) => s + r.impressions, 0);

  // 3. Performance by page (top 25)
  const pRes = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: startStr, endDate: endStr, dimensions: ['page'], rowLimit: 25 },
  });
  const pages = (pRes.data.rows || []).map(r => ({
    page: r.keys[0], clicks: r.clicks, impressions: r.impressions,
    ctr: (r.ctr * 100).toFixed(2) + '%', position: r.position.toFixed(1)
  }));

  // 4. Daily trend
  const dRes = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: startStr, endDate: endStr, dimensions: ['date'], rowLimit: 28 },
  });
  const dailyTrend = (dRes.data.rows || []).map(r => ({
    date: r.keys[0], clicks: r.clicks, impressions: r.impressions,
    ctr: (r.ctr * 100).toFixed(2) + '%', position: r.position.toFixed(1)
  }));

  // 5. Sitemaps
  let sitemaps = [];
  try {
    const siRes = await webmasters.sitemaps.list({ siteUrl: SITE_URL });
    sitemaps = (siRes.data.sitemap || []).map(s => ({
      path: s.path, lastSubmitted: s.lastSubmitted,
      errors: s.errors || 0, warnings: s.warnings || 0,
      submitted: s.contents ? s.contents.reduce((t, c) => t + parseInt(c.submitted || 0), 0) : 0,
      indexed: s.contents ? s.contents.reduce((t, c) => t + parseInt(c.indexed || 0), 0) : 0,
    }));
  } catch (e) { sitemaps = { error: e.message }; }

  // 6. URL inspection — check performance for key pages
  const keyPages = [
    'https://splashdeals.rs/',
    'https://splashdeals.rs/facilities/petroland',
    'https://splashdeals.rs/facilities/novi-sad',
    'https://splashdeals.rs/facilities/aquapark-izvor',
  ];
  const urlInspections = [];
  for (const url of keyPages) {
    try {
      const uRes = await webmasters.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: startStr, endDate: endStr,
          dimensions: ['page'],
          dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: url }] }]
        },
      });
      if (uRes.data.rows && uRes.data.rows[0]) {
        const r = uRes.data.rows[0];
        urlInspections.push({ page: url, clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr * 100).toFixed(2) + '%', position: r.position.toFixed(1) });
      } else {
        urlInspections.push({ page: url, clicks: 0, impressions: 0, ctr: '0%', position: 'N/A' });
      }
    } catch (e) {
      urlInspections.push({ page: url, error: e.message });
    }
  }

  // Build report
  const avgPos = queries.length > 0 ? (queries.reduce((s, q) => s + parseFloat(q.position), 0) / queries.length).toFixed(1) : 'N/A';
  const avgCTR = totalClicks > 0 ? ((totalClicks / totalImps) * 100).toFixed(2) + '%' : '0%';
  
  report.siteVerification = sites;
  report.summary = { totalClicks, totalImpressions: totalImps, avgCTR, avgPosition: avgPos, totalQueries: queries.length, totalPages: pages.length };
  report.topQueries = queries.sort((a, b) => b.impressions - a.impressions);
  report.topPages = pages.sort((a, b) => b.impressions - a.impressions);
  report.dailyTrend = dailyTrend.sort((a, b) => a.date.localeCompare(b.date));
  report.sitemaps = sitemaps;
  report.urlInspections = urlInspections;

  // Check UUID zombie pages
  const uuidPages = pages.filter(p => {
    const url = p.page.toLowerCase();
    return url.includes('b71d0b6a') || url.includes('dd9e94c2') || url.includes('a05a8c06') || url.includes('/en/ticket/') || url.includes('/rs/ticket/');
  });
  report.zombiePages = uuidPages;

  // Save
  const filepath = path.join(__dirname, `data/seo/gsc-report-${endStr}.json`);
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved: ${filepath}`);

  // Print summary to stdout
  console.log('\n========================================');
  console.log('GSC REPORT — splashdeals.rs');
  console.log(`Period: ${startStr} → ${endStr}`);
  console.log('========================================');
  console.log(`\n📊 SITE VERIFICATION: ${sites.length} site(s)`);
  sites.forEach(s => console.log(`   ${s.url} — ${s.permission}`));
  console.log(`\n📈 SEARCH PERFORMANCE (28 days)`);
  console.log(`   Clicks:      ${totalClicks}`);
  console.log(`   Impressions: ${totalImps.toLocaleString()}`);
  console.log(`   Avg CTR:     ${avgCTR}`);
  console.log(`   Avg Pos:     ${avgPos}`);
  console.log(`   Queries:     ${queries.length}`);
  console.log(`   Pages:       ${pages.length}`);
  
  console.log(`\n🔍 TOP 10 QUERIES (by impressions)`);
  report.topQueries.slice(0, 10).forEach((q, i) => {
    console.log(`   ${String(i+1).padStart(2)}. "${q.query.padEnd(40)}" ${String(q.clicks).padStart(3)} cl  ${String(q.impressions).padStart(6)} im  ${q.ctr}  pos ${q.position}`);
  });

  console.log(`\n📄 TOP 10 PAGES (by impressions)`);
  report.topPages.slice(0, 10).forEach((p, i) => {
    const short = p.page.replace('https://splashdeals.rs', '');
    console.log(`   ${String(i+1).padStart(2)}. ${short.padEnd(50)} ${String(p.clicks).padStart(3)} cl  ${String(p.impressions).padStart(6)} im  pos ${p.position}`);
  });

  console.log(`\n📅 DAILY TREND (last 7 days)`);
  dailyTrend.slice(-7).forEach(d => {
    console.log(`   ${d.date}: ${String(d.clicks).padStart(2)} cl  ${String(d.impressions).padStart(5)} im  ${d.ctr}  pos ${d.position}`);
  });

  console.log(`\n🗺️ SITEMAP STATUS`);
  if (Array.isArray(sitemaps)) {
    sitemaps.forEach(s => console.log(`   ${s.path} — ${s.submitted} submitted, ${s.indexed} indexed, ${s.errors} errors`));
  } else {
    console.log(`   Error: ${sitemaps.error}`);
  }

  console.log(`\n🔍 URL INSPECTION (key pages)`);
  urlInspections.forEach(u => {
    const short = u.page.replace('https://splashdeals.rs', '') || '/';
    console.log(`   ${short.padEnd(40)} ${u.clicks} cl  ${u.impressions} im  ${u.ctr}  pos ${u.position}`);
  });

  if (uuidPages.length > 0) {
    console.log(`\n⚠️ ZOMBIE UUID PAGES: ${uuidPages.length}`);
    uuidPages.forEach(p => console.log(`   ${p.page}`));
  } else {
    console.log(`\n✅ No zombie UUID pages detected`);
  }
}

main().catch(e => {
  console.error('FATAL ERROR:', e.message);
  console.error(e.stack);
  process.exit(1);
});
