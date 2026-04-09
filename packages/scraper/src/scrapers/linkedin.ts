import { BrowserContext } from 'playwright';
import crypto from 'crypto';
import { Job } from '../types.js';

export async function scrapeLinkedIn(context: BrowserContext, searchUrls: string[]): Promise<Job[]> {
  const allJobs: Job[] = [];
  for (const url of searchUrls) {
    const jobs = await scrapeLinkedInSingle(context, url);
    allJobs.push(...jobs);
  }
  const seen = new Set<string>();
  return allJobs.filter((j) => (seen.has(j.id) ? false : (seen.add(j.id), true)));
}

async function scrapeLinkedInSingle(context: BrowserContext, searchUrl: string): Promise<Job[]> {
  const page = await context.newPage();
  const jobs: Job[] = [];

  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30_000 });

    // Scroll to load more listings
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(800);
    }

    const cards = await page.$$('.job-card-container, .jobs-search-results__list-item');

    for (const card of cards) {
      try {
        const title = (await card.$eval('.job-card-list__title, .job-card-container__link', (el) => el.textContent?.trim() ?? ''));
        const company = (await card.$eval('.job-card-container__company-name, .job-card-container__primary-description', (el) => el.textContent?.trim() ?? '').catch(() => ''));
        const location = (await card.$eval('.job-card-container__metadata-item, .job-card-container__metadata-wrapper', (el) => el.textContent?.trim() ?? '').catch(() => ''));
        const url = (await card.$eval('a.job-card-list__title, a.job-card-container__link', (el) => (el as HTMLAnchorElement).href).catch(() => ''));

        if (!title || !url) continue;

        // Click to get description
        await card.click();
        await page.waitForTimeout(1000);
        const description = await page.$eval('.job-view-layout, .jobs-description', (el) => el.textContent?.trim() ?? '').catch(() => '');
        const salary = await page.$eval('.compensation__salary', (el) => el.textContent?.trim()).catch(() => undefined);
        const postedAt = await page.$eval('.posted-time-ago__text, .tvm__text', (el) => el.textContent?.trim()).catch(() => undefined);

        jobs.push({
          id: crypto.createHash('md5').update(url).digest('hex'),
          title,
          company,
          location,
          salary,
          description,
          url,
          source: 'linkedin',
          postedAt,
          scrapedAt: new Date().toISOString(),
        });
      } catch {
        // Skip malformed card
      }
    }
  } finally {
    await page.close();
  }

  return jobs;
}
