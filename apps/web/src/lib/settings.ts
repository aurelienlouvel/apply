import fs from 'node:fs/promises';
import path from 'node:path';
import type { Source } from '@/types/jobs';

const SETTINGS_PATH = path.resolve(process.cwd(), 'data', 'settings.json');
const COOKIES_DIR =
  process.env.COOKIES_DIR ?? path.resolve(process.cwd(), '..', 'cookies');

export interface AppSettings {
  // Profile
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  availability: string; // "immediate" | "1month" | "3months" | date string

  // Search Criteria
  searchTitles: string[];       // ["Product Designer", "UX/UI Designer"]
  contractTypes: string[];      // ["CDI", "Freelance", ...]
  experienceLevels: string[];   // ["Junior", "Confirmé", "Senior"]
  searchLocation: string;
  companySizes: string[];       // ["0-15", "15-50", "50-500", ">500"]
  salaryMin: number | null;
  salaryMax: number | null;
  remotePreference: string[];   // ["Télétravail", "Hybride", "Présentiel"]
  noGos: string[];              // sectors / topics to exclude
}

export const DEFAULT_SETTINGS: AppSettings = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  location: '',
  availability: '',
  searchTitles: [],
  contractTypes: [],
  experienceLevels: [],
  searchLocation: '',
  companySizes: [],
  salaryMin: null,
  salaryMax: null,
  remotePreference: [],
  noGos: [],
};

export async function readSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, 'utf-8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function writeSettings(patch: Partial<AppSettings>): Promise<void> {
  const current = await readSettings();
  const updated = { ...current, ...patch };
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(updated, null, 2));
}

export async function checkSourceConnected(source: Source): Promise<boolean> {
  try {
    const raw = await fs.readFile(
      path.join(COOKIES_DIR, `${source}.json`),
      'utf-8'
    );
    const cookies = JSON.parse(raw);
    return Array.isArray(cookies) && cookies.length > 0;
  } catch {
    return false;
  }
}
