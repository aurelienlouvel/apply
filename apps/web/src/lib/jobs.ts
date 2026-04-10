import fs from 'node:fs/promises';
import path from 'node:path';
import type { Job, ScrapedOutput } from '@/types/jobs';

// turbopackIgnore: true
const OUTPUT_DIR =
  process.env.DATA_DIR ?? path.resolve(process.cwd(), '..', '.local', 'output');

export async function readJobs(): Promise<{ jobs: Job[]; scrapedAt: string | null }> {
  // Try merged file first, then per-platform fallback
  for (const filename of ['jobs.json', 'jobs-wttj.json']) {
    try {
      const raw = await fs.readFile(path.join(OUTPUT_DIR, filename), 'utf-8');
      const parsed: ScrapedOutput = JSON.parse(raw);
      if (parsed.jobs?.length > 0) {
        return { jobs: parsed.jobs, scrapedAt: parsed.scrapedAt };
      }
    } catch {
      // try next file
    }
  }
  return { jobs: [], scrapedAt: null };
}
