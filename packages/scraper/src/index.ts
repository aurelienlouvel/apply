import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { COOKIES_DIR, OUTPUT_DIR, SEARCH_URLS } from './config.js';
import { Job, ScrapedOutput, Source } from './types.js';
import { scrapeLinkedIn } from './scrapers/linkedin.js';
import { scrapeWTTJ } from './scrapers/welcometothejungle.js';
import { scrapeHelloWork } from './scrapers/hellowork.js';
import { scrapeJobsThatMakeSense } from './scrapers/jobsthatmakesense.js';

async function loadCookies(source: Source) {
  const cookiePath = path.join(COOKIES_DIR, `${source}.json`);
  try {
    const raw = await fs.readFile(cookiePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    console.warn(`  ⚠ No cookies found for ${source} — run \`pnpm auth\` first. Skipping.`);
    return null;
  }
}

async function runScraper(
  source: Source,
  label: string,
  scraper: (ctx: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>['newContext']>>, urls: string[]) => Promise<Job[]>
): Promise<Job[]> {
  const cookies = await loadCookies(source);
  if (!cookies) return [];

  const urls = SEARCH_URLS[source];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies(cookies);

  console.log(`  → Scraping ${label} (${urls.length} recherche${urls.length > 1 ? 's' : ''})...`);
  let jobs: Job[] = [];
  try {
    jobs = await scraper(context, urls);
    console.log(`  ✓ ${label}: ${jobs.length} offres`);
  } catch (err) {
    console.error(`  ✗ ${label} failed:`, (err as Error).message);
  } finally {
    await browser.close();
  }

  return jobs;
}

async function main() {
  console.log('\nApply — starting scrape\n');

  const results = await Promise.allSettled([
    runScraper('linkedin', 'LinkedIn', scrapeLinkedIn),
    runScraper('wttj', 'Welcome to the Jungle', scrapeWTTJ),
    runScraper('hellowork', 'HelloWork', scrapeHelloWork),
    runScraper('jobsthatmakesense', 'Jobs that Make Sense', scrapeJobsThatMakeSense),
  ]);

  const jobs: Job[] = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  // Deduplicate by id
  const seen = new Set<string>();
  const unique = jobs.filter((j) => (seen.has(j.id) ? false : (seen.add(j.id), true)));

  const output: ScrapedOutput = {
    scrapedAt: new Date().toISOString(),
    total: unique.length,
    jobs: unique,
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const outputPath = path.join(OUTPUT_DIR, 'jobs.json');
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2));

  console.log(`\nDone! ${unique.length} jobs written to ${outputPath}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
