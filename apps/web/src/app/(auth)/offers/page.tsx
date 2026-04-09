import { Suspense } from 'react';
import { readJobs } from '@/lib/jobs';
import { JobGrid } from '@/components/jobs/JobGrid';
import { JobFilters } from '@/components/jobs/JobFilters';
import type { Source } from '@/types/jobs';

interface SearchParams {
  source?: string;
  contract?: string;
}

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { jobs, scrapedAt } = await readJobs();

  const filtered = jobs
    .filter((j) => !params.source || j.source === (params.source as Source))
    .filter((j) => !params.contract || j.contract === params.contract);

  return (
    <div className="flex h-full flex-col gap-0">
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
        <Suspense>
          <JobFilters totalCount={filtered.length} />
        </Suspense>
        {scrapedAt && (
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated:{' '}
            {new Date(scrapedAt).toLocaleString('en-GB', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <JobGrid jobs={filtered} />
      </div>
    </div>
  );
}
