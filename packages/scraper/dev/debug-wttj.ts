/**
 * Debug script for WTTJ — run with: pnpm debug:wttj
 * Steps through the page step by step to find working selectors.
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { COOKIES_DIR, SEARCH_URLS } from '../src/config.js';

async function main() {
  const cookiePath = path.join(COOKIES_DIR, 'wttj.json');
  const cookies = JSON.parse(await fs.readFile(cookiePath, 'utf-8'));

  const browser = await chromium.launch({ headless: false }); // headed pour voir ce qui se passe
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await context.addCookies(cookies);
  const page = await context.newPage();

  console.log('\n[1] Navigation vers WTTJ...');
  await page.goto(SEARCH_URLS.wttj, { waitUntil: 'networkidle', timeout: 30_000 });
  console.log('    URL actuelle:', page.url());

  // Screenshot de l'état initial
  await fs.mkdir('output', { recursive: true });
  await page.screenshot({ path: 'output/wttj-step1-initial.png', fullPage: false });
  console.log('    Screenshot: output/wttj-step1-initial.png');

  // Scroll progressif
  console.log('\n[2] Scroll pour charger les offres...');
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: 'output/wttj-step2-scrolled.png', fullPage: false });

  // Dump des sélecteurs courants sur la page
  console.log('\n[3] Analyse de la structure HTML...');
  const structure = await page.evaluate(() => {
    const selectors = [
      '[data-testid="search-results-list-item-wrapper"]',
      'article[data-testid]',
      '[data-testid*="job"]',
      '[data-testid*="offer"]',
      'li[class*="job"]',
      'li[class*="offer"]',
      'article',
      '[class*="JobCard"]',
      '[class*="job-card"]',
      '[class*="offer"]',
    ];
    return selectors.map((sel) => ({
      selector: sel,
      count: document.querySelectorAll(sel).length,
      firstHTML: document.querySelector(sel)?.outerHTML?.slice(0, 200) ?? null,
    }));
  });

  console.log('\n  Résultats des sélecteurs:');
  for (const { selector, count, firstHTML } of structure) {
    console.log(`  ${count > 0 ? '✓' : '✗'} "${selector}" → ${count} éléments`);
    if (count > 0 && firstHTML) {
      console.log(`    Aperçu: ${firstHTML}\n`);
    }
  }

  // Dump du titre et des data-testid uniques présents sur la page
  console.log('\n[4] Tous les data-testid présents sur la page:');
  const testids = await page.evaluate(() => {
    const els = document.querySelectorAll('[data-testid]');
    const ids = new Set<string>();
    els.forEach((el) => ids.add(el.getAttribute('data-testid') ?? ''));
    return [...ids].sort();
  });
  console.log(' ', testids.join('\n  '));

  // Si on trouve des cartes, on dumpe la première
  console.log('\n[5] Recherche des vraies cartes d\'offres...');
  const firstCard = await page.evaluate(() => {
    // Cherche n'importe quel élément répété qui ressemble à une carte
    const candidates = ['li', 'article', '[role="listitem"]', 'div[class]'];
    for (const sel of candidates) {
      const els = document.querySelectorAll(sel);
      if (els.length > 3 && els.length < 100) {
        return {
          selector: sel,
          count: els.length,
          sample: els[0]?.outerHTML?.slice(0, 500),
        };
      }
    }
    return null;
  });

  if (firstCard) {
    console.log(`  Candidat le plus probable: "${firstCard.selector}" (${firstCard.count} éléments)`);
    console.log('  Sample HTML:', firstCard.sample);
  }

  await page.screenshot({ path: 'output/wttj-step3-final.png', fullPage: false });
  console.log('\n  Screenshot final: output/wttj-step3-final.png');
  console.log('\n  Le navigateur reste ouvert 15s pour inspection manuelle...');
  await page.waitForTimeout(15_000);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
