import { AppShell } from '@/components/layout/AppShell';
import { readSettings } from '@/lib/settings';
import { readJobs } from '@/lib/jobs';
import type { Job } from '@/types/jobs';

function groupByTitle(
  jobs: Job[],
  titles: string[],
  location: string
): { label: string; count: number }[] {
  return titles.map((title) => ({
    label: [title, location].filter(Boolean).join(', '),
    count: jobs.filter((j) => j.title.toLowerCase().includes(title.toLowerCase())).length,
  }));
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const [settings, { jobs }] = await Promise.all([readSettings(), readJobs()]);
  const jobGroups = groupByTitle(jobs, settings.searchTitles, settings.searchLocation);

  return (
    <AppShell settings={settings} jobGroups={jobGroups}>
      {children}
    </AppShell>
  );
}
