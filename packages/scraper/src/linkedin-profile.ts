/**
 * Fetches the authenticated user's LinkedIn profile using saved cookies.
 * Writes the result to output/linkedin-profile.json.
 *
 * Run with: pnpm linkedin:profile
 * Or triggered by the web app via /api/linkedin/profile
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';
import { COOKIES_DIR, OUTPUT_DIR } from './config.js';

export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  avatarUrl: string;
  avatarLocalPath: string;
  linkedinUrl: string;
  fetchedAt: string;
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  const cookiePath = path.join(COOKIES_DIR, 'linkedin.json');
  let cookies: object[];
  try {
    cookies = JSON.parse(await fs.readFile(cookiePath, 'utf-8'));
  } catch {
    console.error('No LinkedIn cookies found. Run `pnpm auth` first.');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addCookies(cookies as Parameters<typeof context.addCookies>[0]);

  const page = await context.newPage();

  console.log('[LinkedIn] Navigating to profile…');
  await page.goto('https://www.linkedin.com/in/me', {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });

  // LinkedIn redirects /in/me to the real profile slug
  const linkedinUrl = page.url();
  console.log('[LinkedIn] Profile URL:', linkedinUrl);

  await page.waitForTimeout(2000);

  const profile = await page.evaluate((): Omit<LinkedInProfile, 'avatarLocalPath' | 'fetchedAt'> => {
    // Name — from the h1 on the profile page
    const nameEl = document.querySelector('.text-heading-xlarge, h1');
    const fullName = nameEl?.textContent?.trim() ?? '';
    const [firstName = '', ...rest] = fullName.split(' ');
    const lastName = rest.join(' ');

    // Title
    const titleEl = document.querySelector('.text-body-medium.break-words, .pv-text-details__left-panel .text-body-medium');
    const jobTitle = titleEl?.textContent?.trim() ?? '';

    // Company (current position)
    const companyEl = document.querySelector('[aria-label*="Expérience"] .t-14.t-normal.t-black--light, .pv-entity__secondary-title');
    const company = companyEl?.textContent?.trim() ?? '';

    // Location
    const locationEl = document.querySelector('.text-body-small.inline.t-black--light.break-words, [class*="location"]');
    const location = locationEl?.textContent?.trim() ?? '';

    // Avatar
    const avatarEl = document.querySelector('.pv-top-card-profile-picture__image, img.profile-photo-edit__preview, img[class*="profile"][src*="licdn"]');
    const avatarUrl = (avatarEl as HTMLImageElement)?.src ?? '';

    return {
      firstName,
      lastName,
      jobTitle,
      company,
      location,
      avatarUrl,
      linkedinUrl: window.location.href,
    };
  });

  await browser.close();

  // Download avatar to local file
  let avatarLocalPath = '';
  if (profile.avatarUrl && profile.avatarUrl.startsWith('https')) {
    avatarLocalPath = path.join(OUTPUT_DIR, 'linkedin-avatar.jpg');
    try {
      await downloadImage(profile.avatarUrl, avatarLocalPath);
      console.log('[LinkedIn] Avatar saved to', avatarLocalPath);
    } catch {
      avatarLocalPath = '';
    }
  }

  const result: LinkedInProfile = {
    ...profile,
    avatarLocalPath,
    fetchedAt: new Date().toISOString(),
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'linkedin-profile.json'),
    JSON.stringify(result, null, 2)
  );

  console.log('\n[LinkedIn] Profile fetched:');
  console.log(`  Name     : ${result.firstName} ${result.lastName}`);
  console.log(`  Title    : ${result.jobTitle}`);
  console.log(`  Location : ${result.location}`);
  console.log(`  Avatar   : ${result.avatarUrl ? '✓' : '✗'}`);
  console.log('\nSaved to output/linkedin-profile.json');

  return result;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
