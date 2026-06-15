/* eslint-disable */
/**
 * 🌊 GSC Admin: Sitemap Resubmit + URL Indexing Request
 * Run: node gsc-admin.js
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, 'data/seo/gsc-token.json');
const CLIENT_SECRET_PATH = '/home/damir/Downloads/client_secret_2_844087830982-qg1enr1fmbj7q66j4s9jcrld6kdus57m.apps.googleusercontent.com.json';
const SITE_URL = 'sc-domain:splashdeals.rs';
const SITEMAP_URL = 'https://www.splashdeals.rs/sitemap.xml';

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters',           // sitemap submit + read
  'https://www.googleapis.com/auth/indexing',             // URL notification
];

async function getAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0] || 'urn:ietf:wg:oauth:2.0:oob');

  // Check existing token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    const hasAllScopes = SCOPES.every(s => (token.scope || '').includes(s));
    if (hasAllScopes && token.refresh_token) {
      oAuth2Client.setCredentials(token);
      try {
        await oAuth2Client.getAccessToken();
        return oAuth2Client;
      } catch { /* token expired, fall through to re-auth */ }
    }
  }

  // Need new auth
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  console.log('\n🔑 RE-AUTH REQUIRED (broader scopes needed)');
  console.log('Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\nThen paste the authorization code here:');

  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('> ', answer => { rl.close(); resolve(answer.trim()); }));

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ Token saved with write scopes.\n');
  return oAuth2Client;
}

async function resubmitSitemap(auth) {
  const webmasters = google.webmasters({ version: 'v3', auth });
  console.log('📋 RESUBMITTING SITEMAP...');
  try {
    await webmasters.sitemaps.submit({ siteUrl: SITE_URL, feedpath: SITEMAP_URL });
    console.log(`✅ Sitemap resubmitted: ${SITEMAP_URL}`);
  } catch (e) {
    if (e.message?.includes('already been submitted')) {
      console.log('⚠️  Sitemap already submitted recently — skipping.');
    } else {
      console.log(`❌ Sitemap submit failed: ${e.message}`);
    }
  }

  // List sitemaps to verify
  const list = await webmasters.sitemaps.list({ siteUrl: SITE_URL });
  console.log('\n📄 Registered sitemaps:');
  (list.data.sitemap || []).forEach(s => {
    console.log(`  ${s.path} | last downloaded: ${s.lastDownloaded || 'never'} | errors: ${s.errors || 0} | warnings: ${s.warnings || 0}`);
  });
}

async function requestIndexing(auth, urls) {
  const indexing = google.indexing({ version: 'v3', auth });
  console.log(`\n🔗 REQUESTING INDEXING FOR ${urls.length} URLs...`);

  for (const url of urls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      const notified = res.data.urlNotificationMetadata?.latestUpdate?.url;
      const type = res.data.urlNotificationMetadata?.latestUpdate?.type;
      console.log(`  ✅ ${url} → ${type || 'queued'}`);
    } catch (e) {
      const msg = e.message || '';
      if (msg.includes('403') || msg.includes('permission')) {
        console.log(`  ❌ ${url} → Permission denied (Indexing API may need verification in GSC first)`);
      } else if (msg.includes('429')) {
        console.log(`  ⏳ ${url} → Rate limited — waiting 5s...`);
        await new Promise(r => setTimeout(r, 5000));
      } else {
        console.log(`  ❌ ${url} → ${msg.substring(0, 80)}`);
      }
    }
    await new Promise(r => setTimeout(r, 1000)); // 1s between requests
  }
}

async function main() {
  console.log('🌊 GSC ADMIN — Sitemap Resubmit + Indexing Request');
  console.log('=' .repeat(55));

  const auth = await getAuthClient();

  // 1. Resubmit sitemap
  await resubmitSitemap(auth);

  // 2. Request indexing for top facility pages
  const facilityPages = [
    'https://www.splashdeals.rs/petroland',
    'https://www.splashdeals.rs/aquapark-izvor',
    'https://www.splashdeals.rs/aquapark-jagodina',
    'https://www.splashdeals.rs/hollywoodland-belgrade',
    'https://www.splashdeals.rs/mlavske-terme',
    'https://www.splashdeals.rs/',
    'https://www.splashdeals.rs/akva-parkovi',
    'https://www.splashdeals.rs/bazeni',
    'https://www.splashdeals.rs/wellness-i-spa',
  ];

  await requestIndexing(auth, facilityPages);

  console.log('\n✅ DONE.');
  console.log('Google will reprocess the sitemap within hours.');
  console.log('Indexing requests are typically processed within 1-7 days.');
}

main().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
