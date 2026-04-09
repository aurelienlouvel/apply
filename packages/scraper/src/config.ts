import path from 'node:path';
import { Source } from './types.js';

const root = path.resolve(import.meta.dirname, '../../..');

export const COOKIES_DIR = process.env.COOKIES_DIR ?? path.join(root, '.local', 'cookies');
export const OUTPUT_DIR  = process.env.DATA_DIR    ?? path.join(root, '.local', 'output');

// Add as many search URLs as you want per platform — they all run and results are deduplicated.
export const SEARCH_URLS: Record<Source, string[]> = {
  linkedin: [
    'https://www.linkedin.com/jobs/search/?keywords=product%20designer&location=France',
    'https://www.linkedin.com/jobs/search/?keywords=ux%20ui%20designer&location=France',
  ],
  wttj: [
    'https://www.welcometothejungle.com/fr/jobs?refinementList%5Bcontract_type%5D%5B%5D=full_time&refinementList%5Boffices.country_code%5D%5B%5D=FR&refinementList%5Boffices.district%5D%5B%5D=Paris&query=product%20designer&page=1&sortBy=mostRecent',
    'https://www.welcometothejungle.com/fr/jobs?refinementList%5Bcontract_type%5D%5B%5D=full_time&refinementList%5Boffices.country_code%5D%5B%5D=FR&refinementList%5Boffices.district%5D%5B%5D=Paris&query=ux%20ui%20designer&page=1&sortBy=mostRecent',
  ],
  hellowork: [
    'https://www.hellowork.com/fr-fr/emploi/recherche.html?k=product+designer&l=France',
    'https://www.hellowork.com/fr-fr/emploi/recherche.html?k=ux+ui+designer&l=France',
  ],
  jobsthatmakesense: [
    'https://jobs.makesense.org/jobs?query=product+designer',
    'https://jobs.makesense.org/jobs?query=ux+ui+designer',
  ],
};
