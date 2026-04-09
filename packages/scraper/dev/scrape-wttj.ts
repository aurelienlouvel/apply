/**
 * Test WTTJ only — run with: pnpm scrape:wttj
 */
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { COOKIES_DIR, OUTPUT_DIR, SEARCH_URLS } from '../src/config.js';
import { scrapeWTTJ } from '../src/scrapers/welcometothejungle.js';

const cookies = JSON.parse(await fs.readFile(path.join(COOKIES_DIR, 'wttj.json'), 'utf-8'));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.addCookies(cookies);

console.log(`\n[WTTJ] Scraping ${SEARCH_URLS.wttj.length} recherches...`);
const jobs = await scrapeWTTJ(context, SEARCH_URLS.wttj);
await browser.close();

console.log(`\n✓ ${jobs.length} offres trouvées\n`);

// Pretty print first 3 jobs
jobs.slice(0, 3).forEach((j, i) => {
  console.log(`--- [${i + 1}] ${j.title}`);
  console.log(`    Société  : ${j.company}`);
  console.log(`    Contrat  : ${j.contract ?? '?'}`);
  console.log(`    Lieu     : ${j.location}`);
  console.log(`    Salaire  : ${j.salary ?? '?'}`);
  console.log(`    Postée   : ${j.postedAt ?? '?'}`);
  console.log(`    URL      : ${j.url}`);
  console.log(`    Desc     : ${j.description.slice(0, 120)}...`);
  console.log();
});

// Save to output
await fs.mkdir(OUTPUT_DIR, { recursive: true });
const out = { scrapedAt: new Date().toISOString(), total: jobs.length, jobs };
await fs.writeFile(path.join(OUTPUT_DIR, 'jobs-wttj.json'), JSON.stringify(out, null, 2));
console.log(`Saved to ${OUTPUT_DIR}/jobs-wttj.json`);
