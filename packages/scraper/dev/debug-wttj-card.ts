import { chromium } from 'playwright';
import fs from 'fs/promises';
import { COOKIES_DIR, SEARCH_URLS } from '../src/config.js';
import path from 'path';

const cookies = JSON.parse(await fs.readFile(path.join(COOKIES_DIR, 'wttj.json'), 'utf-8'));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.addCookies(cookies);
const page = await context.newPage();

await page.goto(SEARCH_URLS.wttj, { waitUntil: 'networkidle', timeout: 30_000 });
await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(1500);

// Dump HTML complet de la première carte
const cardHTML = await page.$eval('[data-testid="search-results-list-item-wrapper"]', (el) => el.innerHTML);
console.log('=== CARD HTML (1ère carte) ===');
console.log(cardHTML.slice(0, 3000));

// Essaie d'extraire titre, société, lieu, url directement
const data = await page.$$eval('[data-testid="search-results-list-item-wrapper"]', (cards) =>
  cards.slice(0, 3).map((card) => ({
    allText: card.textContent?.trim().slice(0, 200),
    allLinks: [...card.querySelectorAll('a')].map((a) => ({ text: a.textContent?.trim(), href: a.getAttribute('href') })),
    headings: {
      h3: [...card.querySelectorAll('h3')].map((h) => h.textContent?.trim()),
      h4: [...card.querySelectorAll('h4')].map((h) => h.textContent?.trim()),
      h5: [...card.querySelectorAll('h5')].map((h) => h.textContent?.trim()),
    },
    dataTestIds: [...card.querySelectorAll('[data-testid]')].map((el) => ({
      id: el.getAttribute('data-testid'),
      text: el.textContent?.trim().slice(0, 80),
    })),
  }))
);
console.log('\n=== DONNÉES EXTRAITES (3 premières cartes) ===');
console.log(JSON.stringify(data, null, 2));

await browser.close();
